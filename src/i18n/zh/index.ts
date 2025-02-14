import type { Translation } from "../i18n-types.js";

const zh = {
    commandDescriptions: {
        clearContext: "清除上下文",
        getCurrentBot: "獲取當前機器人",
        reloadConfig: "重新加載配置"
    },
    messages: {
        contextCleared: "上下文已清除",
        changedBot: "機器人已更改，新機器人是 {botKey}",
        configReloaded: "配置已重新加載",
        queryRetrying: "無法獲取響應，重試中... {retries}",
        responseFailed: "無法獲取響應，請重試 {error}",
    },
    buttons: {
        retry: "重試",
    },
    terms: {
        provider: "供應商",
        model: "模型"
    }
} satisfies Translation;

export default zh;
