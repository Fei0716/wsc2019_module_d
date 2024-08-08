const EventList = {
    template: `
    <!-- event list -->
    <div class="box">
        <h1>Event List</h1>
        <ul class="list-group">
            <router-link :to="{name: 'EventAgenda' , params:{organizer_slug: event.organizer.slug, event_slug: event.slug}}" v-for=" event in events" class="list-group-item">
                <div class="h3">{{event.name}}</div>
                <div>{{event.organizer.name}} , {{event.date}} </div>
            </router-link>
        </ul>
    </div>`,
    data(){
        return{
            events: null,
        }
    },
    created(){
        ajax.get('events')
            .then(({status, data }) =>{
                if(status == 200){
                    this.events = data.events;
                    const options = {year: 'numeric', month: 'long', day: 'numeric'};
                    this.events.forEach((event) => {
                        var date = new Date(event.date);
                        event.date = date.toLocaleString('en-US' , options);
                    })
                }
            });
    },
};

export {EventList}; 
