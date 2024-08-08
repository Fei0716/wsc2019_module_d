// Import your component apps
import navApp from './components/nav.js';
import alertApp from './components/alert.js';

import router from './router.js';
// Create the main app instance
const mainApp = Vue.createApp({
  // ... main app configuration ...
});

// Register global components
mainApp.component('the-nav', navApp.component('the-nav'));
mainApp.component('the-alert', alertApp.component('the-alert'));

mainApp.use(router);
// Mount the main app instance on the root element
mainApp.mount('#app');
