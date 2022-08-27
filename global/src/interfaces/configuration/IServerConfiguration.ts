import { IDatabaseConfiguration } from "./database/IDatabaseConfiguration";
import { IJwt } from "./plugins/Jwt/IJwt";

export interface IServerConfiguration{
    server: {
        env: string;
        port: number;
        baseURL: string;
    }
    database: IDatabaseConfiguration;

    jwt: IJwt;

    emailer: {
        email: string;
        password: string;
    }
}