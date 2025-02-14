/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { REST } from "@discordjs/rest";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import { readdirSync } from "fs";
import { SLASH_COMMANDS_DIR_PATH } from "./constants/constants.js";
import { config } from "./data/config.js";
import { logger } from "./services/logger.js";
import type ApplicationCommand from "./templates/applicationCommand.js";

export default async function deployGuildCommands() {
    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    const commandFiles: string[] = readdirSync(SLASH_COMMANDS_DIR_PATH).filter(
        (file) => file.endsWith(".js") || file.endsWith(".ts")
    );

    for (const file of commandFiles) {
        const command: ApplicationCommand = (
            await import(`${SLASH_COMMANDS_DIR_PATH}${file}`)
        ).default as ApplicationCommand;
        const commandData = command.data.toJSON();
        commands.push(commandData);
        logger.info(`Added guild (/) command: ${command.data.name}`);
    }

    const rest = new REST({ version: "10" }).setToken(config.discord.token);

    try {
        logger.info("Started refreshing guild (/) commands.");

        await rest.put(
            Routes.applicationGuildCommands(
                config.discord.clientId,
                config.discord.guildId
            ),
            {
                body: commands
            }
        );

        logger.info("Successfully reloaded guild (/) commands.");
    } catch (error) {
        logger.error("Failed to reload guild (/) commands: ", error);
    }
}
