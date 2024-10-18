<template>
  <div class="page-layout" :class="{ 'full-width': !isSidebarVisible }">
    <myNav />

    <div class="main-content d-flex animate__animated animate__bounceInRight animate__slow">
      <myHamburger @toggle-sidebar="toggleSidebar" />
      <Sidebar :isSidebarVisible="isSidebarVisible" />
      <span class="fw-bolder fs-4 pe-5 ps-4 header">Overview</span>

      <div class="date-container rounded-1">
        <!-- Date Input Field -->
        <input
          type="date"
          class="hidden-date-text pe-1"
          v-model="selectedDate"
          @change="addDate"
        />

        <!-- Date Display Area -->
        <span class="date-range pe-1">Date Range</span> |
        <span class="date-area pe-2 ps-2">{{ formattedDate }}</span>

        <!-- Select element for stored dates -->
        <select id="select-date" @change="selectStoredDate">
          <option value="" selected></option>
          <option
            v-for="(date, index) in storedDates"
            :key="index"
            :value="date"
          >
            {{ date }}
          </option>
        </select>

        <!-- Clear button to reset dates -->
        <span class="clear-button ps-5 fw-bold" @click="clearDates"
          ><button>Clear</button></span
        >
      </div>

      <!-- upload icon  -->
      <span class="upload ms-4 px-3 py-1 rounded-2">
        <i class="bi bi-upload"></i>
        <span class="export-text ps-3">Export</span>
      </span>
    </div>

    <div v-if="!isCampaignCreated" class="body pt-5 animate__animated animate__zoomInLeft animate__delay-2s animate__slow">
      <img src="../assets/main-img.png" alt="" />
      <p class="fw-bold pt-4 activity-text">
        No activity yet. Create a new campaign to get started
      </p>
    </div>

    <div v-if="isCampaignCreated" class="fw-bold mt-5 d-flex align-items-center  animate__animated animate__zoomInLeft animate__delay-2s animate__slow">
      <span class="campaign-text"
        >Click here to view your created campaigns</span
      >
      <i class="bi bi-caret-down-fill beating-btn arrow"></i>
    </div>

    <!-- Campaign button (shown only when a campaign is created) -->
    <div v-if="isCampaignCreated" class="d-flex mb-2 beating-btn p-2 rounded-2  animate__animated animate__zoomInLeft animate__delay-2s animate__slow">
      <router-link
        to="/campaign"
        class="d-flex align-items-center text-white no-underline"
        active-class="active-link p-2 rounded-1"
        exact-active-class="active-link p-2"
      >
        <span>View Campaigns</span>
      </router-link>
    </div>

    <div class="campaign-btn mt-5  animate__animated animate__zoomInLeft animate__delay-2s animate__slow">
      <button class="p-2 rounded-2 ps-4 pe-4 text-white">
        <router-link
          to="/NewCampaign"
          class="d-flex align-items-center router-link"
        >
          <span class="add">+</span>
          <span>New Campaign</span>
        </router-link>
      </button>
    </div>

    <!-- Log out button -->
    <span class="logout-btn  animate__animated animate__zoomInLeft animate__delay-2s animate__slow">
      <button class="p-2 rounded-2 text-white" @click="showLogoutModal">
        <span>Log out</span>
      </button>
    </span>

    <!-- Confirmation Modal -->
    <ConfirmModal
      :isVisible="isModalVisible"
      @confirm="handleLogout"
      @cancel="closeModal"
    />
    <mySidebar v-if="isSidebarVisible" />
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import myNav from "../components/Nav.vue";
import mySidebar from "../components/MySidebar.vue";
import myHamburger from "../components/Hamburger.vue";
import ConfirmModal from "../components/ConfirmModal.vue";

export default {
  components: {
    myNav,
    mySidebar,
    myHamburger,
    ConfirmModal,
  },

  setup() {
    const router = useRouter();
    const selectedDate = ref("");
    const formattedDate = ref("Select a date");
    const storedDates = ref([]);
    const isCampaignCreated = ref(false);
    const isSidebarVisible = ref(true);
    const isModalVisible = ref(false);

    // Check if a campaign has been created when the component mounts
    onMounted(() => {
      const campaignCreated = localStorage.getItem("campaignCreated");
      if (campaignCreated) {
        isCampaignCreated.value = JSON.parse(campaignCreated);
      }
    });

    // Watch for route changes
    watch(
      () => router.currentRoute.value.path,
      (newPath) => {
        if (newPath === "/home") {
          // When returning to home, check if a campaign was created
          const campaignCreated = localStorage.getItem("campaignCreated");
          if (campaignCreated) {
            isCampaignCreated.value = JSON.parse(campaignCreated);
          }
        }
      }
    );

    // Fetch stored dates from localStorage on mount
    onMounted(() => {
      const stored = localStorage.getItem("storedDates");
      if (stored) {
        storedDates.value = JSON.parse(stored);
      }

      const firstStoredDate = localStorage.getItem("formattedDate");
      if (firstStoredDate) {
        formattedDate.value = firstStoredDate;
      }

      // Check if a campaign has been created
      const campaignCreated = localStorage.getItem("campaignCreated");
      if (campaignCreated) {
        isCampaignCreated.value = JSON.parse(campaignCreated);
      }
    });

    const addDate = () => {
      if (selectedDate.value) {
        const date = new Date(selectedDate.value);
        const options = { year: "numeric", month: "short", day: "numeric" };
        const formatted = date.toLocaleDateString("en-US", options);

        if (!storedDates.value.includes(formatted)) {
          storedDates.value.push(formatted);
          localStorage.setItem(
            "storedDates",
            JSON.stringify(storedDates.value)
          );
        }

        if (!localStorage.getItem("formattedDate")) {
          formattedDate.value = formatted;
          localStorage.setItem("formattedDate", formatted);
        }
      }
    };

    const selectStoredDate = (event) => {
      const selected = event.target.value;
      if (selected) {
        formattedDate.value = selected;
        localStorage.setItem("formattedDate", selected);
      }
    };

    const clearDates = () => {
      storedDates.value = [];
      formattedDate.value = "Select a date";
      localStorage.removeItem("storedDates");
      localStorage.removeItem("formattedDate");
    };

    const toggleSidebar = () => {
      isSidebarVisible.value = !isSidebarVisible.value;
    };

    const showLogoutModal = () => {
      isModalVisible.value = true;
    };

    const closeModal = () => {
      isModalVisible.value = false;
    };

    const handleLogout = () => {
      isModalVisible.value = false;
      window.location.href = "/login";
    };

    const createNewCampaign = () => {
      isCampaignCreated.value = true;
      localStorage.setItem("campaignCreated", JSON.stringify(true));
    };

    return {
      selectedDate,
      formattedDate,
      storedDates,
      isCampaignCreated,
      addDate,
      selectStoredDate,
      clearDates,
      isSidebarVisible,
      toggleSidebar,
      isModalVisible,
      showLogoutModal,
      closeModal,
      handleLogout,
      createNewCampaign,
      isCampaignCreated,
    };
  },
};
</script>



<style scoped>
/* Ensure full height layout */
.page-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  transition: width 0.3s ease-in-out;
  width: calc(90% - -8%);
}

.page-layout.full-width {
  width: 96%; /* Full width when sidebar is hidden */
  margin-left: -160px;
}

/* Main content styling */
.main-content {
  flex: 1;
  padding: 20px;
  margin-left: 17%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.main-content > .header {
  color: #1e5b5b;
}

/* Date container styling */
.date-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid #999999;
  padding: 5px;
  width: 37%;
  margin-left: 32%;
  white-space: nowrap; /* Prevent text wrapping */
}

.hidden-date-text {
  appearance: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding-right: 10px;
  width: 33px;
}

#select-date {
  border: none;
}

select {
  color: #1e5b5b;
}

.clear-button {
  cursor: pointer;
  color: #1e5b5b;
  font-size: 14px;
  position: relative;
  display: inline-block;
  margin-left: auto; /* Align to the right of .date-container */
}

.clear-button > button {
  background-color: #247b7b;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px;
  font-weight: bold;
}

.clear-button > button:hover {
  background-color: #ff00009f;
}

.date-range,
.date-area {
  font-size: 15px;
}

.upload {
  background-color: #f0f4f4;
}

.upload > svg,
.export-text {
  font-size: 14px;
  color: #247b7b;
}

.body > .activity-text {
  font-size: 15px;
}

.campaign-btn > button {
  background-color: #247b7b;
  border: none;
  width: 15%;
  padding: 7px 0 7px 0;
}

.campaign-btn > button:hover {
  background-color: #247b7bbb;
}

.campaign-btn > button {
  background-color: #247b7b !important; /* Desired background color */
  border: none;
  width: 15%;
  padding: 12px 0 12px 0 !important;
}

.campaign-btn > button > .router-link {
  text-decoration: none; /* Removes underline */
  color: #fff;
}

.campaign-btn > button:hover {
  background-color: #174949 !important; /* Hover color */
}

.campaign-btn > button > .router-link {
  text-decoration: none !important; /* Remove any text decoration */
  display: inline-block; /* Ensure proper block display */
}

button > .router-link > .add {
  padding-right: 26px;
  margin-left: 34px;
}

.beating-btn > .no-underline,
.logout-btn > .no-underline {
  text-decoration: none !important;
}

.logout-btn > button {
  background-color: #247b7b;
  width: 6%;
  margin-left: 90%;
  border: none;
}

.logout-btn > button:hover {
  background-color: #1e5b5b;
}

/* Style the campaign button */
.beating-btn {
  background-color: #247b7b;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 20px auto;
  width: 20%;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  animation: heartbeat 3s infinite ease-in-out;
}

.beating-btn:hover {
  background-color: #1e5b5b;
  transform: scale(1.05);
}

.beating-btn img {
  margin-right: 10px;
}

.arrow {
  width: 2%;
  margin-left: 1%;
}

.arrow:hover {
  cursor: not-allowed;
}

.campaign-text {
  font-size: 20px;
  margin-left: 37%;
}
/* Heartbeat animation */
@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.2);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}


/* Rest of the existing styles... */

/* Responsive adjustments */
@media (max-width: 1200px) {
  .main-content {
    margin-left: 20%;
  }

  .date-container {
    width: 40.5%;
    margin-left: 10%;
  }

  .clear-button {
    margin-left: -13%;
  }

  .campaign-btn > button {
    width: 20%;
  }

  .logout-btn > button {
    width: 9%;
  }
}

@media (max-width: 992px) {
  .main-content {
    margin-left: 10%;
    flex-wrap: wrap;
  }

  .date-container {
    width: 40%;
    margin-left: 20%;
    margin-top: 10px;
  }

  .upload {
    margin-top: 10px;
  }

  .campaign-btn > button {
    width: 25%;
  }

  .logout-btn > button {
    width: 10%;
    margin-left: 85%;
  }

  .clear-button {
    margin-left: 25%;
  }
}

@media (max-width: 768px) {
  .page-layout {
    width: 100%;
  }

  .main-content {
    margin-left: 5%;
    /* flex-direction: column; */
    align-items: flex-start;
  }

  .date-container {
    width: 70%;
    margin-left: 0;
    margin-top: 25px;
  }

  .upload {
    margin-top: 25px;
  }

  .logout-btn > button {
    width: 15%;
    margin-left: 80%;
  }

  .campaign-text {
    margin-left: 22%;
    font-size: 18px;
  }

  .beating-btn {
    width: 40%;
  }

  .arrow {
    width: 10%;
  }

  .clear-button {
    margin-left: 28%;
  }
}

@media (max-width: 576px) {
  .main-content {
    padding: 10px;
  }

  .date-container {
    width: 95%;
  }

  .date-container > * {
    margin-bottom: 5px;
  }

  .clear-button {
    margin-left: 2%;
  }

  .campaign-btn > button {
    width: 60%;
  }

  .logout-btn > button {
    width: 25%;
    margin-top: 7%;
    margin-left: 70%;
  }

  .campaign-text {
    margin-left: 6%;
    font-size: 16px;
  }

  .beating-btn {
    width: 60%;
  }

  .arrow {
    width: 7%;
    font-size: 10px;
  }

  .clear-button {
    display: none;
  }
}

@media (max-width:  380px) {
   .date-container {
    width: 100%;
   }

   .clear-button {
    display: none;
   }
}
</style>
