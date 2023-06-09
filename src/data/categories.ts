import type { ICategory } from '@/models/category.interface'
import { PaymentType } from '@/models/payment.interface'

export const categoriesV1: ICategory[] = [
  { id: '8a461c9f-d385-463e-a3f9-4d4995def65e', icon: '🤑', label: 'Salary', type: PaymentType.in, recurrent: true, fixed: true },

  { id: '861dfaaf-7f63-43c5-8912-74642aa26352', icon: '⚡️', label: 'Electricity', type: PaymentType.out, recurrent: true },
  { id: 'f596f034-d4c2-41a9-8c5b-89f09dc4191e', icon: '💨', label: 'Gas', type: PaymentType.out, recurrent: true },
  { id: 'fb0fa14c-782a-44d3-b0d7-ad24e452e999', icon: '⛽', label: 'Fuel', type: PaymentType.out },
  { id: '9e789188-eb92-4f95-85a2-69b094420c44', icon: '🛍️', label: 'Shopping', type: PaymentType.out },
  { id: 'ebe2a45e-9394-46e2-9221-7cf2a1952730', icon: '🍜', label: 'Restaurants', type: PaymentType.out },
  { id: '67132431-8b09-45ef-a16e-70483d895dd0', icon: '🛒', label: 'Groceries', type: PaymentType.out }
]
