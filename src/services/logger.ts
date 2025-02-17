import { pino, type Logger } from 'pino';

export const logger: Logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
    level: "debug",
});