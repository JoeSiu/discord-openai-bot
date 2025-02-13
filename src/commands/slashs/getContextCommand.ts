import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { t } from "../../services/i18n.js";
import { openAIBot } from "../../entities/openAIBot.js";
import ApplicationCommand from "../../templates/applicationCommand.js";

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName("get-context")
        .setDescription("Get context"),

    async execute(interaction): Promise<void> {
        const context = openAIBot.getFullContext();
        const contextLength = openAIBot.context.length;
        const contextToken = openAIBot.estimateContextTokens();

        const embed = new EmbedBuilder()
            // .setDescription("")
            .setFooter({
                text: `Context length: ${contextLength} | Context tokens: ${contextToken}`
            });

        interaction.reply({ embeds: [embed] });
    }
});
