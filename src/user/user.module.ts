import {MongooseModule} from '@nestjs/mongoose';
import {UserSchema} from './schemas/user.schema';
import {Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {AuthModule} from 'src/auth/auth.module';
import {TrackModule} from 'src/track/track.module'
import {ForgotPasswordSchema} from './schemas/forgot-password.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
        MongooseModule.forFeature([{name: 'ForgotPassword', schema: ForgotPasswordSchema}]),
        AuthModule,
        TrackModule
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {
}
