require('dotenv').config();

import { DatabaseConfiguration, IServerConfiguration } from 'global-database'

export class ServerConfiguration implements IServerConfiguration {
    server = {
        env: process.env.NODE_ENV,
        port: parseInt(process.env.PORT),
        baseURL: process.env.API_URL
    };

    database = new DatabaseConfiguration();
}