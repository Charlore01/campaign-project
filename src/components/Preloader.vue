<template>
  <div v-if=loading class="header">
    <!-- <h1 class="fw-bold pt-3  fs-1">Scrutz</h1> -->
     <!-- <img src="../assets/Scrutz-logo.png" alt=""> -->
  </div>
  <div v-if="loading" class="preloader d-flex justify-content-center align-items-center">
    <div class="spinner-border text-white" role="status"></div>
    <span class="text-white ps-2">Loading...</span>
  </div>
</template>
  
  <script setup>
import { ref } from "vue";

const loading = ref(true);

// You can simulate loading completion here
setTimeout(() => {
  loading.value = false;
}, 6000);
</script>
  
  <style scoped>
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #1e5b5b;
  z-index: 999;
}

.header > h1 {
  position: relative;
  top: 0;
  color: #fff;
  /* text-shadow: 1px 1px 9px #fff; */
  z-index: 9999;
}
</style>
  