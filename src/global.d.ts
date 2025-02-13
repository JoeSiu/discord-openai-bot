/* eslint-disable no-var */
import { Client, Collection } from "discord.js";
import ApplicationCommand from "../templates/ApplicationCommand";
import MessageCommand from "../templates/MessageCommand";

interface DiscordClient extends Client {
    slashCommands: Collection<string, ApplicationCommand>;
    messageCommands: Collection<string, MessageCommand>;
}

declare global {
    var client: DiscordClient;

    type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}

export {};
