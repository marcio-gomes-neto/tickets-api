import { ServerConfiguration } from "./configuration";
import { ConnectionFactory } from "./database/factory/connectionFactory";
import { TicketsServer } from "./server";

(async () => {
    try {
        
        const configuration = new ServerConfiguration();
        await ConnectionFactory.init(configuration.database);
        console.log('Connected to database.');

        const server = new TicketsServer(configuration);
        const hapiServer = await server.init();
        
        hapiServer.start();
        console.log('Server Running at: ' + hapiServer.info.uri);
        console.log('Ready to receive requests.');

    } catch (error) {
        console.log('Error starting server: ', error);
    }
})();