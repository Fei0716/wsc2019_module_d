import {EventList} from './views/EventList.js'; // Import your components
import {EventAgenda} from './views/EventAgenda.js';
import SessionDetail from './views/SessionDetail.js';
import EventRegister from './views/EventRegistration.js';
import UserLogin from './views/UserLogin.js';

const routes = [
  {
    path: '/',
    name: 'EventList',
    component: EventList,
    meta: 'all',
  },
  {
    path: '/organizers/:organizer_slug/events/:event_slug',
    name: 'EventAgenda',
    component: EventAgenda,
    meta: 'all',
  },
  {
    path: '/organizers/:organizer_slug/events/:event_slug/sessions/:session_id',
    name: 'SessionDetail',
    component: SessionDetail,
    meta: 'all',
  },
  {
    path: '/organizers/:organizer_slug/events/:event_slug/register',
    name: 'EventRegister',
    component: EventRegister,
    meta: 'auth',
  },
  {
    path: '/login',
    name: 'UserLogin',
    component: UserLogin,
    meta: 'guest',
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
];

const router =  VueRouter.createRouter({
  history:  VueRouter.createWebHashHistory(),
  routes,
});

router.beforeEach(function (to, from, next) {
  if (Object.values(to.meta).join('') === 'auth' && !store.isAuth()) {
      next({name:'UserLogin'});
      return;
  }

  if (Object.values(to.meta).join('') === 'guest' && store.isAuth()) {
      next({name:'EventList'});
      return;
  }

  next();
});
export default router;
