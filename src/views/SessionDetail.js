const SessionDetail = {
    template: `
    <!-- session detail -->
    <div class="box">
        <h1 class="mb-2">Session Detail</h1>
        <div class="h3 mb-3">{{session.title}} - {{session.type}}</div>
        <p class="mb-3">{{session.description}}</p>
        <table class="table-session">
            <tr>
                <th>Speaker:</th>
                <td>{{session.speaker}}</td>
            </tr>
            <tr>
                <th>Start:</th>
                <td>{{format(session.start)}}</td>
            </tr>
            <tr>
                <th>End:</th>
                <td>{{format(session.end)}}</td>
            </tr>
            <tr>
                <th>Cost:</th>
                <td>{{session.cost > 0 ? session.cost : '-'}}</td>
            </tr>
        </table>

    </div>`,
    data(){
        return{
            event: null,
        }
    },
    methods:{
        zero(time){
            return time < 10 ? `0${time}` : time;
        },
        format(datetime){
            const date = new Date(datetime);
            const h = date.getHours();
            const m = date.getMinutes();
            return `${this.zero(h)}:${this.zero(m)}`;
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
        session_id() {
            const {session_id} = this.$route.params;
            return session_id;
        },
        session() {
            if (!this.event) return false;

            let result = null;
            this.event.channels.find(channel =>
                channel.rooms.find(room =>
                    room.sessions.find(session => {
                        if (session.id == this.session_id) {
                            result = session;
                            return true;
                        }
                    })
                )
            );

            return result;
        }
    },
    created(){
        const { organizer_slug, event_slug } = this;
        ajax.get(`organizers/${organizer_slug}/events/${event_slug}`).then(({status, data}) =>{
            if(status == 200){
                this.event = data.event;
            }
        });
    },
};

export default SessionDetail; 
