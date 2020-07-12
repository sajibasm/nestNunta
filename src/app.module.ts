import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TrackModule } from "./track/track.module";
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        MongooseModule.forRoot(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}),
        UserModule,
        AuthModule,
        TrackModule
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule {
}
