import {Exclude, Expose} from 'class-transformer';

export class RefreshAccessTokenRes {
    accessToken: string;
    constructor(partial: Partial<RefreshAccessTokenRes>) {
        Object.assign(this, partial);
    }
}
