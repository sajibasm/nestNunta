import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {warn} from 'console';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {ValidationPipe} from '@nestjs/common';
import {UserModule} from './user/user.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global Pipe
    app.useGlobalPipes(new ValidationPipe({
        // disableErrorMessages: true,
    }));

    //app.setGlobalPrefix('/api/v1')

    // swagger Api Doc
    const options = new DocumentBuilder()
        .setTitle('API')
        .setDescription('API description')
        .setVersion('1.0')
        .setSchemes('http')
        .setContactEmail('sajibcse03@gmail.com')
        .setTermsOfService('TOS')
        .addTag('API')
        .build();
    const document = SwaggerModule.createDocument(app, options, { include: [ UserModule ],});
    SwaggerModule.setup('doc', app, document);

    // Global Port
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
    warn(`APP IS LISTENING TO PORT ${PORT}`);
}

bootstrap();
