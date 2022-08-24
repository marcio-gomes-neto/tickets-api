require('dotenv').config();

import { IDatabaseConfiguration } from "../../interfaces/configuration/database/IDatabaseConfiguration";

export class DatabaseConfiguration implements IDatabaseConfiguration {
    host: string = process.env.DB_HOST;
    port:number = parseInt(process.env.DB_PORT as string, 10);
    username: string = process.env.DB_USERNAME;
    password: string = process.env.DB_PASSWORD;
    database: string = process.env.DB_DATABASE;
}