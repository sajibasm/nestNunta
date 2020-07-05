import {Exclude, Expose} from 'class-transformer';

export class UserEntity {

    email: string;
    fullName: string;
    accessToken: string;
    refreshToken: string;

    @Exclude()
    _id: string;

    @Exclude()
    verification: string;

    @Exclude()
    roles: string;

    @Exclude()
    blockExpires: string;

    @Exclude()
    verificationExpires: string;

    @Exclude()
    verified: string;

    @Exclude()
    loginAttempts: string;

    @Exclude()
    password: string;

    @Exclude()
    createdAt: string;

    @Exclude()
    updatedAt: string;

    // @Expose()
    // get nick(): string {
    //     return `${this.fullName}-ASM`;
    // }


    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
