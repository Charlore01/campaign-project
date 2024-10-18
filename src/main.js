// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

// import BootstrapVue3 from 'bootstrap-vue-3';

// createApp(App).use(router).use(BootstrapVue3).mount('#app')


import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router'; // Optional, since you're importing from the router file
import router from './router'; // Adjust the path based on your project structure
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap';

const app = createApp(App);

// Use the router
app.use(router);

// Mount the app
app.mount('#app');
