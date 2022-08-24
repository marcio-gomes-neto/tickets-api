export interface IPlugin {
    register(): Promise<void>;
}