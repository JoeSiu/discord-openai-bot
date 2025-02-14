import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Message, TextChannel } from "discord.js";
import { ChatCompletionContentPart, ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { config } from "../data/config.js";
import { openAIBot } from "../entities/openAIBot.js";
import { t } from "../services/i18n.js";
import { logger } from "../services/logger.js";
import Event from "../templates/event.js";
import type MessageCommand from "../templates/messageCommand.js";
import pRetry from "p-retry";
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
        logger.error(error);
    }
}

async function replyMessage(message: Message) {
    //  Check if the message is from self
    if (message.author.id === client.user?.id) return;

    // Ignore messages that start with the ignore command prefix
    if (message.content.startsWith(config.command.ignoreCommandPrefix)) return;

    // Get the channel the message was sent in
    const channel = client.channels.cache.get(message.channelId);
    if (!(channel instanceof TextChannel)) return;


    let messageRef: Message<boolean> | undefined;
    try {
        // Query the bot
        const maxRetries = 5;
        const assistantResponses = await pRetry(
            () => query(message, channel),
            {
                retries: maxRetries,
                onFailedAttempt: async error => {
                    logger.warn(`Fail to query the bot, retrying...`, error);
                    const retries = `${error.attemptNumber}/${maxRetries}`;
                    const replyContent = t.messages.queryRetrying({ retries: retries });
                    if (!messageRef) {
                        messageRef = await message.reply({ content: replyContent });
                    }
                    else {
                        await messageRef.edit({ content: replyContent });
                    }
                }
            });

        // Send the response
        if (!messageRef) {
            messageRef = await message.reply({ content: assistantResponses });
        }
        else {
            await messageRef.edit({ content: assistantResponses });
        }
        logger.debug(`Message sent to [${message.author.username}]: ${assistantResponses}`);
    } catch (error) {
        logger.error("Fail to query the bot", error);

        // Create a response to the user
        const replyContent = t.messages.responseFailed({ error: `\n\`\`\`${error}\`\`\`` });
        if (!messageRef) {
            messageRef = await message.reply({ content: replyContent });
        }
        else {
            await messageRef.edit({ content: replyContent });
        }
    }
}

async function query(message: Message, channel: TextChannel): Promise<string> {
    channel.sendTyping();

    // Create query contexts
    let contentPart: ChatCompletionContentPart[] = [];

    // Text
    logger.debug(`Message received from [${message.author.username}]: ${message.content}`);
    contentPart.push({ type: "text", text: message.content });

    // Attachments
    const attachments = message.attachments;
    if (attachments.size > 0) {
        attachments.forEach((attachment) => {
            logger.debug(`Attachment received from [${message.author.username}]: ${attachment.url}`);
            contentPart.push({ type: "image_url", image_url: { url: attachment.url } });
        });
    }

    const userContext: ChatCompletionMessageParam = { role: "user", content: contentPart };

    // Create completion request
    const context: ChatCompletionMessageParam[] = [...openAIBot.getFullContext(), userContext];
    const stream = await openAIBot.client.chat.completions.create({
        model: openAIBot.botConfig.model,
        messages: context,
        stream: true
    });

    // Collect responses
    let assistantResponses = "";
    for await (const chunk of stream) {
        const choice = chunk.choices[0];
        const content = choice?.delta?.content ?? "";
        assistantResponses += content;
        channel.sendTyping();
    }

    if (assistantResponses === "") {
        throw new Error("Response is empty");
    }

    const assistantContext: ChatCompletionMessageParam = { role: "assistant", content: assistantResponses };

    // Add context to the bot's memory
    openAIBot.addContext(userContext);
    openAIBot.addContext(assistantContext);

    return assistantResponses;
}