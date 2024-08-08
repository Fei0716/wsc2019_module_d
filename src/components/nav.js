// Create a new app instance
const navApp = Vue.createApp({});

// Define the 'the-nav' component
navApp.component('the-nav', {
  template: `
    <!-- nav -->
    <div class="navbar navbar-expand-lg bg-white">
        <div class="container-fluid d-flex justify-content-between">
            <a href="#" class="navbar-brand">Event Booking Platform</a>
            <div class="collapse navbar-collapse">
                <ul class="navbar-nav ml-auto" >
                 <template v-if="isAuth">
                    <li class="nav-item ml-2 my-auto">{{auth.username}}</li>
                    <li class="nav-item ml-2">
                        <button @click="logout" class="btn btn-outline-warning">
                            Logout
                        </button>
                    </li>
                 </template>
                 <template v-else>
                    <li class="nav-item ml-2">
                        <router-link :to="{name:'UserLogin'}" class="btn btn-outline-primary">
                            Login
                        </router-link>
                    </li>                    
                </template>

                </ul>
            </div>
        </div>
    </div>
  `,
  data(){
    return{
        auth: store.auth,
    }
  },
  computed: {
    isAuth(){
        const {token,username} = this.auth;
        return token && username;
    }
  },
  methods:{
    logout() {
        ajax.post(`logout?token=${this.auth.token}`)
            .then(({data, status}) => {
                if (status === 200) {
                    store.removeAuth();
                    this.$router.push({name:'UserLogin'});
                }
            });
    }
  }
});


export default navApp;

