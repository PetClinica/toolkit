# Discord

This library contains a client to send text messages to a discord channel.

## Usage

```ts
async function main() {
    const discord = new Discord("<token>");
    await discord.login();
    await discord.sendMessage("<channel_id>", "Hello world!");
    await discord.shutdown();
}
```
