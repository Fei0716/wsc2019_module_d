const EventAgenda = {
    template: `
    <!-- event agenda -->
    <div class="box">
        <h1>Event Agenda</h1>
        <div class="d-flex justify-content-between align-items-center my-2">
            <div class="h3">{{event.name}}</div>
            <router-link :to="{name:'EventRegister', params:{organizer_slug,event_slug}}" id="register" class="btn btn-outline-primary" >Register for this
                event</router-link>
        </div>
        <table class="table table-borderless time-table">
            <thead>
                <tr>
                    <th width="15%"></th>
                    <th width="15%"></th>
                    <th width="70%">
                        <div class="d-flex">
                            <div class="flex-grow-1">9.00</div>
                            <div class="flex-grow-1">11.00</div>
                            <div class="flex-grow-1">13.00</div>
                            <div class="flex-grow-1">15.00</div>
                        </div>
                    </th>
                </tr>

            </thead>
            <tbody>

                <template v-for="channel in event.channels">
                    <template v-for="(room,idx) in channel.rooms">
                        <tr class="row" :key="room.id">
                            <td v-if="idx === 0" class="channel" :rowspan="channel.rooms.length">{{channel.name}}</td>
                            <td class="room">{{room.name}}</td>
                            <td>
                                <div class="sessions">
                                    <router-link 
                                        v-for="session in room.sessions"
                                        :to="{name:'SessionDetail', params:{organizer_slug, event_slug, session_id:session.id}}" 
                                        :key="session.id" 
                                        :style ="sessionStyle(session)"
                                        :class="sessionClass(session)"
                                        >{{session.title}}</router-link>
                                </div>
                            </td>
                        </tr>                 
                    </template>
                </template>

            </tbody>
        </table>
    </div>
    `, 
    data(){
        return{
            event: null,
            registrations: null,
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
        }
    },
    methods:{
        sessionStyle(session) {
            const startDate = new Date(session.start);
            const endDate = new Date(session.end);

            //get number of minutes since 9am
            const startMin = startDate.getHours() * 60 + startDate.getMinutes() - (60 * 9);
            const endMin = endDate.getHours() * 60 + endDate.getMinutes() - (60 * 9);

            const section = 8 * 60;

            const left = startMin / section * 100 + '%';
            const width = (endMin - startMin) / section * 100 + '%';

            return {left, width};
        },
        sessionClass(session){

            const arr = ['session'];

            if(this.registrations){
                const reg = this.registrations.find( x => x.event_id === this.event_id);
                if(reg){
                    if(session.type === 'talk'){
                        arr.push('registered');
                    }else{
                        if(reg.session.includes(session.id)){
                            arr.push('registered');
                        }
                    }
                }
            }

            return arr;
        }
    },
    created() {
        const { organizer_slug, event_slug } = this;
        ajax.get(`organizers/${organizer_slug}/events/${event_slug}`).then(({status, data}) =>{
            if(status == 200){
                this.event = data.event;
            }
            
            if (store.isAuth()) {
                ajax.get(`registrations?token=${store.auth.token}`)
                    .then(({data, status}) => {
                        if (status === 200) {
                            this.registrations = data.registrations;
                            console.log(this.registrations);
                        }
                    });
            }
        });
    },
    

}


export {EventAgenda}; 
