require('dotenv').config();

import { IServerConfiguration } from "../interfaces/configuration/IServerConfiguration";
import { DatabaseConfiguration } from "./database/configuration";

export class ServerConfiguration implements IServerConfiguration {
    server = {
        env: process.env.NODE_ENV,
        port: parseInt(process.env.PORT),
        baseURL: process.env.API_URL
    };

    database = new DatabaseConfiguration();
}