import {Injectable, BadRequestException, NotFoundException, ConflictException} from '@nestjs/common';
import {Request} from 'express';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {v4} from 'uuid';
import {addHours} from 'date-fns';
import * as bcrypt from 'bcrypt';

import {AuthService} from '../auth/auth.service';
import {TrackService} from "../track/track.service";
import {CreateForgotPasswordDto} from './dto/create-forgot-password.dto';

import {Singup} from './dto/singup';
import {VerifyUuid} from './dto/verify.uuid';
import {RefreshAccessToken} from './dto/refresh-access.token';
import {ResetPassword} from './dto/reset.password';
import {Login} from './dto/login';

import {ForgotPassword} from './interfaces/forgot-password.interface';
import {User} from './interfaces/user.interface';
import {UserSerialize} from "./serialize/UserSerialize";
import {RefreshAccessTokenSerialize} from "./serialize/RefreshAccessTokenSerialize";
import {ForgetResetPasswordSerialize} from "./serialize/ForgetResetPasswordSerialize";
import {TokenSerialize} from "./serialize/TokenSerialize";


@Injectable()
export class UserService {

    HOURS_TO_VERIFY = 4;
    HOURS_TO_BLOCK = 6;
    LOGIN_ATTEMPTS_TO_BLOCK = 5;

    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('ForgotPassword') private readonly forgotPasswordModel: Model<ForgotPassword>,
        private readonly authService: AuthService,
        //private readonly trackService: TrackService
    ) {
    }

    // Create User
    async create(req: Request, createUserDto: Singup): Promise<UserSerialize> {
        const user = new this.userModel(createUserDto);
        await this.isEmailUnique(user.email);
        this.setRegistrationInfo(user);
        this.setUserAsVerified(user);
        return this.userResponse(req, user, false);
    }

    // Login
    async login(req: Request, loginUserDto: Login): Promise<UserSerialize> {
        const user = await this.findUserByEmail(loginUserDto.email);
        this.isUserBlocked(user);
        await this.checkPassword(loginUserDto.password, user);
        await this.passwordsAreMatch(user);

        return this.userResponse(req, user);
    }

    // RefreshAccessToken
    async refreshAccessToken(refreshAccessTokenDto: RefreshAccessToken): Promise<RefreshAccessTokenSerialize> {
        const userId = await this.authService.findRefreshToken(refreshAccessTokenDto.refreshToken);
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new BadRequestException('Bad request');
        }

        return new RefreshAccessTokenSerialize({accessToken: await this.authService.createAccessToken(user)});
    }

    // VerifyEmail
    async verifyEmail(req: Request, verifyUuidDto: VerifyUuid): Promise<UserSerialize> {
        const user = await this.findByVerification(verifyUuidDto.verification);
        await this.setUserAsVerified(user);
        return this.userResponse(req, user);
    }

    // forgetPasswordVerify
    async forgotPasswordVerify(req: Request, verifyUuidDto: VerifyUuid): Promise<ForgetResetPasswordSerialize> {
        const forgotPassword = await this.findForgotPasswordByUuid(verifyUuidDto);
        await this.setForgotPasswordFirstUsed(req, forgotPassword);
        return new ForgetResetPasswordSerialize({
            email: forgotPassword.email,
            message: 'now reset your password.'
        });
    }

    // resetPassword
    async resetPassword(resetPasswordDto: ResetPassword): Promise<ForgetResetPasswordSerialize> {
        const forgotPassword = await this.findForgotPasswordByEmail(resetPasswordDto);
        await this.setForgotPasswordFinalUsed(forgotPassword);
        await this.resetUserPassword(resetPasswordDto);
        return new ForgetResetPasswordSerialize({
            email: resetPasswordDto.email,
            message: 'password successfully changed.',
        });
    }

    findAll(): any {
        return {hello: 'world'};
    }

    // All Private Method
    private async isEmailUnique(email: string) {
        const user = await this.userModel.findOne({email});
        if (user) {
            throw new BadRequestException(`${email} address already in use `);
        }
    }

    private setRegistrationInfo(user): any {
        user.verification = v4();
        user.verificationExpires = addHours(new Date(), this.HOURS_TO_VERIFY);
    }

    private async userResponse(req, user, isFull = true): Promise<UserSerialize> {
        return new UserSerialize({
            ...user._doc,
            ...new TokenSerialize({
                accessToken: await this.authService.createAccessToken(user),
                expiresIn: process.env.JWT_EXPIRATION,
                refreshToken: await this.authService.createRefreshToken(req, user._id)
            }),
            //settings: await this.trackService.getUserSettings()
        });

    }

    private async findByVerification(verification: string): Promise<User> {
        const user = await this.userModel.findOne({
            verification,
            verified: false,
            verificationExpires: {$gt: new Date()}
        });
        if (!user) {
            throw new BadRequestException('Bad request.');
        }
        return user;
    }

    private async findByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({email, verified: true});
        if (!user) {
            throw new NotFoundException('Email not found.');
        }
        return user;
    }

    private async setUserAsVerified(user) {
        user.verified = true;
        await user.save();
    }

    private async findUserByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({email, verified: true});
        if (!user) {
            throw new NotFoundException('Wrong email or password.');
        }
        return user;
    }

    private async checkPassword(attemptPass: string, user) {
        const match = await bcrypt.compare(attemptPass, user.password);
        if (!match) {
            await this.passwordsDoNotMatch(user);
            throw new NotFoundException('Wrong email or password.');
        }
        return match;
    }

    private isUserBlocked(user) {
        if (user.blockExpires > Date.now()) {
            throw new ConflictException('User has been blocked try later.');
        }
    }

    private async passwordsDoNotMatch(user) {
        user.loginAttempts += 1;
        await user.save();
        if (user.loginAttempts >= this.LOGIN_ATTEMPTS_TO_BLOCK) {
            await this.blockUser(user);
            throw new ConflictException('User blocked.');
        }
    }

    private async blockUser(user) {
        user.blockExpires = addHours(new Date(), this.HOURS_TO_BLOCK);
        await user.save();
    }

    private async passwordsAreMatch(user) {
        user.loginAttempts = 0;
        await user.save();
    }

    // private async saveForgotPassword(req: Request, createForgotPasswordDto: CreateForgotPasswordDto) {
    //     // @ts-ignore
    //     const forgotPassword = await this.forgotPasswordModel.create({
    //         email: createForgotPasswordDto.email,
    //         verification: v4(),
    //         expires: addHours(new Date(), this.HOURS_TO_VERIFY),
    //         //ip: this.authService.getIp(req),
    //         browser: this.authService.getBrowserInfo(req),
    //         country: this.authService.getCountry(req),
    //     });
    //     await forgotPassword.save();
    // }

    private async findForgotPasswordByUuid(verifyUuidDto: VerifyUuid): Promise<ForgotPassword> {
        const forgotPassword = await this.forgotPasswordModel.findOne({
            verification: verifyUuidDto.verification,
            firstUsed: false,
            finalUsed: false,
            expires: {$gt: new Date()},
        });
        if (!forgotPassword) {
            throw new BadRequestException('Bad request.');
        }
        return forgotPassword;
    }

    private async setForgotPasswordFirstUsed(req: Request, forgotPassword: ForgotPassword) {
        forgotPassword.firstUsed = true;
        forgotPassword.ipChanged = this.authService.getIp(req);
        forgotPassword.browserChanged = this.authService.getBrowserInfo(req);
        forgotPassword.countryChanged = this.authService.getCountry(req);
        await forgotPassword.save();
    }

    private async findForgotPasswordByEmail(resetPasswordDto: ResetPassword): Promise<ForgotPassword> {
        const forgotPassword = await this.forgotPasswordModel.findOne({
            email: resetPasswordDto.email,
            firstUsed: true,
            finalUsed: false,
            expires: {$gt: new Date()},
        });
        if (!forgotPassword) {
            throw new BadRequestException('Bad request.');
        }
        return forgotPassword;
    }

    private async setForgotPasswordFinalUsed(forgotPassword: ForgotPassword) {
        forgotPassword.finalUsed = true;
        await forgotPassword.save();
    }

    private async resetUserPassword(resetPasswordDto: ResetPassword) {
        const user = await this.userModel.findOne({
            email: resetPasswordDto.email,
            verified: true,
        });
        user.password = resetPasswordDto.password;
        await user.save();
    }
}
