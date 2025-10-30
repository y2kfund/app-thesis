import { Plugin } from 'vue';
import { default as Thesis } from './Thesis.vue';
export interface ThesisProps {
    userId?: string | null;
    showHeaderLink?: boolean;
    window?: string | null;
}
declare const _default: Plugin;
export default _default;
export { Thesis };
