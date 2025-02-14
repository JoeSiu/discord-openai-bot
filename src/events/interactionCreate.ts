import { BaseInteraction, Events } from "discord.js";
import { logger } from "../services/logger.js";
import type ApplicationCommand from "../templates/applicationCommand.js";
import Event from "../templates/event.js";

export default new Event({
    name: Events.InteractionCreate,
    async execute(interaction: BaseInteraction): Promise<void> {
        if (interaction.isChatInputCommand()) {
            if (!client.slashCommands.has(interaction.commandName)) return;
            try {
                const command: ApplicationCommand =
                    (await client.slashCommands.get(
                        interaction.commandName
                    )) as ApplicationCommand;

                if (!command.execute) {
                    logger.error(
                        `Failed to find execution handler for ${command.data.name}`
                    );
                    await interaction.reply({
                        content:
                            "There was an error while executing this command!",
                        ephemeral: true
                    });
                    return;
                }

                await command.execute(interaction);
            } catch (error) {
                logger.error(error);
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true
                });
            }
        } else if (interaction.isAutocomplete()) {
            if (!client.slashCommands.has(interaction.commandName)) return;

            try {
                const command: ApplicationCommand =
                    (await client.slashCommands.get(
                        interaction.commandName
                    )) as ApplicationCommand;

                if (!command.autocomplete) {
                    logger.error(
                        `Failed to find autocomplete handler for ${command.data.name}`
                    );
                    await interaction.respond([
                        {
                            name: "Failed to autocomplete",
                            value: "error"
                        }
                    ]);
                    return;
                }

                await command.autocomplete(interaction);
            } catch (error) {
                logger.error(error);
            }
        }
    }
});
