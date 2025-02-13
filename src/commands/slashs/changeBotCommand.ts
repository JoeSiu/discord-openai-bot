import { SlashCommandBuilder } from "discord.js";
import { config } from "../../data/config.js";
import { openAIBot } from "../../entities/openAIBot.js";
import ApplicationCommand from "../../templates/applicationCommand.js";
import { t } from "../../services/i18n.js";

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName("change-bot")
        .setDescription("Change bot")
        .addStringOption((option) =>
            option
                .setName("bot-id")
                .setDescription("ID to search for")
                .setAutocomplete(true)
                .setRequired(true)
        ) as SlashCommandBuilder,

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        let choices: string[] = [];

        if (focusedOption.name === "bot-id") {
            choices = config.bots.map((bot) => bot.id);
        }

        const filtered = choices.filter((choice) =>
            choice.startsWith(focusedOption.value)
        );
        await interaction.respond(
            filtered.map((choice) => ({ name: choice, value: choice }))
        );
    },
    async execute(interaction) {
        const query = interaction.options.getString("bot-id");

        if (!query) return;

        try {
            await openAIBot.changeBotById(query);
            const formattedQuery = `\`${query}\``;
            await interaction.reply(
                `> ${t.messages.changedBot({ botKey: formattedQuery })}`
            );
        } catch (error) {
            await interaction.reply(`> Failed to change bot: ${error}`);
        }
    }
});
