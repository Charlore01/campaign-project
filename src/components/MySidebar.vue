<template>
  <div class="container-fluid vh-100 d-flex p-0">
    <button @click="toggleSidebar" class="hamburger-btn d-lg-none">
      <i class="bi bi-list"></i>
    </button>

    <!-- Sidebar Section -->
    <div 
      class="sidebar d-flex flex-column align-items-center text-center"
      :class="{ 'sidebar-visible': isSidebarVisible }"
    >
      <div class="sidebar-content">
        <!-- Logo and Button Section -->
        <div class="mb-5">
          <img
            src="../assets/arcticons_google-messages.png"
            alt=""
            class="img-fluid mb-2 pe-4"
          />
          <img src="../assets/Scrutz-logo.png" alt="" class="img-fluid mb-4" />

          <div class="campaign-btn mt-5">
            <router-link
              to="/NewCampaign"
              class="d-flex align-items-center underline"
            >
              <button class="p-2 rounded-2 ps-4 pe-4 text-white w-100">
                <span class="add">+</span>
                <span>New Campaign</span>
              </button>
            </router-link>
          </div>
        </div>

         <!-- Sidebar Links Section -->
         <div class="sidebar-links">
          <div class="d-flex mb-2 p-2 rounded-2">
            <router-link
              to="/home"
              class="d-flex align-items-center no-underline"
              active-class="active-link p-2 rounded-1"
              exact-active-class="active-link p-2"
            >
              <img src="../assets/side-bar_time.png" alt="" class="me-2" />
              <span>Overview</span>
            </router-link>
          </div>
          <div class="d-flex mb-2 p-2 rounded-2">
            <a
              @click.prevent="handleNavigation('/campaign')"
              class="d-flex align-items-center no-underline"
              :class="{ 'active-link p-2 rounded-1': $route.path === '/campaign' }"
            >
              <img src="../assets/sidebar-megaphone.png" alt="" class="me-2" />
              <span>Campaign</span>
            </a>
          </div>
          <div class="d-flex mb-2 p-2 rounded-2">
            <a
              @click.prevent="handleNavigation('/market')"
              class="d-flex align-items-center no-underline"
              :class="{ 'active-link p-2 rounded-1': $route.path === '/market' }"
            >
              <img src="../assets/sidebar-bulb.png" alt="" class="me-2" />
              <span>Market Intelligence</span>
            </a>
          </div>
          <div class="d-flex mb-2 p-2 rounded-2">
            <router-link
              to="/settings"
              class="d-flex align-items-center no-underline"
              active-class="active-link p-2 rounded-1"
              exact-active-class="active-link p-2"
            >
              <img src="../assets/sidebar-settings.png" alt="" class="me-2" />
              <span>Account Settings</span>
            </router-link>
          </div>
        </div>

        <!-- Help Section -->
        <div class="help-section mt-4 bg-white px-2 py-4">
          <img
            src="../assets/sidebar-question.png"
            alt=""
            class="img-fluid mb-2"
          />
          <p>Need Help?</p>
          <p class="help-info">We are readily available to provide help</p>
          <button class="btn w-30">Get help</button>
        </div>
      </div>
    </div>
    
    <!-- Overlay for mobile -->
    <div 
      v-if="isSidebarVisible" 
      class="sidebar-overlay d-lg-none"
      @click="toggleSidebar"
    ></div>

    <!-- Modal for campaign creation reminder -->
    <div v-if="showModal" class="modal-overlay animate__animated animate__fadeInRight" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Create a Campaign First!</h2>
        <p>Please create a new campaign before accessing this section.</p>
        <button @click="closeModal" class="btn btn-primary">Close</button>
      </div>
    </div>
  </div>
</template>


<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "Sidebar",
  setup() {
    const router = useRouter();
    const isSidebarVisible = ref(false);
    const showModal = ref(false);

    const toggleSidebar = () => {
      isSidebarVisible.value = !isSidebarVisible.value;
      document.body.style.overflow = isSidebarVisible.value ? 'hidden' : 'auto';
    };

    const handleNavigation = (route) => {
      const campaignCreated = localStorage.getItem("campaignCreated") === "true";
      if (campaignCreated) {
        router.push(route);
      } else {
        showModal.value = true;
      }
    };

    const closeModal = () => {
      showModal.value = false;
    };

    return {
      isSidebarVisible,
      toggleSidebar,
      handleNavigation,
      showModal,
      closeModal,
    };
  },
};
</script>


<style scoped>
/* Sidebar styles */
.sidebar {
  background-color: #f8f9fa;
  height: 100vh;
  width: 250px;
  position: fixed;
  top: 0;
  left: -300px;
  transition: left 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  z-index: 9999;
  overflow-y: auto;
}

.sidebar-visible {
  left: 0;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.sidebar-content {
  padding: 20px;
}

.sidebar-links > div > span {
  font-size: 15px;
}

.sidebar-links > div:hover {
  background-color: #fff;
  cursor: pointer;
}

.sidebar-links img {
  width: 20px;
  height: 20px;
}

.campaign-btn > button {
  background-color: #247b7b;
  border: none;
}

.campaign-btn > .underline > button:hover {
  background-color: #174949 !important;
}

button > .add {
  padding-right: 10px;
}

.help-section > .help-info {
  width: 110%;
  margin-left: -10px;
}

.help-section > .btn {
  border: 2px solid #247b7b;
  color: #247b7b;
}

.no-underline {
  text-decoration: none;
  color: #455454;
}

.underline > button {
  text-decoration: none;
  background-color: #247b7b;
}

.campaign-btn > .underline {
  text-decoration: none;
}

.router-link-active,
.router-link-exact-active {
  text-decoration: none;
  color: inherit;
}

.hamburger-btn {
  position: fixed;
  top: 70px;
  left: -12px;
  z-index: 99999;
  border: none;
  background-color: #247b7b;
  color: #fff;
  padding: 10px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  overflow: auto;
}

.hamburger-btn:hover {
  background-color: #174949;
}

/* Active link styles */
.active-link {
  background-color: #fff;
  color: #247b7b !important;
}

/* Overlay styles */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.sidebar-visible + .sidebar-overlay {
  opacity: 1;
}



/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
  box-sizing: border-box;
}

.modal-content {
  background-color: white;
  padding: 2%;
  border-radius: 10px;
  text-align: center;
  max-width: 90%;
  width: 30%;
  max-height: 90vh;
  /* overflow-y: auto; */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  margin-bottom: 4%;
  font-size: clamp(1.2rem, 4vw, 2rem);
  color: #247b7b;
}

.modal-content p {
  margin-bottom: 6%;
  font-size: clamp(0.9rem, 3vw, 1.2rem);
  line-height: 1.5;
}

.modal-content button {
  background-color: #247b7b;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: clamp(0.8rem, 2.5vw, 1rem);
  transition: background-color 0.3s ease;
}

.modal-content button:hover {
  background-color: #174949;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-content {
    padding: 10%;
    width: 70%;
  }

  .modal-content h2 {
    margin-bottom: 6%;
  }

  .modal-content p {
    margin-bottom: 8%;
  }
}

@media (max-width: 480px) {
  .modal-content {
    width: 90%;
    padding: 5%;
  }

  .modal-content h2 {
    margin-bottom: 8%;
  }

  .modal-content p {
    margin-bottom: 10%;
  }

  .modal-content button {
    padding: 12px 24px;
  }
}
/* Media queries for responsiveness */
@media (min-width: 992px) {
  .sidebar {
    left: 0;
  }
  
  .hamburger-btn {
    display: none;
  }
}

@media (max-width: 991px) {
  .sidebar {
    width: 100%;
    max-width: 300px;
   
  }
}
</style>