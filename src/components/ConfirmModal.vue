<template>
  <div v-if="isVisible" class="modal-overlay animate__animated animate__zoomInUp animate__slow">
    <div class="modal-content">
      <p>Are you sure you want to log out?</p>
      <button @click="confirmLogout">Yes</button>
      <button @click="cancelLogout">No</button>
    </div>
  </div>
</template>

<script>
import { watch, onMounted, onUnmounted  } from "vue";

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const blockBackgroundActivity = () => {
      const appContent = document.querySelector(".main-content");
      if (appContent) {
        appContent.style.pointerEvents = "none"; // Disable all clicks and interactions
        appContent.style.opacity = "0.5"; // Optional: visually dim the background
      }
    };

    const enableBackgroundActivity = () => {
      const appContent = document.querySelector(".main-content");
      if (appContent) {
        appContent.style.pointerEvents = "auto"; // Re-enable clicks and interactions
        appContent.style.opacity = "1"; // Restore original background look
      }
    };

    watch(
      () => props.isVisible,
      (newVal) => {
        if (newVal) {
          blockBackgroundActivity();
          document.body.style.overflow = "hidden"; // Disable scrolling
        } else {
          enableBackgroundActivity();
          document.body.style.overflow = "auto"; // Re-enable scrolling
        }
      }
    );

    // Clean up when the component is destroyed
    onUnmounted(() => {
      enableBackgroundActivity();
    });

    const confirmLogout = () => {
      emit("confirm");
    };

    const cancelLogout = () => {
      emit("cancel");
    };


    return {
      confirmLogout,
      cancelLogout,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 20%;
  left: 40%;
  width: 30%;
  height: 50%;
  /* background-color: rgba(0, 0, 0, 0.5); Dark background */
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure it is above other elements */
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.modal-content button {
  margin: 10px;
  padding: 10px 20px;
  background-color: #247b7b;
  color: #fff;
  border: none;
  border-radius: 5px;
}

.modal-content button:hover {
  background-color: #1e5b5b;
}
</style>
