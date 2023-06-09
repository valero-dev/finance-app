import { toDayId, toMonthId } from '@/helpers/date.helper'
import type { IMonth } from '@/models/month.interface'
import type { IPayment, IPaymentData } from '@/models/payment.interface'
import { PaymentType } from '@/models/payment.interface'
import { DB_TABLE, getDBClient } from '@/services/db.client'
import type { ICategory } from '@/models/category.interface'
import { getEmptyMonth } from '@/helpers/data.helper'

export interface NewPayment {
  payment: IPayment
  month: IMonth
  savings: number
}

enum STORAGE_KEY {
  savings = 'finance-db-savings'
}

export async function fetchMonth (monthId: string): Promise<IMonth> {
  const DB = await getDBClient()
  return await DB.months.get(monthId) ?? getEmptyMonth(monthId)
}

export async function fetchMonths (monthIds: string[]): Promise<IMonth[]> {
  if (!monthIds.length) {
    return []
  }
  const DB = await getDBClient()
  return DB.months.bulkGet(monthIds)
    .then((months): IMonth[] => monthIds.map(monthId => months.find(m => m?.monthId === monthId) ?? getEmptyMonth(monthId)))
}

export async function fetchPayments (monthId: string): Promise<IPayment[]> {
  const DB = await getDBClient()
  return await DB.payments.where({ monthId }).toArray()
}

export async function fetchCategories (): Promise<ICategory[]> {
  const DB = await getDBClient()
  return await DB.categories.toArray()
}

export async function storePayment (date: Date, data: IPaymentData): Promise<NewPayment> {
  const paymentData: Omit<IPayment, 'id'> = {
    ...data,
    createdAt: Date.now(),
    dayId: toDayId(date),
    monthId: toMonthId(date)
  }
  const DB = await getDBClient()
  return DB.transaction('rw', DB_TABLE.months, DB_TABLE.payments, async () => {
    const month = await upsertMonth(paymentData)
    const payment = await createPayment(paymentData)
    const savings = updateSavings(payment)
    return { payment, month, savings }
  })
}

function updateSavings (payment: IPayment): number {
  let current = fetchSavings() ?? 0
  if (new Date(payment.monthId).getMonth() === new Date().getMonth()) {
    current += (payment.amount * (payment.type === PaymentType.in ? 1 : -1))
    storeSavings(current)
  }
  return current
}

async function createPayment (paymentData: Omit<IPayment, 'id'>): Promise<IPayment> {
  const DB = await getDBClient()
  const paymentId = await DB.payments.add(<IPayment>paymentData) as number
  return { id: paymentId, ...paymentData }
}

async function upsertMonth (payment: Omit<IPayment, 'id'>): Promise<IMonth> {
  const DB = await getDBClient()
  const month: IMonth = await DB.months.get(payment.monthId) ?? {
    monthId: payment.monthId, outcome: 0, income: 0, totals: {}
  }
  month[payment.type] += payment.amount
  month.totals[payment.category ?? ''] = (month.totals[payment.category ?? ''] ?? 0) + payment.amount
  await DB.months.put(month)
  return month
}

export function fetchSavings (): number | null {
  const stored = localStorage.getItem(STORAGE_KEY.savings)
  return (stored != null) ? Number(stored) : null
}

export function storeSavings (value: number): void {
  localStorage.setItem(STORAGE_KEY.savings, String(value))
}
