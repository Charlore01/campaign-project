<template>
  <div class="campaign-layout">
    <myNav />

    <!-- Preloader -->
    <div v-if="isLoading && !showDetails && !isEditing" class="preloader">
      <div class="bouncing-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="">Loading</div>
    </div>

    <!-- Campaign Content -->
    <div class="campaign-content">
      <!-- Show Campaign List when not editing and not viewing details -->
      <div v-if="!isEditing && !showDetails">
        <p class="fw-bolder campaign-header pt-3 pb-4">All Campaigns</p>

        <!-- Campaign List (hidden when view details or edit is active) -->
        <div class="data-table">
          <div
            class="action-bar d-flex align-items-center justify-content-start  animate__animated animate__rotateInDownLeft animate__slow"
          >
            <button class="campaign-btn p-1">All ({{ totalCampaigns }})</button>
            <button class="campaign-btn p-1">
              Inactive ({{ inactiveCampaignsCount }})
            </button>
            <button class="campaign-btn p-1">
              Active ({{ activeCampaignsCount }})
            </button>

            <!-- Search Bar -->
            <div class="search-area ps-3">
              <div class="input-group">
                <input
                  type="text"
                  class="form-control search-input rounded-2"
                  placeholder="Search..."
                  aria-label="Search"
                  v-model="searchQuery"
                />
                <span class="input-group-text bg-white border-0 search-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                    />
                  </svg>
                </span>

                <!-- Select Tag with Options -->
                <select
                  class="form-select ms-3"
                  v-model="selectedFilter"
                  @change="applyFilter"
                >
                  <option value="Filter by Status" disabled>
                    Filter by Status
                  </option>
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Campaign Table -->
          <div class="table-responsive mt-5">
            <table class="table table-hover  animate__animated animate__bounceInDown animate__slow animate__delay-2s	">
              <thead>
                <tr>
                  <th scope="col">S/N</th>
                  <th scope="col">Campaign Name</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(campaign, index) in paginatedCampaigns"
                  :key="campaign.id"
                >
                  <td data-label="S/N">
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </td>
                  <td data-label="Campaign Name">
                    {{ campaign.campaignName }}
                  </td>
                  <td data-label="Start Date">
                    {{ formatDate(campaign.startDate) }}
                  </td>
                  <td data-label="Status">
                    <span :style="getStatusColor(campaign.campaignStatus)">
                      {{ campaign.campaignStatus }}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <span class="nav-images">
                      <img
                        class="pe-3"
                        src="../assets/view-img.png"
                        alt="View Campaign"
                        @click="showCampaignDetails(campaign.id)"
                      />
                      <img
                        class="pe-3"
                        src="../assets/edit-img.png"
                        alt="Edit Campaign"
                        @click="startEditing(campaign.id)"
                      />
                      <img
                        src="../assets/delete-icon.png"
                        alt="Delete Campaign"
                        @click="showDeleteModal(campaign.id)"
                        class="delete-icon"
                      />
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls -->
          <div class="pagination-controls ms-5  animate__animated animate__pulse animate__slow ">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="btn mt-4"
            >
              <i class="bi bi-chevron-left"></i>
            </button>

            <span
              v-for="page in displayedPages"
              :key="page"
              :class="{ active: page === currentPage }"
              @click="setPage(page)"
              class="pagination-btn mt-4"
            >
              {{ page }}
            </span>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="btn mt-4"
            >
              <i class="bi bi-chevron-right"></i>
            </button>

            <span class="page-indicator fw-bold mt-4">
              Page {{ currentPage }} out of {{ totalPages }}
            </span>
          </div>
        </div>
      </div>

      <!-- The DeleteModal component -->
      <DeleteModal
        :isVisible="isDeleteModalVisible"
        @close="closeDeleteModal"
        @confirm="handleConfirmStop"
      />

      <!-- New CampaignDeleted Modal -->
      <CampaignDeleted v-if="showDeletedModal" @goBack="handleGoBack" />

      <!-- Show CampaignDeleted modal if triggered -->
      <CampaignDeleted v-if="showDeleted" @goBack="goBackToList" />

      <!-- Campaign Details -->
      <CampaignDetails
        v-if="showDetails && !isEditing"
        :campaignId="selectedCampaignId"
        @goBack="goBackToList"
        @campaignDeleted="refreshCampaignListAfterDeletion"
      />

      <!-- Conditionally show EditCampaign component instead of campaign list -->
      <EditCampaign
        v-if="isEditing"
        :campaignId="selectedCampaignId"
        @goBack="stopEditing"
         @campaignStatusUpdated="handleCampaignUpdated"
        @campaignUpdated="refreshCampaignList"
      />

      <CampaignStatus @campaignUpdated="handleCampaignUpdated" />
    </div>

    <mySidebar />
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import myNav from "../components/Nav.vue";
import mySidebar from "../components/MySidebar.vue";
import CampaignDetails from "@/components/CampaignDetails.vue";
import DeleteModal from "../components/Deletemodal.vue";
import EditCampaign from "@/components/EditCampaign.vue";

const campaigns = ref([]);
const selectedCampaign = ref(null);
const selectedCampaignId = ref(null);
const currentPage = ref(1);
const itemsPerPage = 13;
const selectedFilter = ref("all");
const searchQuery = ref("");
const isLoading = ref(false);
const error = ref(null);
const showDetails = ref(false);
const isEditing = ref(false); // Controls whether to show EditCampaign
const isDeleteModalVisible = ref(false);
const selectedCampaignForDeletion = ref(null);
const showDeleted = ref(false);

// API base URL
const baseURL = "https://infinion-test-int-test.azurewebsites.net/api";

// Fetch all campaigns
const fetchCampaigns = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${baseURL}/Campaign`);
    campaigns.value = response.data;
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    error.value = "Failed to fetch campaigns. Please try again later.";
  } finally {
    isLoading.value = false;
  }
};

// Start editing: Pass campaign ID to EditCampaign component
const startEditing = (campaignId) => {
  console.log("Selected campaign ID for editing:", campaignId);
  selectedCampaignId.value = campaignId;
  isEditing.value = true; // Show the EditCampaign component
};

// Stop editing: Reset edit state
const stopEditing = () => {
  isEditing.value = false; // Hide the EditCampaign component
  selectedCampaignId.value = null;
};

const showDeleteModal = (campaignId) => {
  selectedCampaignForDeletion.value = campaignId;
  isDeleteModalVisible.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalVisible.value = false;
  selectedCampaignForDeletion.value = null;
};

// Function to show the deleted modal when a campaign is deleted
const showDeletedModal = () => {
  showDetails.value = false; // Ensure details are hidden
  showList.value = false;
  showDeleted.value = true;
};

const handleConfirmStop = async () => {
  if (!selectedCampaignForDeletion.value) return;
  try {
    await axios.delete(
      `${baseURL}/Campaign/${selectedCampaignForDeletion.value}`
    );
    campaigns.value = campaigns.value.filter(
      (campaign) => campaign.id !== selectedCampaignForDeletion.value
    );
    closeDeleteModal();
  } catch (err) {
    console.error("Error deleting campaign:", err);
    error.value = "Failed to delete campaign. Please try again later.";
  }
};

const showCampaignDetails = (id) => {
  console.log("Campaign ID:", id); // Debugging log
  selectedCampaignId.value = id;
  showDetails.value = true;
};

const hideCampaignDetails = () => {
  showDetails.value = false;
  selectedCampaignId.value = null;
};

const handleGoBack = () => {
  // Hide modal if necessary
  showDetails.value = false;
  selectedCampaignId.value = null;
};

// Function to handle returning to the list and refreshing campaigns
const goBackToList = async () => {
  showDetails.value = false;
  showDeleted.value = false; // Ensure modal is hidden
  selectedCampaignId.value = null;
  await fetchCampaigns(); // Re-fetch campaigns after going back
};

// Function to handle the deletion and refreshing the campaign list
const handleCampaignDeleted = async (deletedCampaignId) => {
  await refreshCampaignListAfterDeletion(deletedCampaignId);
};

// Refresh campaign list by removing deleted campaign and re-fetching campaigns
const refreshCampaignListAfterDeletion = async (deletedCampaignId) => {
  campaigns.value = campaigns.value.filter(
    (campaign) => campaign.id !== deletedCampaignId
  );
  await fetchCampaigns(); // Fetch updated campaign list
};

const handleCampaignUpdated = (campaignId) => {
  // Refetch campaigns or update the specific campaign in the list
  const updatedCampaign = campaigns.value.find(c => c.id === campaignId);
  if (updatedCampaign) {
    updatedCampaign.campaignStatus = localStorage.getItem(`campaignStatus_${campaignId}`);
  }
};


// Refresh campaign list by removing deleted campaign and re-fetching campaigns
const refreshCampaignList = async (updatedCampaignId) => {
  campaigns.value = campaigns.value.filter(
    (campaign) => campaign.id !== updatedCampaignId
  );
  await fetchCampaigns(); // Fetch updated campaign list
};

const filteredCampaigns = computed(() => {
  let filtered = campaigns.value;
  if (selectedFilter.value === "active") {
    filtered = filtered.filter(
      (campaign) => campaign.campaignStatus === "Active"
    );
  } else if (selectedFilter.value === "inactive") {
    filtered = filtered.filter(
      (campaign) => campaign.campaignStatus === "Inactive"
    );
  }
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (campaign) =>
        campaign.campaignName.toLowerCase().includes(search) ||
        campaign.campaignDescription.toLowerCase().includes(search)
    );
  }
  return filtered;
});

const paginatedCampaigns = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredCampaigns.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredCampaigns.value.length / itemsPerPage)
);

const displayedPages = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    if (
      i <= 3 ||
      i > totalPages.value - 3 ||
      Math.abs(i - currentPage.value) <= 1
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return pages;
});

const totalCampaigns = computed(() => campaigns.value.length);
const activeCampaignsCount = computed(
  () =>
    campaigns.value.filter((campaign) => campaign.campaignStatus === "Active")
      .length
);
const inactiveCampaignsCount = computed(
  () =>
    campaigns.value.filter((campaign) => campaign.campaignStatus === "Inactive")
      .length
);

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const setPage = (page) => {
  if (typeof page === "number" && page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const getStatusColor = (status) => {
  return status === "Active" ? { color: "#009918" } : { color: "#990000" };
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const applyFilter = () => {
  currentPage.value = 1;
};

onMounted(fetchCampaigns);
</script>



<style scoped >

.campaign-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 45vh;
  padding-left: 20%; /* Adjust for sidebar */
  transition: width 0.3s ease-in-out;
}

/* for the search area for the search input field  */
.search-area {
  margin-left: 30%;
}

.search-input {
  padding-right: 35px; /* Add space for the icon */
}

.search-icon {
  position: absolute;
  right: 220px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none; /* Make the icon non-clickable */
}

.input-group-text {
  z-index: 999;
  color: #000;
}

.campaign-btn {
  border-radius: 8px; /* Soft corners */
  border: 2px solid #247b7b; /* Border color */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Light box shadow */
  background-color: white; /* Optional: White background */
  color: #247b7b; /* Text color */
  margin-right: 10px; /* Space between buttons */
}

.campaign-btn:hover {
  background-color: #247b7b; /* Hover background color */
  color: white; /* Hover text color */
}

.table-container {
  width: 70%; /* Limit the table to 70% of the space */
  margin-top: 20%;
  /* margin-left: 20%; */
}

.search-input:focus,
.form-select:focus {
  box-shadow: 0 0 5px 6px #247b7b !important; /* Border color */
  color: #247b7b;
}

.preloader {
  position: fixed; /* Make it fixed to cover the viewport */
  top: 0;
  left: 0;
  width: 100%; /* Cover the entire width */
  height: 100%; /* Cover the entire height */
  background-color: rgba(
    255,
    255,
    255,
    0.8
  ); /* Slightly transparent background */
  z-index: 9999; /* High z-index to sit above all other content */
  display: flex; /* Use flexbox to center the loader */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

.bouncing-loader {
  display: flex; /* Flexbox for bouncing effect */
  justify-content: center; /* Center the loader */
  align-items: center; /* Center the loader */
}

.bouncing-loader div {
  width: 15px; /* Width of the loader dots */
  height: 15px; /* Height of the loader dots */
  margin: 5px; /* Spacing between dots */
  border-radius: 50%; /* Make them round */
  background: #1e5b5b; /* Color of the loader dots */
  animation: bouncing 0.6s infinite alternate; /* Bouncing animation */
}

/* Bouncing animation */
@keyframes bouncing {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-15px);
  }
}

.nav-images > img {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.nav-images > img:hover {
    transform: scale(1.3);
    border-radius: 4px;
  }

.pagination-controls {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination-btn {
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-btn:hover {
  background-color: #f0f0f0; /* Change background on hover */
}

.pagination-btn.active {
  background-color: #247b7b; /* Active button color */
  color: white; /* Active text color */
  border-color: #247b7b; /* Border color of active button */
}

.page-indicator {
  margin-left: 20px; /* Space from pagination buttons */
  color: #333; /* Color of the page indicator text */
}

.table {
  width: 90%;
  margin-top: 20px;
}

.custom-table {
  width: 100%;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-btn {
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-btn.active {
  background-color: #247b7b;
  color: white;
  border-color: #247b7b;
}

.page-indicator {
  margin-left: 20px;
  color: #333;
}


@media (min-width: 1008px) and (max-width: 1124px) {
  .data-table {
    margin-left: 7%;
    /* overflow: auto; */
  }

  .search-area {
    margin-left: 2%;
  }
}

/* Media query for mobile devices */
@media (max-width: 780px) {
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .campaign-btn {
    width: 100%;
    margin-bottom: 10px;
  }

  .search-area {
    padding-left: 0;
    padding-right: 0;
  }

  .input-group {
    flex-direction: column;
  }

  .search-input,
  .form-select {
    width: auto !important;
    margin-left: 0 !important;
  }

  .search-icon {
    top: 20px;
    right: 10px;
  }

  /* Ensure placeholder text is visible */
  .search-input::placeholder {
    color: #6c757d;
    opacity: 1;
  }

  /* Styles for WebKit browsers */
  .search-input::-webkit-input-placeholder {
    color: #6c757d;
    opacity: 1;
  }

  /* Styles for Firefox */
  .search-input::-moz-placeholder {
    color: #6c757d;
    opacity: 1;
  }
}

/* Responsive table styles */
@media screen and (max-width: 768px) {
  .table-responsive {
    border: 0;
  }

  .table {
    border: 0;
  }

  .table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  .table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: 0.625em;
  }

  .table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: 0.8em;
    text-align: right;
    padding-left: 50%;
    position: relative;
  }

  .table td::before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
    position: absolute;
    left: 6px;
  }

  .table td:last-child {
    border-bottom: 0;
  }

  .nav-images {
    display: flex;
    justify-content: flex-end;
  }

  .nav-images img {
    margin-left: 10px;
  }
}

/* Additional responsive styles */
@media (max-width: 768px) {
  .campaign-content {
    padding-left: 5%; /* Adjust padding for smaller screens */
    padding-right: 5%;
    width: 100%;
  }

  .search-area {
    margin-left: 0; /* Reset margin for smaller screens */
  }

  .search-icon {
    right: 10px; /* Adjust position for smaller screens */
  }

  .action-bar {
    flex-direction: column;
  }

  .campaign-btn {
    width: 100%;
    margin-bottom: 10px;
  }

  .input-group {
    flex-direction: column;
  }

  .form-select {
    margin-left: 0 !important;
    margin-top: 10px;
  }
}

@media (max-width: 576px) {
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }

  .pagination-btn {
    margin: 5px;
  }

  .page-indicator {
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }
}

/* Table hover effect */
.table tbody tr:hover {
  background-color: #247b7b93 !important;
  transition: background-color 0.3s ease;
}
</style>