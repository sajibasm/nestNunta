import {Exclude, Expose, Type} from 'class-transformer';
import {UserSettingsSerialize} from "../../track/serialize/UserSettingsSerialize";
import {TokenSerialize} from "./TokenSerialize";

export class UserSerialize {

    email: string;
    fullName: string;

    @Expose({ name: "uid" })
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


    @Type(() => TokenSerialize)
    token: TokenSerialize

    @Type(() => UserSettingsSerialize)
    settings: UserSettingsSerialize;

    // @Expose()
    // get nick(): string {
    //     return `${this.fullName}-ASM`;
    // }
    constructor(partial: Partial<UserSerialize>) {
        Object.assign(this, partial);
    }
}
