import * as fs from "fs";
import { Config, Convert } from "./parsers/configParser.js";
import { CONFIG_PATH } from "../constants/constants.js";

export let config: Config;

export function reloadConfig() {
    const json = fs.readFileSync(CONFIG_PATH, "utf-8");
    config = Convert.toConfig(json);
    console.log(`Reloaded config at '${CONFIG_PATH}'`);
}

reloadConfig();
