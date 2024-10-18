<template>
  <!-- Hamburger Icon -->
  <button
    @click="toggleIcon"
    class="hamburger-btn burger d-flex flex-column align-items-center text-center rounded-2"
  >
    <template v-if="isHamburger">
      <!-- Hamburger Icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        fill="currentColor"
        class="bi bi-list"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
        />
      </svg>
    </template>
    <template v-else>
      <!-- Close Icon (×) -->
      <span style="font-size: 30px;">&times;</span>
    </template>
  </button>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Hamburger",
  setup() {
    const isHamburger = ref(true); // State to toggle between hamburger and close icon

    const toggleIcon = () => {
      isHamburger.value = !isHamburger.value; // Toggle the state
      // Trigger sidebar toggle as well if necessary
      // Your logic for toggling the sidebar can go here if needed
    };

    return {
      isHamburger,
      toggleIcon,
    };
  },
};
</script>

<style>
.hamburger-btn {
  background-color: #247b7b;
  color: #fff;
  border: none;
  cursor: pointer;
}

@media (max-width: 1200px) {
  .hamburger-btn {
    margin-left: 5%;
    padding: 2px;
  }
}

@media (max-width: 780px) {
  .burger {
    visibility: hidden;
  }
}
</style>
