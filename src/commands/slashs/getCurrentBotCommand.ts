import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { t } from "../../services/i18n.js";
import { openAIBot } from "../../entities/openAIBot.js";
import ApplicationCommand from "../../templates/applicationCommand.js";
import { config } from "../../data/config.js";
import { truncateString } from "../../utils/stringUtils.js";
import { error } from "console";

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName("get-current-bot")
        .setDescription(t.commandDescriptions.getCurrentBot()),

    async execute(interaction): Promise<void> {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: openAIBot.botConfig.nickname,
                iconURL: openAIBot.botConfig.avatar
            })
            .setTitle(openAIBot.botConfig.id)
            .setDescription(
                `\`\`\`\n${truncateString(openAIBot.prompt, 1024)}\`\`\``
            )
            .setThumbnail(openAIBot.botConfig.avatar)
            .addFields(
                {
                    name: t.terms.provider(),
                    value: openAIBot.botConfig.provider.baseURL
                },
                { name: t.terms.model(), value: openAIBot.botConfig.model }
            );

        interaction.reply({ embeds: [embed] });
    }
});
