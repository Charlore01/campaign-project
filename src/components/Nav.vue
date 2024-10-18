<template>
  <div class="nav-container d-flex animate__animated animate__pulse animate__slow">
    <div class="search-area">
      <div class="input-group">
        <input
          type="text"
          class="form-control rounded-2"
          placeholder="Search for anything..."
          aria-label="Search"
        />
        <span class="input-group-text bg-white border-0">
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
      </div>
    </div>

    <div class="profile">
      <img
        class="notification"
        src="../assets/notification-bell.png"
        alt="Notification"
      />
      <img src="../assets/profile-icon.png" alt="Profile" />
      <span class="profile-name">
        BigTech
        <select name="" id="">
          <option value=""></option>
          <option value=""></option>
          <option value=""></option>
        </select>
      </span>
    </div>
  </div>
</template>


<script>
export default {};
</script>

<style scoped>
.nav-container {
  padding-top: 1%;
  justify-content: space-around;
  border-bottom: 1px solid #F3F3F3;
}

/* Custom styles for the search area if needed */
.search-area {
  width: 100%;
  max-width: 400px; /* Adjust this based on your layout */
}

.search-area > .input-group {
  position: relative;
}

.form-control:focus {
  box-shadow: 0 0 5px 4px #1e5b5b !important;
  border: 1px solid #1e5b5b !important;
  outline: none;
}


.input-group-text {
  cursor: pointer;
  position: absolute;
  top: 5%;
  left: 88%;
  z-index: 9999;
}

.profile > .profile-name {
  font-size: 14px;
}

.profile > .profile-name > select {
  border: none;
  color: #1e5b5b;
}

@media (min-width: 999px) {
  .search-area {
    margin-left: 20%;
  }
}

</style>