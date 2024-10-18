<template>
  <div
    class="container position-rel"
    :class="{ 'background-inactive': isSuccessModalVisible }"
  >
    <div class="d-flex justify-content-between align-items-center mb-3">
      <button @click="$emit('goBack')" class="btn go-back">
        <i class="bi bi-arrow-left"></i> Go Back
      </button>
    </div>

    <h3 class="mt-3 text-start header animate__animated animate__bounce animate__delay-2s">Edit Campaign</h3>

    <div v-if="loading" class="loader" role="status">
      <div class="spinner-border"></div>
      <span class="loader-text ps-4">Loading...</span>
    </div>

    <div v-else-if="error" class="alert alert-danger bg-white border-0 text-white animate__animated animate__bounce animate__delay-2s">
      {{ error }}
    </div>

    <form v-else class="needs-validation mt-4" novalidate @submit.prevent>
      <!-- Campaign Status just above the input fields -->
       <!-- Campaign Status Display with Toggle -->
       <div class="status rounded-2 mb-3 animate__animated animate__pulse animate__delay-3s">
        <span class="fw-bold">Campaign Status</span> |
        <span
          class="badge"
          :style="{
            color: campaign.campaignStatus === 'Active' ? '#28a745' : '#dc3545',
          }"
          @click="toggleCampaignStatus"
          style="cursor: pointer"
        >
          {{ campaign.campaignStatus }}
        </span>
      </div>

      <div class="mb-4 campaign-name">
        <label for="campaignName" class="form-label text-start animate__animated animate__bounce animate__delay-2s"
          >Campaign Name</label
        >
        <input
          type="text"
          class="form-control  animate__animated animate__backInRight"
          id="campaignName"
          v-model="campaign.campaignName"
          required
        />
      </div>

      <div class="mb-4">
        <label for="campaignDescription" class="form-label text-start animate__animated animate__bounce animate__delay-2s"
          >Campaign Description</label
        >
        <textarea
          class="form-control animate__animated animate__backInRight"
          id="campaignDescription"
          v-model="campaign.campaignDescription"
          required
        ></textarea>
      </div>

      <div class="row g-3 mb-4">
        <div class="col-sm-6">
          <label for="startDate" class="form-label text-start animate__animated animate__bounce animate__delay-2s"
            >Start Date</label
          >
          <input
            type="date"
            class="form-control animate__animated animate__backInRight"
            id="startDate"
            v-model="campaign.startDate"
            required
          />
        </div>
        <div class="col-sm-6 end-date">
          <label for="endDate" class="form-label text-start animate__animated animate__bounce animate__delay-2s">End Date</label>
          <input
            type="date"
            class="form-control animate__animated animate__backInRight"
            id="endDate"
            v-model="campaign.endDate"
            required
          />
        </div>
      </div>

      <div class="mb-4">
        <label for="digestCampaign" class="form-label text-start animate__animated animate__bounce animate__delay-2s"
          >Digest Campaign</label
        >
        <select
          class="form-control animate__animated animate__backInRight"
          id="digestCampaign"
          v-model="campaign.digestCampaign"
        >
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
      </div>

      <div v-if="campaign.digestCampaign">
        <div class="mb-4 keyword">
          <label for="linkedKeywords" class="form-label text-start animate__animated animate__bounce animate__delay-2s"
            >Linked Keywords</label
          >
          <div class="keyword-container  animate__animated animate__backInRight">
            <span
              v-for="(keyword, index) in campaign.linkedKeywords"
              :key="index"
              class="keyword-badge"
            >
              {{ keyword }}
              <span class="keyword-close" @click="removeKeyword(index)"
                >&times;</span
              >
            </span>
          </div>
          <div class="input-group mt-2">
            <input
              type="text"
              class="form-control animate__animated animate__backInRight"
              v-model="newKeyword"
              @keyup.enter.prevent="addKeyword"
              placeholder="Add new keyword and press Enter"
            />
          </div>
        </div>

        <div class="mb-4">
          <label for="dailyDigest" class="form-label text-start  animate__animated animate__bounce animate__delay-2s"
            >Daily Digest</label
          >
          <input
            type="text"
            class="form-control animate__animated animate__backInRight"
            id="dailyDigest"
            v-model="campaign.dailyDigest"
          />
        </div>
      </div>

      <div
        class="buttons-container mt-4 d-flex flex-column flex-sm-row justify-content-start gap-2"
      >
        <button
          @click="showDeleteModal"
          type="button"
          class="btn btn-danger stop-btn animate__animated animate__pulse animate__delay-3s"
        >
          Stop Campaign
        </button>
        <button
          @click.prevent="saveCampaign"
          type="button"
          class="btn btn-outline-success edit-btn animate__animated animate__pulse animate__delay-3s"
        >
          Edit Information
        </button>
      </div>
    </form>

    <div class="mt-5">
      <DeleteModal
        :isVisible="isDeleteModalVisible"
        @close="closeDeleteModal"
        @confirm="handleConfirmStop"
      />
    </div>

    <!-- New CampaignDeleted Modal -->
    <CampaignDeleted
      v-if="showDeletedModal"
      @close="closeCampaignDeletedModal"
      @goBack="goBackToList"
    />
  </div>

  <!-- Success modal -->
  <SuccessModal
    v-if="isSuccessModalVisible"
    @closeModal="closeSuccessModal"
    @goBack="goBackToList"
  />
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import DeleteModal from "./Deletemodal.vue";
import CampaignDeleted from "./CampaignDeleted.vue";
import SuccessModal from "./Editsuccessful.vue";

// Props
const props = defineProps({
  campaignId: {
    type: [String, Number],
    required: true,
  },
});

const isSuccessModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const showDeletedModal = ref(false);
const loading = ref(false);
const error = ref(null);
const newKeyword = ref("");
const emit = defineEmits(["goBack", "campaignUpdated"]);

const campaign = ref({
  id: null,
  campaignName: "",
  campaignDescription: "",
  startDate: "",
  endDate: "",
  digestCampaign: false,
  linkedKeywords: [],
  dailyDigest: "",
  campaignStatus: "",
});

const baseURL = "https://infinion-test-int-test.azurewebsites.net/api";

const fetchCampaignById = async (id) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${baseURL}/Campaign/${id}`);
    console.log("API Response:", response.data);
    const campaignData = response.data;

    if (!campaignData.id) {
      console.warn(
        "Campaign ID is missing from the API response. Setting it manually."
      );
      campaignData.id = id;
    }

    campaign.value = {
      id: campaignData.id,
      campaignName: campaignData.campaignName || "",
      campaignDescription: campaignData.campaignDescription || "",
      startDate: formatDateForInput(campaignData.startDate),
      endDate: formatDateForInput(campaignData.endDate),
      digestCampaign: Boolean(campaignData.digestCampaign),
      linkedKeywords: Array.isArray(campaignData.linkedKeywords)
        ? campaignData.linkedKeywords
        : [],
      dailyDigest: campaignData.dailyDigest || "",
      campaignStatus: campaignData.campaignStatus || "Inactive",
    };

    // Store the campaign status in localStorage
    localStorage.setItem(`campaignStatus_${id}`, campaign.value.campaignStatus);
  } catch (err) {
    console.error("Error fetching campaign details:", err);
    error.value = "Failed to fetch campaign details. Please try again later.";
  } finally {
    loading.value = false;
  }
};

const toggleCampaignStatus = () => {
  campaign.value.campaignStatus =
    campaign.value.campaignStatus === "Active" ? "Inactive" : "Active";
  
  // Update the status in localStorage
  localStorage.setItem(`campaignStatus_${campaign.value.id}`, campaign.value.campaignStatus);

   // Emit an event to notify the parent about the status change
   emit("campaignUpdated", campaign.value.id);
};

const formatDateForAPI = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString();
};

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const saveCampaign = async () => {
  loading.value = true;
  error.value = null;

  if (!campaign.value.id) {
    error.value = "Cannot save campaign without a valid ID.";
    loading.value = false;
    return;
  }

  try {
    const campaignData = {
      id: campaign.value.id,
      campaignName: campaign.value.campaignName,
      campaignDescription: campaign.value.campaignDescription,
      startDate: formatDateForAPI(campaign.value.startDate),
      endDate: formatDateForAPI(campaign.value.endDate),
      digestCampaign: Boolean(campaign.value.digestCampaign),
      linkedKeywords: Array.isArray(campaign.value.linkedKeywords)
        ? campaign.value.linkedKeywords
        : [],
      dailyDigest: campaign.value.dailyDigest || null,
      campaignStatus: campaign.value.campaignStatus,
    };

    const response = await axios.put(
      `${baseURL}/Campaign/${campaign.value.id}`,
      campaignData
    );
    
    // Always show the success modal, regardless of digestCampaign value
    isSuccessModalVisible.value = true;

    if (response.status === 200) {
      emit("campaignUpdated", campaign.value.id);
      console.log("Emitting campaignUpdated with:", campaignData);
      
      // Update localStorage with the new status
      localStorage.setItem(`campaignStatus_${campaign.value.id}`, campaign.value.campaignStatus);
    }
  } catch (err) {
    console.error("Error saving campaign:", err);
    error.value = "Failed to update campaign. Please try again later.";
  } finally {
    loading.value = false;
  }
};

const closeSuccessModal = () => {
  isSuccessModalVisible.value = false;
};

const addKeyword = () => {
  if (newKeyword.value.trim() !== "") {
    campaign.value.linkedKeywords.push(newKeyword.value.trim());
    newKeyword.value = "";
  }
};

const removeKeyword = (index) => {
  campaign.value.linkedKeywords.splice(index, 1);
};

const showDeleteModal = () => {
  isDeleteModalVisible.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalVisible.value = false;
  fetchCampaignById(props.campaignId);
};

const handleConfirmStop = async () => {
  loading.value = true;
  error.value = null;
  try {
    await axios.delete(`${baseURL}/Campaign/${props.campaignId}`);
    emit("campaignUpdated", props.campaignId);
    closeDeleteModal();
    showDeletedModal.value = true;
    emit("campaignUpdated");
    
    // Remove the campaign status from localStorage when the campaign is deleted
    localStorage.removeItem(`campaignStatus_${props.campaignId}`);
  } catch (err) {
    error.value = "Failed to stop the campaign. Please try again later.";
  } finally {
    loading.value = false;
  }
};

const closeCampaignDeletedModal = () => {
  showDeletedModal.value = false;
  emit("campaignDeleted", props.campaignId);
};

const goBackToList = () => {
  emit("goBack");
  emit("campaignUpdated");
};

onMounted(() => {
  if (props.campaignId) {
    fetchCampaignById(props.campaignId);
  }
});

watch(
  () => props.campaignId,
  (newId) => {
    if (newId) {
      fetchCampaignById(newId);
    }
  },
  { immediate: true }
);
</script>


  
  
  <style scoped>
.form-control {
  background-color: #e9ecef;
  cursor: pointer;
  opacity: 1;
  width: 65% !important;
}

.form-control:focus {
  box-shadow: 0 0 5px 6px #247b7b;
}

input[readonly]:hover,
textarea[readonly]:hover {
  border-color: #ced4da;
}

.keyword-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.keyword-badge {
  background-color: #247b7b;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: inline-flex;
  align-items: center;
}

.keyword-close {
  margin-left: 0.5rem;
  cursor: pointer;
}

.badge {
  font-size: 1rem;
}

.form-label {
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
}

.loader {
  position: absolute;
  top: 55%;
  left: 50%;
}

.spinner-border,
.loader-text,
.header {
  color: #247b7b;
}

.end-date {
  margin-left: -17%;
}

.container > .btn {
  background-color: #247b7b;
  color: #fff;
  margin-left: -90%;
}

/* For the status component */

/* Button Styling  */
.buttons-container {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.edit-btn {
  color: #247b7b;
  border: 1px solid #247b7b;
  background-color: transparent;
}

.edit-btn:hover {
  background-color: #247b7b;
  color: #fff;
}

.stop-btn {
  background-color: #990000;
  color: #fff;
}

.stop-btn:hover {
  background-color: #990000;
  color: #fff;
}

.keyword > .input-group {
  width: 65%;
}

/* Customize the form labels and fields */
.form-label {
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
}

.keyword-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.keyword-badge {
  background-color: #247b7b;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: inline-flex;
  align-items: center;
}

.keyword-close {
  margin-left: 0.5rem;
  cursor: pointer;
}

.status {
  background-color: #e9ecef;
  padding: 0.5rem;
}

/* Form Input Focus */
.form-control:focus {
  box-shadow: 0 0 5px 2px rgba(36, 123, 123, 0.5);
}

/* Button Styling */
.buttons-container .btn {
  min-width: 150px;
}

.go-back {
  margin-top: 4%;
  background-color: #247b7b !important;
  color: #fff;
}

.go-back:hover {
  color: #fff;
  background-color: #174949 !important;
}

/* Overlay for background when modal is visible */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); /* Dim effect */
  z-index: 999; /* Ensure it covers the content */
}

/* Prevent background interactions */
.background-inactive {
  overflow: hidden;
  pointer-events: none; /* Disable clicks */
  opacity: 0.5; /* Make background lighter */
}

.edit-btn:hover {
  background-color: #247b7b !important;
  color: #fff;
}

/* Make it responsive */
@media (min-width: 998px) and (max-width: 1124px) {
  .container {
    margin-left: 10%;
  }

  .go-back {
    margin-top: 5%;
  }

  .status {
    width: 35%;
  }

  .campaign-name {
    margin-top: 10%;
  }
}

@media (max-width: 768px) {
  .campaign-name {
    margin-top: 10%;
  }

  .container {
    margin-top: 20%;
  }

  .form-control {
    width: 100% !important;
  }

  .keyword > .input-group {
    width: 100%;
  }

  .end-date {
    margin-left: 0%;
  }

  .button-container {
    display: block;
  }
}

.status {
  background-color: #e9ecef;
  text-align: left;
  font-size: 1rem;
  width: 26%;
}

@media (max-width: 768px) {
  .status {
    font-size: 0.9rem;
    padding: 1rem;
    width: 90%;
  }
}
</style>