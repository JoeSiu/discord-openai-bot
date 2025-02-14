/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
import "dotenv/config";

import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { readdirSync } from "fs";
import {
    EVENTS_DIR_PATH,
    MESSAGE_COMMANDS_DIR_PATH,
    SLASH_COMMANDS_DIR_PATH
} from "./constants/constants.js";
import { config } from "./data/config.js";
import deployGuildCommands from "./deployGuildCommands.js";
import { logger } from "./services/logger.js";
import type ApplicationCommand from "./templates/applicationCommand.js";
import type Event from "./templates/event.js";
import type MessageCommand from "./templates/messageCommand.js";

await deployGuildCommands();

// Discord client object
global.client = Object.assign(
    new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent
        ],
        partials: [Partials.Channel]
    }),
    {
        slashCommands: new Collection<string, ApplicationCommand>(),
        messageCommands: new Collection<string, MessageCommand>()
    }
);

// Set each command in the commands folder as a command in the client.commands collection
const commandFiles: string[] = readdirSync(SLASH_COMMANDS_DIR_PATH).filter(
    (file) => file.endsWith(".js") || file.endsWith(".ts")
);
for (const file of commandFiles) {
    const command: ApplicationCommand = (
        await import(`${SLASH_COMMANDS_DIR_PATH}${file}`)
    ).default as ApplicationCommand;
    client.slashCommands.set(command.data.name, command);
    logger.debug(`Set (/) command: ${command.data.name}`);
}

const messageCommandFiles: string[] = readdirSync(MESSAGE_COMMANDS_DIR_PATH).filter(
    (file) => file.endsWith(".js") || file.endsWith(".ts")
);
for (const file of messageCommandFiles) {
    const command: MessageCommand = (
        await import(`${MESSAGE_COMMANDS_DIR_PATH}${file}`)
    ).default as MessageCommand;
    client.messageCommands.set(command.name, command);
    logger.debug(
        `Set (${config.command.messageCommandPrefix}) command: ${command.name}`
    );
}

// Event handling
const eventFiles: string[] = readdirSync(EVENTS_DIR_PATH).filter(
    (file) => file.endsWith(".js") || file.endsWith(".ts")
);
for (const file of eventFiles) {
    const event: Event = (await import(`${EVENTS_DIR_PATH}${file}`))
        .default as Event;
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    logger.info(`Registered event: ${event.name}`);
}

await client.login(config.discord.token);