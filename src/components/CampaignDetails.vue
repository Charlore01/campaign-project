<template>
  <div class="container position-rel mt-4">

    <button @click="$emit('goBack')" class="btn mt-5 mb-1 go-back-btn">
      <i class="bi bi-arrow-left"></i>
      Go Back
    </button>


    <div v-if="loading" class="loader" role="status">
      <div class="spinner-border"></div>
      <span class="loader-text ps-4">Loading...</span>
    </div>

    <div v-else-if="error" class="alert alert-danger bg-white text-white border-0">{{ error }}</div>
    <form v-else class="needs-validation mt-5" novalidate @submit.prevent>

    <h3 class="mt-5 text-start header animate__animated animate__bounce animate__delay-2s">Campaign Details</h3>

        <!-- Campaign Status just above the input fields -->
        <div class="status rounded-2 p-2   animate__animated animate__pulse animate__delay-3s">
        <span class="fw-bold">Campaign Status</span> |
        <span
          class="fw-bold"
          :style="{
            color: campaign.campaignStatus === 'Active' ? '#28a745' : '#dc3545',
          }"
        >
          {{ campaign.campaignStatus }}
        </span>
      </div>

      <div class="mb-4 row">
        <label for="campaignName" class="form-label col-sm-12 text-start animate__animated animate__bounce animate__delay-2s">Campaign Name</label>
        <div class="col-sm-6 w-100 w-md-50">
          <input
            type="text"
            class="form-control w-50 animate__animated animate__backInRight"
            id="campaignName"
            v-model="campaign.campaignName"
            readonly
          />
        </div>
      </div>

      <div class="mb-4 row">
        <label for="campaignDescription" class="form-label col-sm-12 text-start animate__animated animate__bounce animate__delay-2s">Campaign Description</label>
        <div class="col-sm-6 w-100 ">
          <textarea
            class="form-control w-50 w-md-100 animate__animated animate__backInRight"
            id="campaignDescription"
            v-model="campaign.campaignDescription"
            readonly
          ></textarea>
        </div>
      </div>

      <div class="row mb-5">
        <div class="col-12 col-sm-6 col-md-3">
          <label for="startDate" class="form-label d-block text-start animate__animated animate__bounce animate__delay-2s">Start Date</label>
          <input
            type="datetime-local"
            class="form-control w-100 animate__animated animate__backInRight"
            id="startDate"
            v-model="campaign.startDate"
            readonly
          />
        </div>
        <div class="col-12 col-sm-6 col-md-3">
          <label for="endDate" class="form-label d-block text-start animate__animated animate__bounce animate__delay-2s">End Date</label>
          <input
            type="datetime-local"
            class="form-control end-date w-100 animate__animated animate__backInRight"
            id="endDate"
            v-model="campaign.endDate"
            readonly
          />
        </div>
      </div>

      <div class="mb-4 row">
        <label for="digestCampaign" class="form-label col-sm-12 text-start animate__animated animate__bounce animate__delay-2s">Digest Campaign</label>
        <div class="col-sm-6 w-100">
          <input
            type="text"
            class="form-control w-50 animate__animated animate__backInRight"
            id="digestCampaign"
            v-model="campaign.digestCampaignDisplay"
            readonly
          />
        </div>
      </div>

      <div class="mb-4 row">
        <label for="linkedKeywords" class="form-label col-sm-12 text-start animate__animated animate__bounce animate__delay-2s">Linked Keywords</label>
        <div class="col-sm-6 keyword-container animate__animated animate__backInRight">
          <span
            v-for="keyword in campaign.linkedKeywords"
            :key="keyword"
            class="keyword-badge"
          >
            {{ keyword }}
            <span class="keyword-close">&times;</span>
          </span>
        </div>
      </div>

      <div class="mb-4 row">
        <label for="dailyDigest" class="form-label col-sm-12 text-start animate__animated animate__bounce animate__delay-2s">Daily Digest</label>
        <div class="col-sm-6 w-100">
          <input
            type="text"
            class="form-control w-50 animate__animated animate__backInRight"
            id="dailyDigest"
            v-model="campaign.dailyDigest"
            readonly
          />
        </div>
      </div>
    </form>

    <!-- Stop Campaign button aligned to top left -->
    <div class="mt-5 stop-btn">
      <button @click="showDeleteModal" class="btn  animate__animated animate__pulse animate__delay-3s">
        Stop Campaign
      </button>
    </div>

    <!-- The DeleteModal component -->
    <DeleteModal
      :isVisible="isDeleteModalVisible"
      @close="closeDeleteModal"
      @confirm="handleConfirmStop"
    />

     <!-- New CampaignDeleted Modal -->
     <CampaignDeleted
      v-if="showDeletedModal"
      @close="closeCampaignDeletedModal"
      @goBack="goBackToList"  
    />
  </div>
</template>



<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";
import DeleteModal from "./Deletemodal.vue";
import CampaignDeleted from "./CampaignDeleted.vue";

const props = defineProps({
  campaignId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['goBack', 'campaignDeleted']);
const loading = ref(false);
const error = ref(null);
const isDeleteModalVisible = ref(false);
const showDeletedModal = ref(false);

const baseURL = "https://infinion-test-int-test.azurewebsites.net/api";

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
  digestCampaignDisplay: "",
  linkedKeywordsDisplay: "",
});

const fetchCampaignById = async (id) => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${baseURL}/Campaign/${id}`);
    const campaignData = response.data;

    campaign.value = {
      id: campaignData.id,
      campaignName: campaignData.campaignName || "",
      campaignDescription: campaignData.campaignDescription || "",
      startDate: formatDateForInput(campaignData.startDate),
      endDate: formatDateForInput(campaignData.endDate),
      digestCampaign: campaignData.digestCampaign || false,
      linkedKeywords: campaignData.linkedKeywords || [],
      dailyDigest: campaignData.dailyDigest || "",
      campaignStatus: campaignData.campaignStatus || "Inactive",
      digestCampaignDisplay: campaignData.digestCampaign ? "Yes" : "No",
      linkedKeywordsDisplay: Array.isArray(campaignData.linkedKeywords)
        ? campaignData.linkedKeywords.join(", ")
        : "",
    };
  } catch (err) {
    error.value = "Failed to fetch campaign details. Please try again later.";
  } finally {
    loading.value = false;
  }
};

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
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
    // emit("campaignDeleted", props.campaignId);
    closeDeleteModal();
    showDeletedModal.value = true;
  } catch (err) {
    error.value = "Failed to delete campaign. Please try again later.";
  } finally {
    loading.value = false;
  }
};

const closeCampaignDeletedModal = () => {
  showDeletedModal.value = false;
  emit('campaignDeleted', props.campaignId); // Emit event to parent component
};

// Emit the goBack event when the CampaignDeleted modal triggers it
const goBackToList = () => {
  emit('goBack');
};

watch(
  () => props.campaignId,
  (newId) => {
    if (newId) {
      fetchCampaignById(newId);
    }
  }
);

onMounted(() => {
  if (props.campaignId) {
    fetchCampaignById(props.campaignId);
  }
});
</script>


<style scoped>
/* Responsive adjustments */
.form-label {
  text-align: left;
  margin-bottom: 0.5rem;
}

input[readonly],
textarea[readonly] {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.form-control:focus {
  box-shadow: 0 0 5px 6px #247b7b;
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
}

.keyword-close {
  margin-left: 0.5rem;
  cursor: pointer;
}

/* Loader styles */
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.spinner-border,
.loader-text,
.header {
  color: #247b7b;
}

.stop-btn {
  display: flex;
  justify-content: flex-start;
}

.stop-btn > button {
  background-color: #990000;
  color: #fff;
}

.stop-btn > button:hover {
  background-color: #990000;
  color: #fff;
}

/* For the status component */
/* .status {
  position: absolute;
  top: 17%;
  right: 40%;
  padding: 0.5rem 1rem;
  background-color: #e9ecef;
  border-radius: 8px;
  font-weight: bold;
  display: inline-block;
} */


/* For the status component */
.status {
  margin-bottom: 1rem; /* Adds space below the status */
  background-color: #e9ecef;
  border-radius: 8px;
  font-weight: bold;
  padding: 0.5rem 1rem;
  display: inline-block;
  text-align: left;
}


.container > .btn {
  background-color: #247b7b;
  color: #fff;
}

.go-back-btn {
  margin-left: -90%;
}

@media (max-width: 1200px) {
  .container {
    margin-left: 15%;
  }
}

@media (max-width: 780.98px) {
  .container {
    margin-left: 0%;
  }
  /* Make input fields full width on mobile */
  .form-control {
    width: 100% !important;
  }

  .status {
    margin-left: -65%;
  }
}

@media (max-width: 450px) {
  .status {
    margin-left: -35%;
  }

  .form-control {
    width: 100% !important;
  }
}
</style>