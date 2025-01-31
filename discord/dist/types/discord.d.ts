export declare class Discord {
    private client;
    private token;
    constructor(token: string);
    login(): Promise<void>;
    sendMessage(channelId: string, message: string): Promise<void>;
    shutdown(): Promise<void>;
}
