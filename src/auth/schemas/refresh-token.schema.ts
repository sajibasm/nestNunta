import {Schema} from 'mongoose';
import mongoose from "mongoose";
import * as moment from 'moment'

export const RefreshTokenSchema = new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        refreshToken: {
            type: String,
            required: true,
        },
        ip: {
            type: String,
            required: true,
        },
        browser: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        expiredAt: {
            type: Date
        }
    },
    {
        versionKey: false,
        timestamps: true,
    });


RefreshTokenSchema.pre('save', async function (next: mongoose.HookNextFunction) {
    try {

        // tslint:disable-next-line:no-string-literal
        // tslint:disable-next-line:no-string-literal
        this['expiredAt'] = moment().add(30, "days");
        return next();
    } catch (err) {
        return next(err);
    }
});
