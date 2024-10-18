<template>
  <div class="success-modal-container">
    <div class="success-msg bg-white p-5 rounded-2 shadow-lg animate__animated animate__slideInRight animate__slow">
      <img src="../assets/success-img.png" alt="Success" class="img-fluid mb-3">
      <p class="pt-4 font-weight-bold">Campaign Successfully Created</p>

      <button class="p-3 rounded-2 text-white mt-3">
        <router-link to="/campaign" class="d-flex align-items-center router-link">
          <span>Go Back to Campaign List</span>
        </router-link>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessModal'
};
</script>

<style scoped>
.success-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
}

.success-msg {
  max-width: 400px;
  width: 90%;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.success-msg > img {
  width: 70px;
  margin-bottom: 20px;
  background-color: #174949;
  height: 70px;
  border-radius: 50px;
}

.success-msg > button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #247b7b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.success-msg > button:hover {
  background-color: #174949;
}

.success-msg > button > .router-link {
  text-decoration: none;
  color: #fff;
}

@media (max-width: 576px) {
  .success-msg {
    max-width: 300px;
  }
}
</style>