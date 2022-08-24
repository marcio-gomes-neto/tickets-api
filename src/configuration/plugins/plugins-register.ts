import { IPlugin } from "../../interfaces/configuration/plugins/IPlugin";

export const registerPlugins = async (plugins:IPlugin[]) => {
    for (const plugin of plugins){
        await plugin.register();
    }
};