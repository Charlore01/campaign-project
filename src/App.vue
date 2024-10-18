<template>
  <div id="app">
    <Preloader v-if="isLoading" />
    <router-view v-else />
    <MySidebarSidebar />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Preloader from "./components/Preloader.vue";
import { useRouter } from "vue-router"; // Import useRouter
import MySidebar from "./components/MySidebar.vue";

export default {
  components: {
    Preloader,
    MySidebar
  },

  setup() {
    const isLoading = ref(false);

    // This function can be called to toggle loading state from LoginPage
    const setLoading = (loading) => {
      isLoading.value = loading;
    };

    return {
      isLoading,
      setLoading,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
