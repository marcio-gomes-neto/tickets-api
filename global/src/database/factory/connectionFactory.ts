import { Connection, createConnection } from 'typeorm';
import { IDatabaseConfiguration } from '../../interfaces/configuration/database/IDatabaseConfiguration';
import * as entities from '../entities';
export class ConnectionFactory {
    public static async init(conn:IDatabaseConfiguration): Promise<Connection> {
        const connection = await createConnection({
            type: 'postgres',
            host: conn.host,
            port: conn.port,
            username: conn.username,
            password: conn.password,
            database: conn.database,
            entities: Object.keys(entities).map( (key) => entities[key]),
            logging: true
        });
        
        return connection;
    }
}