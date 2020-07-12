import {Exclude, Expose} from 'class-transformer';

export class TokenSerialize {
    accessToken: string;
    expiresIn: string;
    refreshToken: string;
    constructor(partial: Partial<TokenSerialize>) {
        Object.assign(this, partial);
    }
}
