import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import AboutView from '@/views/AboutView.vue'
import NotesView from '@/views/NotesView.vue'
import NoteView from '@/views/NoteView.vue'
import { useAuthStore } from '@/stores/AuthStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/notes',
      name: 'notes',
      component: NotesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/note/:id',
      name: 'note', // MORA DA IMA RAZLICITO IME SVAKA RUTA!! ULETI TI KITA KRUTA
      component: NoteView,
      meta: { requiresAuth: true }
    },
  ],
})
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuth()) {
    next("/login");
  } else {
    next();
  }
});
export default router
