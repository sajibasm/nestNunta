
import { Request } from 'express';
import { Controller, Get, Post, Body, UseGuards, Req, HttpCode, HttpStatus, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard, PassportModule } from '@nestjs/passport';

import { ApiCreatedResponse, ApiOkResponse, ApiUseTags, ApiBearerAuth, ApiImplicitHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import { Login } from './dto/login';
import { Singup } from './dto/singup';
import { VerifyUuid } from './dto/verify.uuid';
import { ResetPassword } from './dto/reset.password';
import { RefreshAccessToken } from './dto/refresh-access.token';


import { ForgetResetPasswordSerialize } from './serialize/ForgetResetPasswordSerialize';
import { UserSerialize } from './serialize/UserSerialize';
import { RefreshAccessTokenSerialize } from './serialize/RefreshAccessTokenSerialize';

@ApiUseTags('User')
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post()
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({title: 'Singup'})
    @ApiCreatedResponse({  description: 'The record has been successfully created.', type: UserSerialize })
    async register(@Req() req: Request, @Body() createUserDto: Singup): Promise<UserSerialize> {
        return await this.userService.create(req, createUserDto);
    }

    @Post('login')
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({title: 'Login User'})
    @ApiOkResponse({})
    async login(@Req() req: Request, @Body() loginUserDto: Login) {
        return await this.userService.login(req, loginUserDto);
    }

    @Post('refresh-access-token')
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({title: 'Refresh Access Token with refresh token'})
    @ApiCreatedResponse({})
    async refreshAccessToken(@Body() refreshAccessTokenDto: RefreshAccessToken): Promise<RefreshAccessTokenSerialize> {
        return await this.userService.refreshAccessToken(refreshAccessTokenDto);
    }

    @Post('verify-email')
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({title: 'Verify Email'})
    @ApiOkResponse({})
    async verifyEmail(@Req() req: Request, @Body() verifyUuidDto: VerifyUuid): Promise<UserSerialize> {
        return await this.userService.verifyEmail(req, verifyUuidDto);
    }

    // @Post('forgot-password')
    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({title: 'Forgot password',})
    // @ApiOkResponse({})
    // async forgotPassword(@Req() req: Request, @Body() createForgotPasswordDto: CreateForgotPasswordDto) {
    //     return await this.userService.forgotPassword(req, createForgotPasswordDto);
    // }

    @Post('forgot-password-verify')
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({title: 'Verfiy forget password code'})
    @ApiOkResponse({})
    async forgotPasswordVerify(@Req() req: Request, @Body() verifyUuidDto: VerifyUuid): Promise<ForgetResetPasswordSerialize> {
        return await this.userService.forgotPasswordVerify(req, verifyUuidDto);
    }

    @Post('reset-password')
    @UseInterceptors(ClassSerializerInterceptor)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({title: 'Reset password after verify reset password'})
    @ApiBearerAuth()
    @ApiImplicitHeader({name: 'Bearer', description: 'the token we need for auth.'})
    @ApiOkResponse({})
    async resetPassword(@Body() resetPasswordDto: ResetPassword): Promise<ForgetResetPasswordSerialize> {
        return await this.userService.resetPassword(resetPasswordDto);
    }

    @Get('data')
    @UseGuards(AuthGuard('jwt'))
    // @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({title: 'A private route for check the auth'})
    @ApiImplicitHeader({name: 'Bearer', description: 'the token we need for auth.'})
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({})
    findAll() {
        return this.userService.findAll();
    }
}
