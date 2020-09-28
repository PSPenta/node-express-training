node-express-training
=====================
> This repository contains descriptive Node Express project which covers basics of NodeJS as well as advanced *(intermediate level)* topics and ExpressJS as well.

If you need theoratical information, you can read [this](https://docs.google.com/document/d/17c6pEPkAsdw5HU_pKuPyzUgdpQvWHl-eHfePB349oUk/edit) document.

## Contents
* JS, ES6 *(Callbacks, Promises, Async Await)*
* Introducton to NodeJS *(Architecture, Middlewares)* and NPM
* ExpressJS framework
* MVC pattern
* Authentication and Authorisation
* File upload and download
* Express validations
* Rest APIs
* CRUD app using FileDB
* Relational Database
    * Core MySQL connectivity using **mysql2** module
    * Features of Object Relational Mapping using **sequelize** module
    * Additional features like DB migrations and seeding
    * Database relationships *(One-To-One, One-To-Many, Many-To-Many)*
    * Advanced features like Joins, Clauses
* Non-relational Database
    * Core MongoDB connectivity using **mongodb** module
    * Features of Object Document Mapping using **mongoose** module
    * Connecting multiple documents by embedding or referencing
    * Aggregation framework
* Email functionality
* API Documentation

## Setup
1. Clone the repository
    ```sh
    git clone https://github.com/PSPenta/node-express-training.git
    ```
2. Go to root directory and install all modules
   ```sh
   cd node-express-training
   npm i
   ```
3. Copy `.env.example` file to create `.env` and insert proper values
4. Create database using `sequelize-cli` as follows : 
   ```sh
   cd src/
   npx sequelize-cli db:create
   cd ..
   ```
   > *Note: There is no need to create Mongo database as it automatically gets created when the app is started.*
5. Start the server using `npm start` or `yarn start`
