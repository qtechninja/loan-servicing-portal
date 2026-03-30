export interface DomainEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly payload: Record<string, unknown>;
}

export abstract class BaseDomainEvent implements DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;

  constructor(
    public readonly eventType: string,
    public readonly aggregateId: string,
    public readonly payload: Record<string, unknown>,
  ) {
    this.eventId = crypto.randomUUID();
    this.occurredAt = new Date();
  }
}

// Loan domain events
export class LoanCreatedEvent extends BaseDomainEvent {
  constructor(loanId: string, payload: Record<string, unknown>) {
    super('loan.created', loanId, payload);
  }
}

export class LoanStatusChangedEvent extends BaseDomainEvent {
  constructor(loanId: string, payload: Record<string, unknown>) {
    super('loan.status_changed', loanId, payload);
  }
}

// Payment domain events
export class PaymentProcessedEvent extends BaseDomainEvent {
  constructor(paymentId: string, payload: Record<string, unknown>) {
    super('payment.processed', paymentId, payload);
  }
}

export class PaymentFailedEvent extends BaseDomainEvent {
  constructor(paymentId: string, payload: Record<string, unknown>) {
    super('payment.failed', paymentId, payload);
  }
}
