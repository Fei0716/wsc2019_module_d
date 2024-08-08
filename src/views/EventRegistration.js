const EventRegistration = {
    template: `
    <!-- event registration -->
    <div class="box">
        <h1 class="mb-2">Event Registration</h1>
        <div class="h3 mb-2">{{event.name}}</div>
        <div class="mb-2 d-flex justify-content-center align-item-center ticket-container">
            <template v-for="ticket in event.tickets">            
                <div class="ticket flex-grow-1" :class="{'disabled': !ticket.available}">
                    <input type="radio" class="form-check m-3" name="ticket_id" :value="ticket.id" :id="ticket.id"  :disabled="!ticket.available" v-model="form.ticket_id">
                    <label :for="ticket.id" class="form-check-label h5">{{ticket.name}}
                        <div class="lead" v-if="!ticket.available">unavailable</div>
                        <div class="lead" v-else-if="ticket.available">{{ticket.description}}</div>
                    </label>
                    <div class="ml-auto">
                        {{ticket.cost}}
                    </div>
                </div>
            </template>
        </div>

        <p>Select additional workshops you want to book:</p>

        <ul class="p-0 mb-5">
            <li class="mb-3" v-for="workshop in workshops" :key="workshop.id">
                <label class="workshop">
                    <span class="mr-3">
                        <input type="checkbox" :checked="isSelected(workshop.id)" @change="toggleSession(workshop.id)">
                    </span>
                    <span>
                        {{workshop.title}}
                    </span>
                </label>
            </li>
        </ul>


        <div class="col-4 ml-auto">
            <table>
                <tr>
                    <th class="p-2">Event ticket:</th>
                    <td id="event-cost">{{ticket_price}}</td>
                </tr>
                <tr>
                    <th class="p-2">Additional Workshops:</th>
                    <td id="additional-cost">{{workshops_price}}</td>
                </tr>
                <tr class id="total-cost-container">
                    <th class="p-2">Total:</th>
                    <td id="total-cost">{{total_price}}</td>
                </tr>
            </table>

            <button type="button" :class="{disabled: !form.ticket_id}" @click="purchase" class="btn btn-primary d-block mx-auto">Purchase</button>
        </div>
    </div>`,
    data(){
        return{
            event: null,
            form:{
                ticket_id: '',
                session_ids: [],
            }
        }
    },
    computed:{
        organizer_slug() {
            const { organizer_slug } = this.$route.params;
            return organizer_slug;
        },
        event_slug() {
            const { event_slug } = this.$route.params;
            return event_slug;
        },
        workshops(){
            var workshop = []
            this.event.channels.forEach((channel) =>{
                channel.rooms.forEach((room)=>{
                    room.sessions.forEach((session) =>{
                        if(session.type == 'workshop'){
                            workshop.push(session);
                        }
                    });
                });
            });                

            return workshop;
        },
        ticket_price(){
            let price = 0;
            const ticket = this.event.tickets.find(ticket => ticket.id === this.form.ticket_id);
            if (ticket) {
                price = parseFloat(ticket.cost);
            }
            return price;
        },
        workshops_price(){
            let price = 0;

            this.form.session_ids.forEach(session_id => {
                const workshop = this.workshops.find(x => x.id == session_id);
                price += parseFloat(workshop.cost);
            });

            return price;
        },
        total_price() {
            return this.ticket_price + this.workshops_price;
        }
    },
    methods: {
        toggleSession(session_id) {
            const index = this.form.session_ids.indexOf(session_id);
    
            if (index !== -1) {
                this.form.session_ids.splice(index, 1);
            } else {
                this.form.session_ids.push(session_id);
            }
        },
        isSelected(session_id) {
            return this.form.session_ids.includes(session_id);
        },
        purchase() {
            const {organizer_slug, event_slug} = this;
            ajax
                .post(
                    `organizers/${organizer_slug}/events/${event_slug}/registration?token=${store.auth.token}`,
                    this.form,
                    true
                )
                .then(({status, data}) => {
                    if (status === 200) {
                        this.$router.push({ name: 'EventAgenda', params: {organizer_slug, event_slug}});
                    } else {
                    }
                });
        }
    },
    created(){
        const { organizer_slug, event_slug } = this;
        ajax.get(`organizers/${organizer_slug}/events/${event_slug}`).then(({status, data}) =>{
            if(status == 200){
                this.event = data.event;
                console.log(this.event);
            }
        });
    },
};

export default EventRegistration; 
