"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discord = void 0;
const discord_js_1 = require("discord.js");
class Discord {
    client;
    token;
    constructor(token) {
        this.token = token;
        this.client = new discord_js_1.Client({ intents: [discord_js_1.IntentsBitField.Flags.Guilds, discord_js_1.IntentsBitField.Flags.GuildMessages, discord_js_1.IntentsBitField.Flags.GuildIntegrations] });
    }
    async login() {
        await this.client.login(this.token);
    }
    async sendMessage(channelId, message) {
        const channel = await this.client.channels.fetch(channelId);
        if (channel) {
            await channel.send(message);
            console.log("Message sent successfully");
        }
        else {
            console.error(`Channel ${channelId} not found`);
        }
    }
    async shutdown() {
        await this.client.destroy();
    }
}
exports.Discord = Discord;
