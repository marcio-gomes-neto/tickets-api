import { IServerConfiguration } from './interfaces/configuration/IServerConfiguration';
import { Request, Server } from 'hapi';

import * as Userdata from './api/controllers/user';
import { SwaggerPlugin } from './configuration/plugins/swagger/swagger-plugins';
import { registerPlugins } from './configuration/plugins/plugins-register';

export class TicketsServer {
    constructor (private configs: IServerConfiguration) {}

    private registerRoutes(server: Server){
        Userdata.startRoute(server);
        console.log('Routes registered.');
    }

    private async registerPlugins(server: Server){
        const swaggerPluggins = new SwaggerPlugin(server, {
            name: 'Tickets',
            version: '1.0.0',
            desc: 'Ticket E-Commerce'

        });

        await registerPlugins([swaggerPluggins]);
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

        server.realm.modifiers.route.prefix = '/api';

        this.registerRoutes(server);
        await this.registerPlugins(server);
        this.registerExtensions(server);

        return server;
    }
}