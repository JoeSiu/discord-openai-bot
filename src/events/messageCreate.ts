import { Events, Message, TextChannel } from "discord.js";
import { config } from "../data/config.js";
import { openAIBot } from "../entities/openAIBot.js";
import type MessageCommand from "../templates/messageCommand.js";
import Event from "../templates/event.js";
export default new Event({
    name: Events.MessageCreate,
    async execute(message: Message): Promise<void> {
        registerMessageCommands(message);
        replyMessage(message);
    }
});

async function registerMessageCommands(message: Message) {
    // ! Message content is a priviliged intent now!

    // Handles non-slash commands, only recommended for deploy commands

    // filters out bots and non-prefixed messages
    if (
        !message.content.startsWith(config.command.messageCommandPrefix) ||
        message.author.bot
    )
        return;

    // fetches the application owner for the bot
    if (!client.application?.owner) await client.application?.fetch();

    // get the arguments and the actual command name for the inputted command
    const args = message.content
        .slice(config.command.messageCommandPrefix.length)
        .trim()
        .split(/ +/);
    const commandName = (<string>args.shift()).toLowerCase();

    const command =
        (client.messageCommands.get(commandName) as MessageCommand) ||
        (client.messageCommands.find(
            (cmd: MessageCommand): boolean =>
                cmd.aliases && cmd.aliases.includes(commandName)
        ) as MessageCommand);

    // dynamic command handling
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
    }
}

async function replyMessage(message: Message) {
    if (!message.member || message.member.user.bot) return;
    if (!message.guild) return;

    console.log(
        `Message received from [${message.author.username}]: ${message.content}`
    );

    try {
        // Ignore messages that start with the ignore command prefix
        if (message.content.startsWith(config.command.ignoreCommandPrefix))
            return;

        // Get the channel the message was sent in
        const channel = client.channels.cache.get(message.channelId);
        if (!(channel instanceof TextChannel)) return;

        channel.sendTyping();

        const context = openAIBot.updateContext(message.content);
        let responses = "";

        const stream = await openAIBot.client.chat.completions.create({
            model: openAIBot.botConfig.model,
            messages: context,
            stream: true
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content ?? "";
            responses += content;
            channel.sendTyping();
        }

        if (responses) {
            message.reply(responses);
            openAIBot.updateContext(responses);
            console.log(`Message sent: ${responses}`);
        } else {
            console.warn("No response from OpenAI!");
        }
    } catch (error) {
        console.error(error);
    }
}
