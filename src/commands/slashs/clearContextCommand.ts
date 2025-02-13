import { SlashCommandBuilder } from "discord.js";
import { t } from "../../services/i18n.js";
import { openAIBot } from "../../entities/openAIBot.js";
import ApplicationCommand from "../../templates/applicationCommand.js";

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName("clear-context")
        .setDescription(t.commandDescriptions.clearContext())
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("Clear context up to this count")
        ) as SlashCommandBuilder,

    async execute(interaction): Promise<void> {
        const count = interaction.options.getInteger("amount") ?? -1;
        openAIBot.clearContext(count);
        interaction.reply(`> ${t.messages.contextCleared()}`);
    }
});
