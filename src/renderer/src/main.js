import './assets/main.css'
import './assets/tailwind.css'
import 'primeicons/primeicons.css';

import { createApp } from 'vue'
import App from './App.vue'

/** import primevue */
import PrimeVue from 'primevue/config';
import Theme from '@primevue/themes/nora';
import Button from "primevue/button"
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tooltip from 'primevue/tooltip';

/** 애플리케이션 인스턴스 생성 */
const app = createApp(App);

/** primevue component */
app.use(PrimeVue, {
  theme: {
    preset: Theme
  }
});
app.component('Button', Button);
app.component('InputText', InputText);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.directive('tooltip', Tooltip);

app.mount('#app')
