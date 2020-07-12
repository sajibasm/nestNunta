import {Exclude, Expose} from 'class-transformer';

export class RefreshAccessTokenSerialize {
    accessToken: string;
    constructor(partial: Partial<RefreshAccessTokenSerialize>) {
        Object.assign(this, partial);
    }
}
