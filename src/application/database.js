import { PrismaClient } from "@prisma/client";
import { logEmitter } from "./logging.js";

export const prismaClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

prismaClient.$on("error", (e) => {
  logEmitter.error(e);
});

prismaClient.$on("info", (data) => {
  logEmitter.info(data)
});

prismaClient.$on("warn", (e) => {
  logEmitter.warn(e);
});

prismaClient.$on("query", (data) => {
  logEmitter.info(data)
});