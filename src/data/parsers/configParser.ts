// To parse this data:
//
//   import { Convert, Config } from "./file";
//
//   const config = Convert.toConfig(json);

export interface Config {
    discord: DiscordConfig;
    command: CommandConfig;
    misc: MiscConfig;
    bots: BotConfig[];
}

export interface BotConfig {
    id: string;
    nickname: string;
    avatar: string;
    model: string;
    prompt: string;
    provider: ProviderConfig;
}

export interface ProviderConfig {
    baseURL: string;
    apiKey: string;
}

export interface CommandConfig {
    messageCommandPrefix: string;
    ignoreCommandPrefix: string;
}

export interface MiscConfig {
    locale: string;
}

export interface DiscordConfig {
    token: string;
    clientId: string;
    guildId: string;
    ownerId: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toConfig(json: string): Config {
        return JSON.parse(json);
    }

    public static configToJson(value: Config): string {
        return JSON.stringify(value);
    }
}
