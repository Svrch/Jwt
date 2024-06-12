import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initializeApp } from "firebase/app";


import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './api'

import App from './App.vue'
import router from './router'

const firebaseConfig = {
    apiKey: "AIzaSyDhsr_szBuhFk2NQhj42dVl2Ae8OU4IxnE",
    authDomain: "jwt-vue3-5e0fa.firebaseapp.com",
    projectId: "jwt-vue3-5e0fa",
    storageBucket: "jwt-vue3-5e0fa.appspot.com",
    messagingSenderId: "610821223489",
    appId: "1:610821223489:web:a670a4c9a5e00faab342c0"
};

initializeApp(firebaseConfig);
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue);

app.mount('#app')


