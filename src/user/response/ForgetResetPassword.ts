import {Exclude, Expose} from 'class-transformer';

export class ForgetResetPasswordEntity {
    email: string;
    message: string;
    constructor(partial: Partial<ForgetResetPasswordEntity>) {
        Object.assign(this, partial);
    }
}
