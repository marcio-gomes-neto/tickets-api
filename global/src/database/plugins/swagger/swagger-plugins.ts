import { Server } from "hapi";
import { IPlugin } from "../../../interfaces/configuration/plugins/IPlugin";
import { ISwagger } from "../../../interfaces/configuration/plugins/Swagger/ISwagger";

const Inert = require('inert');
const Vision = require('@hapi/vision');

export class SwaggerPlugin implements IPlugin {

    constructor(private server: Server, private swaggerModel: ISwagger){}

    private swagger(): object {
        return {
            info: {
                title: this.swaggerModel.name,
                description: `${this.swaggerModel.name} Documentation`,
                version: this.swaggerModel.version,
            },
            tags:[
                {
                    name: this.swaggerModel.name,
                    description: this.swaggerModel.desc,
                },
            ],
            swaggerUI: true,
            documentationPage: true,
            documentationPath: '/docs'
        };
    }

    async register(): Promise<void> {
        const swaggerRegister = this.swagger();

        await this.server.register([
            Inert,
            Vision,
            {
                plugin: require('hapi-swagger'),
                options: swaggerRegister
            },
        ]);
    }
}