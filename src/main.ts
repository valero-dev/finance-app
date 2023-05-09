import { createApp } from 'vue'
import App from './App.vue'
import { router } from '@/routes'
import { createPinia } from 'pinia'
import { makeRandomPayment } from '@/services/dev.service'
import {
  Chart,
  PieController,
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Colors
} from 'chart.js'

import './styles/base.scss'

createApp(App)
  .use(router)
  .use(createPinia())
  .mount('#app')

Chart.register(PieController, ArcElement, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Colors)

// @ts-ignore
window.randomPayment = makeRandomPayment
