/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { REST } from "@discordjs/rest";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import { readdirSync } from "fs";
import { config } from "./data/config.js";
import type ApplicationCommand from "./templates/applicationCommand.js";
import { SLASH_COMMANDS_PATH } from "./constants/constants.js";

export default async function deployGlobalCommands() {
    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    const commandFiles: string[] = readdirSync(SLASH_COMMANDS_PATH).filter(
        (file) => file.endsWith(".js") || file.endsWith(".ts")
    );

    for (const file of commandFiles) {
        const command: ApplicationCommand = (
            await import(`${SLASH_COMMANDS_PATH}${file}`)
        ).default as ApplicationCommand;
        const commandData = command.data.toJSON();
        commands.push(commandData);
        console.log(`Added global (/) command: ${command.data.name}`);
    }

    const rest = new REST({ version: "10" }).setToken(config.discord.token);

    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands(config.discord.clientId), {
            body: []
        });

        await rest.put(Routes.applicationCommands(config.discord.clientId), {
            body: commands
        });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}
