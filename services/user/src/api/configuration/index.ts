require('dotenv').config();
import { DatabaseConfiguration, IServerConfiguration } from 'global-database'

export class ServerConfiguration implements IServerConfiguration {
    server = {
        env: process.env.NODE_ENV,
        port: parseInt(process.env.PORT),
        baseURL: process.env.API_URL
    };

    database = new DatabaseConfiguration();
    
    jwt = {
        privateKey: process.env.JWT_PRIVATE_KEY,
        publicKey: process.env.JWT_PUBLIC_KEY,
        algorithm: process.env.JWT_ALGORITHM,
        expiration: process.env.JWT_EXPIRATION
    };

    emailer = {
        email: process.env.EMAILER_EMAIL,
        password: process.env.EMAILER_PASSWORD
    }
}