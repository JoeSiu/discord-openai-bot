import { Events } from "discord.js";
import { openAIBot } from "../entities/openAIBot.js";
import { logger } from "../services/logger.js";
import Event from "../templates/event.js";

export default new Event({
    name: Events.ClientReady,
    once: true,
    execute(): void {
        // Runs when the bot logs in
        logger.info(`Logged in as ${client.user?.tag as string}!`);

        // Change bot to default
        openAIBot.changeBot(openAIBot.botConfig);
    }
});
