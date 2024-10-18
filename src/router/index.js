import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/authentication/LoginPage.vue";
import SignUp from "../views/authentication/SignUp.vue";
import HomeView from "../views/HomeView.vue";
import Campaign from '../views/campaign.vue';
import NewCampaign from "@/components/NewCampaign.vue";



const routes = [
  {
    path: "/login", // Change this to match your login path
    name: "Login",
    component: LoginPage,
  },

  {
    path: '/SignUp',
    name: 'SignUp',
    component: SignUp,
  },

  {
    path: "/",
    redirect: "/login", // Redirect to the login page by default
  },
  

  {
    path: "/home",
    name: "home",
    component: HomeView,
  },

  {
    path: '/campaign',
    name: 'Campaign',
    component: Campaign
  },

  {
    path: '/NewCampaign',
    name: 'NewCampaign',
    component: NewCampaign
  },

  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// // Navigation guard to manage loading state
// router.beforeEach((to, from, next) => {
//   // Set loading to true when navigating to certain routes
//   if (to.name !== "Login") {
//     // Show preloader for all routes except login
//     isLoading.value = true; // This requires `isLoading` to be accessible
//   }
//   next();
// });

// // Update the loading state after the navigation is completed
// router.afterEach(() => {
//   setTimeout(() => {
//     isLoading.value = false; // Hide preloader after a short delay
//   }, 300); // Adjust this as needed
// });

export default router;
