import { Request, Server } from 'hapi';

import * as Ticket from './api/controllers/ticket';
import { JwtPlugin, SwaggerPlugin, registerPlugins, IServerConfiguration } from 'global-database';

export class TicketsServer {
    constructor (private configs: IServerConfiguration) {}

    private registerRoutes(server: Server, config:IServerConfiguration){

        Ticket.startRoute(server, config);
        console.log('Routes registered.');
    }

    private async registerPlugins(server: Server){
        const jwtPlugin = new JwtPlugin(server, {
            privateKey: this.configs.jwt.privateKey,
            publicKey: this.configs.jwt.publicKey,
            expiration: this.configs.jwt.expiration,
            algorithm: this.configs.jwt.algorithm,
        })
        
        const swaggerPluggins = new SwaggerPlugin(server, {
            name: 'Tickets',
            version: '1.4.0',
            desc: 'Ticket E-Commerce'

        });

        await registerPlugins([jwtPlugin, swaggerPluggins]);
        console.log('Plugins registered.');
    }

    private registerExtensions(server: Server){
        server.events.on('request', (request: Request) => {
          const remoteAddress = request.info.remoteAddress;
          const method = request.method.toUpperCase();
          const path = request.path;
          
          console.log(`${remoteAddress} // ${method} ${path}`);
        });
    }

    async init(): Promise<Server> {
        const server = new Server({
            debug: { request: ['error'] },
            port: this.configs.server.port,
            routes: {
                cors: {
                    origin: ['*'],
                },
                validate: {
                    failAction: async (request, h , err) => {
                        if (err){
                            if(err['isJoi']) throw err;
                        }
                    }
                }
            }
        });

        server.realm.modifiers.route.prefix = '/ticket';

        this.registerExtensions(server);
        await this.registerPlugins(server);
        this.registerRoutes(server, this.configs);

        return server;
    }
}