/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { config } from "../../data/config.js";
import deployGlobalCommands from "../../deployGlobalCommands.js";
import deployGuildCommands from "../../deployGuildCommands.js";
import { logger } from "../../services/logger.js";
import MessageCommand from "../../templates/messageCommand.js";

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

        logger.info(`Deploying commands by [${message.author.tag}}]`);

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
