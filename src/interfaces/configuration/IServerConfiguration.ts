import { IDatabaseConfiguration } from "./database/IDatabaseConfiguration";

export interface IServerConfiguration{
    server: {
        env: string;
        port: number;
        baseURL: string;
    }
    database: IDatabaseConfiguration
}