import type { BaseTranslation } from "../i18n-types.js";

const en = {
    commandDescriptions: {
        clearContext: "Clear context",
        getCurrentBot: "Get current bot",
        reloadConfig: "Reload config"
    },
    messages: {
        contextCleared: "Context cleared",
        changedBot: "Bot changed to {botKey}",
        configReloaded: "Config reloaded",
        queryRetrying: "Failed to get response, retrying... {retries}",
        responseFailed: "Failed to get response, please try again {error}",
    },
    buttons: {
        retry: "Retry"
    },
    terms: {
        provider: "provider",
        model: "model"
    }
} satisfies BaseTranslation;

export default en;
