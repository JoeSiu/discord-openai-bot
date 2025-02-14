import * as fs from "fs";
import OpenAI from "openai";
import { promptTokensEstimate } from "openai-chat-tokens";
import { ChatCompletionMessageParam } from "openai/resources/index.js";
import * as path from "path";
import { config } from "../data/config.js";
import { BotConfig } from "../data/parsers/configParser.js";
import { logger } from "../services/logger.js";
import { isValidPathString } from "../utils/pathUtils.js";

export class OpenAIBot {
    public client: OpenAI;
    public botConfig: BotConfig;
    public prompt: string;
    public context: ChatCompletionMessageParam[] = [];

    constructor() {
        this.botConfig = config.bots[0];
        this.prompt = "";
        this.client = new OpenAI({ apiKey: "" });
    }

    public async changeBotById(id: string) {
        const botConfig = config.bots.find((b) => b.id === id);
        if (!botConfig) throw new Error(`Bot ID ${id} not found`);
        await this.changeBot(botConfig);
    }

    public async changeBot(botConfig: BotConfig) {
        this.botConfig = botConfig;

        // Update client
        this.client = new OpenAI({
            baseURL: botConfig.provider.baseURL,
            apiKey: botConfig.provider.apiKey
        });

        // Update prompt
        this.prompt = isValidPathString(botConfig.prompt)
            ? fs.readFileSync(
                path.join(process.cwd(), botConfig.prompt),
                "utf-8"
            ) // TODO: make this async
            : botConfig.prompt;

        // Update discord representation
        try {
            await client.guilds.cache
                .get(config.discord.guildId)
                ?.members.me?.setNickname(botConfig.nickname);
            await client.user?.setAvatar(botConfig.avatar);
        } catch (error) {
            logger.error("Failed to update discord representation: ", error);
        }

        logger.info(`Bot changed to [${this.botConfig.id}]`);
    }

    public addContext(chat: ChatCompletionMessageParam): ChatCompletionMessageParam[] {
        this.context.push(chat);
        return this.getFullContext();
    }

    public getFullContext(): ChatCompletionMessageParam[] {
        return [{ role: "system", content: this.prompt }, ...this.context];
    }

    public clearContext(amount = -1) {
        if (amount < 0) {
            this.context = [];
            return;
        } else {
            this.context = this.context.slice(0, -amount);
        }
    }

    public estimateContextTokens(): number {
        const estimate = promptTokensEstimate({
            messages: this.getFullContext()
        });
        return estimate;
    }
}

export const openAIBot = new OpenAIBot();
