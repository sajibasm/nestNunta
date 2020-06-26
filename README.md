<div align="center">
  <img width="250" src="https://camo.githubusercontent.com/18fe3feea5e3593c593e12e552494a3995eceacf/687474703a2f2f6b616d696c6d79736c69776965632e636f6d2f7075626c69632f6e6573742d6c6f676f2e706e672331" alt="Awesome">
  <br>
  <h3>NestJS with User Login (MongoDB) </h3>
  <hr>
</div>

# Getting started

## Installation

Clone the repository

    git clone git@github.com:sajibasm/nestNunta.git

Switch to the repo folder

    cd nestNunta
    
Install dependencies
    
    yarn
    
    OR

    npm install

Create a .env file from .example.ev and write it as follows

    PORT = 5000
    MONGO_URI='mongodb://localhost/YOURMONGODBNAME'
    JWT_SECRET='YOURJWTSECRETCHANGEIT'
    ENCRYPT_JWT_SECRET='YOURJWTENCRIPTINGPASSCHANGEIT'
    JWT_EXPIRATION= 1h
 
----------

## Database

The example codebase uses [Mongoose](https://mongoosejs.com/).

----------

## YARN scripts
- `yarn run start:dev` - Start application in watch mode

----------
# Authentication
 
This applications uses JSON Web Token (JWT) to handle authentication.
This app uses <strong>refresh-Token</strong> mechanism to refresh jsonwebtoken after 30 minutes.

----------
 
# Swagger API docs

Visit http://127.0.0.1:{PORT}/doc in your browser
This example repo uses the NestJS swagger module for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)

## Authors

 **asmsajib**
