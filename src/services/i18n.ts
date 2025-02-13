import { config } from "../data/config.js";
import L from "../i18n/i18n-node.js";
import { Locales } from "../i18n/i18n-types.js";

export const t = L[config.misc.locale as Locales];
