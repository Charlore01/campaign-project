<template>
    <div class="success-msg bg-white p-4 rounded-2 shadow animate__animated animate__bounceInRight animate__slow">
      <img src="../assets/success-img.png" alt="Success" class="img-fluid mb-3">
      <p class="pt-4">Campaign Successfully Edited!</p>
  
      <button  @click="goBack"  class="p-3 rounded-2 text-white mt-3">
          <span  @click="goBack">Go Back to Campaign List</span>
      </button>
    </div>
  </template>
  
  <script setup>
  const emit = defineEmits(['close', 'goBack']);
  
  const goBack = () => {
    emit('goBack'); // Emit the goBack event when the button is clicked
  };
  </script>
  
  <style scoped>
  .success-msg {
  position: fixed;
  top: 14%;
  left: 22%;
  transform: translate(70%, 40%);
  width: 30%;
  height: 50%;
  background-color: #fff;
  display: block;
  justify-content: center;
  align-items: center;
  z-index: 1100;
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
}

.success-msg > button:hover {
  background-color: #174949;
}

.success-msg > button > .router-link {
  text-decoration: none;
  color: #fff;
}

/* Bootstrap responsive classes */
@media (max-width: 576px) {
  .success-msg {
    width: 80%;
    height: 55%;
    transform: translate(2%, 18%);
  }
}

@media (min-width: 700px) and (max-width: 992px) {
  .success-msg {
    width: 50%;
    height: 60%;
    transform: translate(35%, 18%);
  }
}

@media (min-width: 993px) {
  .success-msg {
    width: 30%;
    height: 50%;
    transform: translate(95%, 40%);
  }
}
  </style>