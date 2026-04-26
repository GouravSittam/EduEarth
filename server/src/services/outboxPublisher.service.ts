import { Prisma } from "@prisma/client";
import type GameServer from "../game/gameServer.js";
import logger from "../observability/logger.js";
import { prisma } from "../prisma/client.js";

type OutboxRow = {
  id: bigint;
  channel: string;
  event_name: string;
  payload: unknown;
};

type OutboxPublisherOptions = {
  batchSize?: number;
  pollIntervalMs?: number;
};

export class OutboxPublisherService {
  private readonly gameServer: GameServer;
  private readonly batchSize: number;
  private readonly pollIntervalMs: number;
  private timer: NodeJS.Timeout | null = null;
  private isFlushing = false;

  constructor(gameServer: GameServer, options: OutboxPublisherOptions = {}) {
    this.gameServer = gameServer;
    this.batchSize = Math.max(1, options.batchSize ?? 50);
    this.pollIntervalMs = Math.max(500, options.pollIntervalMs ?? 3000);
  }

  public start() {
    if (this.timer) {
      return;
    }

    this.timer = setInterval(() => {
      void this.flushOnce();
    }, this.pollIntervalMs);
    this.timer.unref();

    void this.flushOnce();
    logger.info(
      {
        batchSize: this.batchSize,
        pollIntervalMs: this.pollIntervalMs,
      },
      "Outbox publisher started",
    );
  }

  public stop() {
    if (!this.timer) {
      return;
    }

    clearInterval(this.timer);
    this.timer = null;
    logger.info("Outbox publisher stopped");
  }

  public async flushOnce(): Promise<number> {
    if (this.isFlushing) {
      return 0;
    }

    this.isFlushing = true;

    try {
      const sentCount = await prisma.$transaction(async (tx) => {
        const rows = await tx.$queryRaw<OutboxRow[]>`
          SELECT id, channel, event_name, payload
          FROM websocket_outbox
          WHERE sent_at IS NULL
          ORDER BY created_at ASC
          LIMIT ${this.batchSize}
          FOR UPDATE SKIP LOCKED
        `;

        if (rows.length === 0) {
          return 0;
        }

        const sentIds: bigint[] = [];

        for (const row of rows) {
          try {
            this.gameServer.emitOutboxEvent(
              row.channel,
              row.event_name,
              row.payload,
            );
            sentIds.push(row.id);
          } catch (emitError) {
            logger.error(
              {
                outboxId: row.id.toString(),
                channel: row.channel,
                eventName: row.event_name,
                err: emitError,
              },
              "Failed to emit outbox event",
            );
          }
        }

        if (sentIds.length === 0) {
          return 0;
        }

        const sentIdValues = sentIds.map((id) => Prisma.sql`${id}`);
        await tx.$executeRaw`
          UPDATE websocket_outbox
          SET sent_at = NOW()
          WHERE sent_at IS NULL
            AND id IN (${Prisma.join(sentIdValues)})
        `;

        return sentIds.length;
      });

      if (sentCount > 0) {
        logger.debug({ sentCount }, "Outbox events published");
      }

      return sentCount;
    } catch (error) {
      logger.error({ err: error }, "Outbox publisher cycle failed");
      return 0;
    } finally {
      this.isFlushing = false;
    }
  }
}

export default OutboxPublisherService;
