// alert.js
const alertApp = Vue.createApp({});

alertApp.component('the-alert', {
    template: `
      <!-- alert -->
      <transition name="slide-alert" appear mode="out-in">
        <div class="alert-wrapper" v-if="id" :key="id">
          <div class="alert" :class="'alert-'+type">
            {{ msg }}
          </div>
        </div>
      </transition>
    `,
    data() {
        return {
            id: null,
            msg: null,
            type: null,
        };
    },
    mounted() {
        let interval = null;

        const onAlert = (message, alertType = 'danger') => {
            clearInterval(interval);

            this.id = Date.now();
            this.msg = message;
            this.type = alertType;

            interval = setTimeout(() => {
                this.id = null;
                this.msg = null;
                this.type = null;
            }, 5000);
        };

        // Register the 'alert' event
       alertApp.config.globalProperties.$on('alert', onAlert);
    },
});

export default alertApp;
