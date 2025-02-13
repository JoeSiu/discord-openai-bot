import { SlashCommandBuilder } from "discord.js";
import { t } from "../../services/i18n.js";
import { openAIBot } from "../../entities/openAIBot.js";
import ApplicationCommand from "../../templates/applicationCommand.js";
import { config, reloadConfig } from "../../data/config.js";

export default new ApplicationCommand({
    data: new SlashCommandBuilder()
        .setName("reload-config")
        .setDescription(t.commandDescriptions.reloadConfig()),

    async execute(interaction): Promise<void> {
        reloadConfig();
        interaction.reply(`> ${t.messages.configReloaded()}`);
    }
});
