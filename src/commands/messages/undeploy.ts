import { config } from "../../data/config.js";
import MessageCommand from "../../templates/messageCommand.js";

export default new MessageCommand({
    name: "undeploy",
    description: "Un-deploys the slash commands",
    async execute(message, args): Promise<void> {
        if (message.author.id !== config.discord.ownerId) return;

        if (!args[0]) {
            await message.reply(
                `Incorrect number of arguments! The correct format is \`${config.command.messageCommandPrefix}undeploy <guild/global>\``
            );
            return;
        }

        if (args[0].toLowerCase() === "global") {
            // global undeployment

            // undeploy the commands
            await client.application?.commands.set([]);

            await message.reply({ content: "Un-deployed global commands" });
        } else if (args[0].toLowerCase() === "guild") {
            // guild deployment

            // undeploy the commands
            await message.guild?.commands.set([]);

            await message.reply({ content: "Un-deployed guild commands" });
        }
    }
});
