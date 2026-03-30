import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
  timestamp,
  pgEnum,
  index,
  text,
  date,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const loanStatusEnum = pgEnum('loan_status', [
  'pending',
  'approved',
  'disbursed',
  'active',
  'delinquent',
  'closed',
  'rejected',
]);

export const loanTypeEnum = pgEnum('loan_type', ['personal', 'home', 'auto', 'business']);

export const loans = pgTable(
  'loans',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    borrowerId: uuid('borrower_id')
      .notNull()
      .references(() => users.id),
    loanOfficerId: uuid('loan_officer_id').references(() => users.id),
    loanType: loanTypeEnum('loan_type').notNull(),
    principalAmount: numeric('principal_amount', { precision: 15, scale: 2 }).notNull(),
    interestRate: numeric('interest_rate', { precision: 5, scale: 2 }).notNull(),
    termMonths: integer('term_months').notNull(),
    emiAmount: numeric('emi_amount', { precision: 15, scale: 2 }).notNull(),
    disbursedAmount: numeric('disbursed_amount', { precision: 15, scale: 2 }),
    outstandingBalance: numeric('outstanding_balance', { precision: 15, scale: 2 }),
    status: loanStatusEnum('status').notNull().default('pending'),
    disbursedAt: timestamp('disbursed_at', { withTimezone: true }),
    closedAt: timestamp('closed_at', { withTimezone: true }),
    nextPaymentDue: date('next_payment_due'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    borrowerIdx: index('loans_borrower_id_idx').on(table.borrowerId),
    statusIdx: index('loans_status_idx').on(table.status),
    createdAtIdx: index('loans_created_at_idx').on(table.createdAt),
  }),
);

export const paymentSchedule = pgTable(
  'payment_schedule',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    loanId: uuid('loan_id')
      .notNull()
      .references(() => loans.id, { onDelete: 'cascade' }),
    installmentNumber: integer('installment_number').notNull(),
    dueDate: date('due_date').notNull(),
    principalComponent: numeric('principal_component', { precision: 15, scale: 2 }).notNull(),
    interestComponent: numeric('interest_component', { precision: 15, scale: 2 }).notNull(),
    emiAmount: numeric('emi_amount', { precision: 15, scale: 2 }).notNull(),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    loanIdIdx: index('payment_schedule_loan_id_idx').on(table.loanId),
    dueDateIdx: index('payment_schedule_due_date_idx').on(table.dueDate),
  }),
);

export type Loan = typeof loans.$inferSelect;
export type NewLoan = typeof loans.$inferInsert;
export type PaymentScheduleEntry = typeof paymentSchedule.$inferSelect;
export type NewPaymentScheduleEntry = typeof paymentSchedule.$inferInsert;
