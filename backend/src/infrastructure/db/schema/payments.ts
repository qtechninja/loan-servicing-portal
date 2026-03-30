import {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
  pgEnum,
  index,
  text,
} from 'drizzle-orm/pg-core';
import { loans } from './loans';
import { users } from './users';

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'processing',
  'success',
  'failed',
  'refunded',
]);

export const paymentMethodEnum = pgEnum('payment_method', ['upi', 'enach', 'neft', 'imps', 'rtgs']);

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    loanId: uuid('loan_id')
      .notNull()
      .references(() => loans.id),
    borrowerId: uuid('borrower_id')
      .notNull()
      .references(() => users.id),
    amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
    method: paymentMethodEnum('method').notNull(),
    status: paymentStatusEnum('status').notNull().default('pending'),
    gatewayTransactionId: varchar('gateway_transaction_id', { length: 255 }),
    idempotencyKey: varchar('idempotency_key', { length: 255 }).unique(),
    failureReason: text('failure_reason'),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    loanIdIdx: index('payments_loan_id_idx').on(table.loanId),
    borrowerIdIdx: index('payments_borrower_id_idx').on(table.borrowerId),
    createdAtIdx: index('payments_created_at_idx').on(table.createdAt),
    idempotencyIdx: index('payments_idempotency_key_idx').on(table.idempotencyKey),
  }),
);

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
