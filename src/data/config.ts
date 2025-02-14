import * as fs from "fs";
import { CONFIG_FILE_PATH } from "../constants/constants.js";
import { logger } from "../services/logger.js";
import { Config, Convert } from "./parsers/configParser.js";

export let config: Config;

export function reloadConfig() {
    const json = fs.readFileSync(CONFIG_FILE_PATH, "utf-8");
    config = Convert.toConfig(json);
    logger.info(`Reloaded config at '${CONFIG_FILE_PATH}'`);
}

reloadConfig();
