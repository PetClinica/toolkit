import { Client, IntentsBitField, TextChannel } from 'discord.js';

export class Discord {
    private client: Client;
    private token: string;

    constructor(token: string) {
        this.token = token;
        this.client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildIntegrations] });
    }

    async login() {
        await this.client.login(this.token);
    }

    async sendMessage(channelId: string, message: string) {
        const channel = await this.client.channels.fetch(channelId) as TextChannel;
        if (channel) {
            await channel.send(message);
            console.log("Message sent successfully");
        } else {
            console.error(`Channel ${channelId} not found`);
        }
    }

    async shutdown() {
        await this.client.destroy();
    }
}
