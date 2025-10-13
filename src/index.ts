import type { Plugin } from 'vue'
import Thesis from './Thesis.vue'

export interface ThesisProps {
  userId?: string | null
}

export default {
  install(app) {
    app.component('Thesis', Thesis)
  }
} as Plugin

export { Thesis }