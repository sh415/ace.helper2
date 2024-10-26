import './assets/main.css'
import './assets/tailwind.css'
import 'primeicons/primeicons.css';

import { createApp } from 'vue'
import App from './App.vue'

/** import primevue */
import PrimeVue from 'primevue/config';
import Theme from '@primevue/themes/aura';
import Button from "primevue/button"
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import DataView from 'primevue/dataview';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Menu from 'primevue/menu';
import ProgressSpinner from 'primevue/progressspinner';
import Select from 'primevue/select';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import ToggleSwitch from 'primevue/toggleswitch';
import Textarea from 'primevue/textarea';
import Tooltip from 'primevue/tooltip';

/** 애플리케이션 인스턴스 생성 */
const app = createApp(App);

/** primevue component */
app.use(PrimeVue, {
  theme: {
    preset: Theme
  }
});
app.use(ToastService);
app.component('Button', Button);
app.component('Column', Column);
app.component('DataTable', DataTable);
app.component('DataView', DataView);
app.component('FloatLabel', FloatLabel);
app.component('InputText', InputText);
app.component('Menu', Menu);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Select', Select);
app.component('Toast', Toast);
app.component('ToggleSwitch', ToggleSwitch);
app.component('Textarea', Textarea);
app.directive('tooltip', Tooltip);

app.mount('#app')
