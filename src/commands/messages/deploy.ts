/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { REST } from "@discordjs/rest";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import { readdirSync } from "fs";
import { config } from "../../data/config.js";
import type ApplicationCommand from "../../templates/applicationCommand.js";
import MessageCommand from "../../templates/messageCommand.js";
import { SLASH_COMMANDS_PATH } from "../../constants/constants.js";
import deployGuildCommands from "../../deployGuildCommands.js";
import deployGlobalCommands from "../../deployGlobalCommands.js";

export default new MessageCommand({
    name: "deploy",
    description: "Deploys the slash commands",
    async execute(message, args): Promise<void> {
        if (message.author.id !== config.discord.ownerId) return;

        if (!args[0]) {
            await message.reply({
                content: `Incorrect number of arguments! The correct format is \`${config.command.messageCommandPrefix}deploy <guild/global>\``
            });
            return;
        }

        console.log(`Deploying commands by ${message.author.tag}!}`);

        if (args[0].toLowerCase() === "global") {
            // global deployment
            try {
                await deployGlobalCommands();
                await message.reply({ content: "Deployed global commands" });
            } catch (error) {
                await message.reply({
                    content: "Fail to deploy global commands"
                });
            }
        } else if (args[0].toLowerCase() === "guild") {
            // guild deployment
            try {
                await deployGuildCommands();
                await message.reply({ content: "Deployed guild commands" });
            } catch (error) {
                await message.reply({
                    content: "Fail to deploy guild commands"
                });
            }
        }
    }
});
