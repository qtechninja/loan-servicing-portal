/**
 * QueueClient interface — abstraction over the message bus.
 * MVP: in-process EventEmitter (Render). Swap to Azure Service Bus with zero code change.
 */
import { EventEmitter } from 'events';
import type { DomainEvent } from '@modules/shared/domain-events';

export interface QueueClient {
  publish(event: DomainEvent): Promise<void>;
  subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): void;
  unsubscribe(eventType: string): void;
}

/**
 * InProcessQueueClient — EventEmitter backed implementation for MVP.
 * Replace with AzureServiceBusQueueClient for production.
 */
export class InProcessQueueClient implements QueueClient {
  private readonly emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(50);
  }

  async publish(event: DomainEvent): Promise<void> {
    // Emit asynchronously so publisher is not blocked by handlers
    setImmediate(() => {
      this.emitter.emit(event.eventType, event);
    });
  }

  subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): void {
    this.emitter.on(eventType, (event: DomainEvent) => {
      handler(event).catch((err: unknown) => {
        console.error(`[QueueClient] Handler error for ${eventType}:`, err);
      });
    });
  }

  unsubscribe(eventType: string): void {
    this.emitter.removeAllListeners(eventType);
  }
}

// Singleton instance — replace instantiation here when swapping to Service Bus
export const queueClient: QueueClient = new InProcessQueueClient();
