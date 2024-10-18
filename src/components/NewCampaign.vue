<template>
  <div class="newCampaign-container">
    <myNav />

    <!-- Overlay that disables interaction with the background -->
    <div v-if="showSuccessModal" class="modal-overlay "></div>

    <!-- Show Preloader when loading is true -->
    <div v-if="loading" class="preloader-overlay">
      <div class="spinner"></div>
    </div>

    <div class="newCampaign-content container ">
      <div class="row">
        <div class="col-12">
          <p class="fw-bolder newCampaign-header text-start pt-3 pb-5 animate__animated animate__bounce animate__delay-2s">
            Create New Campaign
          </p>

          <!-- Error message if fields are missing -->
          <div v-if="errorMessage" class="alert alert-danger col-12 col-md-6">
            {{ errorMessage }}
          </div>
        </div>
      </div>

      <div class="campaign-inputField">
        <!-- Campaign Name -->
        <div class="row mb-3">
          <div class="col-12 col-md-6 form-group">
            <label for="campaignName" class="d-block text-start">
              Campaign Name<span class="text-danger animate__animated animate__bounce animate__delay-2s">*</span>
            </label>
            <input
              type="text"
              id="campaignName"
              class="form-control input-width w-100 animate__animated animate__backInRight "
              placeholder="e.g The Future is now"
              v-model="campaignName"
            />
          </div>
        </div>

        <!-- Campaign Description -->
        <div class="row mb-3 pt-4">
          <div class="col-12 col-md-6 form-group">
            <label for="campaignDescription" class="d-block text-start animate__animated animate__bounce animate__delay-2s">
              Campaign Description
            </label>
            <input
              type="text"
              id="campaignDescription"
              class="form-control add-description input-width w-100 animate__animated animate__backInRight "
              placeholder="Please add a description to your campaign"
              v-model="campaignDescription"
            />
          </div>
        </div>

        <div class="row pt-4">
          <!-- Start Date -->
          <div class="col-12 col-sm-6 col-md-3 mb-3 form-group">
            <label for="startDate" class="d-block text-start animate__animated animate__bounce animate__delay-2s">
              Start Date<span class="text-danger">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              class="form-control input-width date-input w-100 animate__animated animate__backInRight "
              v-model="startDate"
            />
          </div>

          <!-- End Date -->
          <div class="col-12 col-sm-6 col-md-3 mb-3 form-group">
            <label for="endDate" class="d-block text-start animate__animated animate__bounce animate__delay-2s"> End Date </label>
            <input
              type="date"
              id="endDate"
              class="form-control input-width date-input w-100 animate__animated animate__backInRight "
              v-model="endDate"
            />
          </div>
        </div>

        <!-- Daily Digest Toggle -->
        <div className="row pt-4">
          <div
            className="col-12 form-group d-flex align-items-center flex-wrap"
          >
            <p className="text-start mb-0 me-3  animate__animated animate__bounce animate__delay-2s">
              Want to receive daily digest about the campaign?
            </p>
            <span className="form-group mb-0">
              <span className="billing-toggle">
                <input
                  type="checkbox"
                  id="billing-toggle-checkbox"
                  className="d-none"
                  v-model="digestCampaign"
                />
                <label
                  htmlFor="billing-toggle-checkbox"
                  className="billing-label"
                ></label>
              </span>
            </span>
          </div>
        </div>
        <!-- Add transition for Linked Keywords and Digest Frequency -->
        <transition name="fade-slide" mode="out-in">
          <div v-if="digestCampaign" key="digestCampaignContent">
            <!-- Linked Keywords -->
            <div class="row mb-3 mt-5">
              <div class="col-12 col-md-6 form-group w-100">
                <label for="linkedKeywords" class="d-block text-start animate__animated animate__bounce animate__delay-2s">
                  Linked Keywords<span class="text-danger">*</span>
                </label>
                <div
                  class="form-control add-description input-width d-flex flex-wrap animate__animated animate__backInRight "
                >
                  <span
                    v-for="(keyword, index) in keywords"
                    :key="index"
                    class="keyword-tag text-white"
                  >
                    {{ keyword }}
                    <span class="remove-keyword" @click="removeKeyword(index)"
                      >&times;</span
                    >
                  </span>
                  <input
                    type="text"
                    v-model="newKeyword"
                    class="add-description-input animate__animated animate__backInRight "
                    placeholder="Type a keyword and press Enter"
                    @keyup.enter="addKeyword"
                  />
                </div>
              </div>
            </div>

            <!-- Digest Frequency -->
            <div class="row mb-3 pt-4">
              <div class="col-12 col-md-6 form-group">
                <label for="digestFrequency" class="d-block text-start animate__animated animate__bounce animate__delay-2s">
                  Kindly select how often you want to receive daily digest
                </label>
                <select
                  id="digestFrequency"
                  class="form-control input-width w-100 animate__animated animate__backInRight "
                  v-model="dailyDigest"
                >
                  <option value="" disabled selected>Select frequency</option>
                  <option value="daily">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="row mt-5">
        <div class="col-6 col-sm-3 campaign-btn mb-3 animate__animated animate__heartBeat  animate__delay-3s">
          <router-link to="/home" class="d-flex align-items-center underline">
            <button class="btn rounded-2 cancel-btn w-100 text-white p-2">
              <span>Cancel</span>
            </button>
          </router-link>
        </div>

        <!-- Create Campaign Button -->
        <div class="col-6 col-sm-3 campaign-btn mb-3 animate__animated animate__heartBeat animate__delay-3s">
          <button
            class="btn w-100 text-white rounded-2 p-2"
            @click="createCampaign"
          >
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      <!-- Show Success Modal after successful POST -->
      <SuccessModal v-if="showSuccessModal" class="modal-overlay" />
    </div>

    <mySidebar />
  </div>
</template>


<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import myNav from "../components/Nav.vue";
import mySidebar from "../components/MySidebar.vue";
import SuccessModal from "./SuccessModal.vue"; // Import the Success Modal

export default {
  components: {
    myNav,
    mySidebar,
    SuccessModal, // Register the modal
  },

  setup() {
    const router = useRouter();
    const campaignName = ref("");
    const campaignDescription = ref("");
    const startDate = ref("");
    const endDate = ref("");
    const digestCampaign = ref(false);
    const keywords = ref([]);
    const newKeyword = ref("");
    const dailyDigest = ref("");
    const showSuccessModal = ref(false); // Modal control
    const loading = ref(false); // Loading state for the preloader
    const errorMessage = ref(""); // Error message for validation
    const createdCampaignId = ref(null); // Store the ID of the created campaign

    // Add a keyword when Enter is pressed
    const addKeyword = () => {
      const trimmedKeyword = newKeyword.value.trim();
      if (trimmedKeyword && !keywords.value.includes(trimmedKeyword)) {
        keywords.value.push(trimmedKeyword);
        newKeyword.value = "";
      }
    };

    // Remove a keyword by index
    const removeKeyword = (index) => {
      keywords.value.splice(index, 1);
    };

    // Validate form fields
    const validateFields = () => {
      if (
        !campaignName.value ||
        !startDate.value ||
        !endDate.value ||
        !campaignDescription.value
      ) {
        errorMessage.value = "Please fill all the required fields.";
        return false;
      }
      errorMessage.value = "";
      return true;
    };

    // function to create campaign
    const createCampaign = async () => {
      if (!validateFields()) {
        return;
      }

      loading.value = true;

      const payload = {
        campaignName: campaignName.value,
        campaignDescription: campaignDescription.value,
        startDate: new Date(startDate.value).toISOString(),
        endDate: new Date(endDate.value).toISOString(),
        digestCampaign: digestCampaign.value,
        linkedKeywords: keywords.value,
        dailyDigest: dailyDigest.value,
      };

      try {
        const response = await axios.post(
          "https://infinion-test-int-test.azurewebsites.net/api/Campaign",
          payload
        );

        console.log("Campaign created successfully:", response.data);
        createdCampaignId.value = response.data.id;
        localStorage.setItem("campaignCreated", JSON.stringify(true));
        localStorage.setItem("campaignCreated", "true"); // Set flag when campaign is created
        showSuccessModal.value = true;
        emits("campaignCreated", response.data);
      } catch (error) {
        console.error("Error creating campaign:", error);
        // errorMessage.value = "fill all required fields";
      } finally {
        loading.value = false;
      }
    };

    return {
      campaignName,
      campaignDescription,
      startDate,
      endDate,
      digestCampaign,
      keywords,
      newKeyword,
      addKeyword,
      removeKeyword,
      dailyDigest,
      createCampaign,
      showSuccessModal, // Return the modal control
      loading, // Return loading state for preloader
      errorMessage, // Return the error message for validation
      createdCampaignId, // Return the ID of the created campaign
    };
  },
};
</script>



<style scoped>
.newCampaign-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}


/* Ensure the newCampaign-content is below the modal */
.newCampaign-content {
  position: relative;
  z-index: 1;
}

.newCampaign-content {
  margin-left: 20%;
}

.newCampaign-content > .newCampaign-header {
  color: #247b7b;
  font-size: 18px;
}

.input-width {
  width: 50%; /* Custom width for input fields */
}

.form-control:focus,
select:focus {
  box-shadow: 0 0 5px 2px #174949 !important;
  border-color: #174949 !important;
  outline: none;
}

.form-group > .add-description {
  height: 120px;
}

.campaign-btn > button {
  background-color: #247b7b;
  border: none;
}

.campaign-btn > .underline > .cancel-btn {
  background-color: #fff !important;
  color: #174949 !important;
  border-color: #174949;
}

.campaign-btn > .underline > .cancel-btn:hover {
  background-color: #247b7b !important;
  color: #fff !important;
  border-color: #174949;
}

.campaign-btn > .underline > button:hover {
  background-color: #174949 !important;
}

.underline > button {
  text-decoration: none;
  background-color: #247b7b;
}

.campaign-btn > .underline {
  text-decoration: none;
}

.keyword-tag {
  background-color: #247b7b;
  border-radius: 15px;
  padding: 5px 10px;
  margin-right: 5px;
  display: inline-flex;
  align-items: top;
}

.keyword-tag .remove-keyword {
  margin-left: 8px;
  color: #fff;
  cursor: pointer;
}

.add-description-input {
  border: none;
  outline: none;
  flex: 1;
  padding: 5px;
  font-size: 14px;
  min-width: 100px;
}

.add-description {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
}

/* New transition animation for smooth visibility of linked keywords */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.fade-slide-enter,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Existing styles... */
.newCampaign-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: scroll;
}

/* Preloader overlay */
.preloader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

/* Ensure the newCampaign-content is below the modal */
.newCampaign-content {
  position: relative;
  z-index: 1;
}


/* Spinner style */
.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #f3f3f3;
  border-top: 6px solid #1e5b5b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


.billing-toggle {
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
}

.billing-label {
  width: 50px;
  height: 24px;
  background-color: #174949;
  border-radius: 30px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
}

.billing-label::before {
  content: "";
  width: 20px;
  height: 20px;
  background-color: #fff;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 3px;
  transform: translateY(-50%);
  transition: left 0.3s ease;
}

#billing-toggle-checkbox:checked + .billing-label {
  background-color: #6e0080;
}

#billing-toggle-checkbox:checked + .billing-label::before {
  left: calc(100% - 23px);
}

@media (max-width: 575px) {
  .form-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .billing-toggle {
    margin-left: 0;
    margin-top: 10px;
  }
}

/* Add these new responsive styles */
@media (max-width: 1200px) {
  .newCampaign-content {
    margin-left: 27%;
    padding: 0 15px;
  }
}

@media (max-width: 780px) {
  .newCampaign-content {
    margin-left: 0;
    padding: 100px 15px 0;
  }

  .input-width {
    width: 100%;
  }

  .billing-toggle {
    width: 100%;
    max-width: none;
    top: 0;
    margin: 10px 0;
  }

  .campaign-btn > button,
  .campaign-btn > .underline > .cancel-btn {
    width: 100%;
  }
}

@media (max-width: 575px) {
  .newCampaign-header {
    font-size: 16px;
  }

  .form-group > .add-description {
    height: auto;
    min-height: 120px;
  }

  .billing-toggle {
    /* top: -35px; */
    margin: 10px 0;
  }
}
</style>
