import {Exclude, Expose} from 'class-transformer';

export class ForgetResetPasswordSerialize {
    email: string;
    message: string;
    constructor(partial: Partial<ForgetResetPasswordSerialize>) {
        Object.assign(this, partial);
    }
}
