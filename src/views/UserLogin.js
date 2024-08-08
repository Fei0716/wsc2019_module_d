const UserLogin = {
    template: `
        <!-- login -->
        <div class="box w-50">
            <div class="h3 mb-3 text-center">Login</div>
            <table class="mx-auto">
                <tr>
                    <td class="pr-5">
                        Lastname
                    </td>
                    <td>
                        <input type="text" class="form-control" placeholder="Lastname" id="lastname"
                            v-model="form.lastname">
                    </td>
                </tr>
                <tr>
                    <td class="pr-5">Registration Code</td>
                    <td>
                        <input type="password" class="form-control" placeholder="Code" id="registration_code"
                            v-model="form.registration_code">
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td class="pt-3">
                        <button id="login" class="btn btn-primary" @click="login">Login</button>
                    </td>
                </tr>
            </table>
        </div>
    `,
    data() {
        return {
            form: {
                lastname: '',
                registration_code: '',
            }
        }
    },
    methods: {
        async login() { 
            let response = await ajax.post('login', this.form);//will wait for the promise to be return before execute the next line
            if (response.status === 200) {
                store.setAuth(response.data.attendee);
                this.$router.push({name:'EventList'});
            } else {
                this.$root.$emit('alert', 'Login failed', 'danger');
            }
        }
    }
};

export default UserLogin; 
