<template>
  <div v-if="loading" class="preloader d-flex justify-content-center align-items-center">
    <div class="spinner-border text-white" role="status"></div>
    <span class="text-white ps-2">Loading...</span>
  </div>

  <div v-else class="container p-5 rounded-3 text-white mt-5 animate__animated animate__bounceInLeft">
    <div class="row justify-content-center">
      <div class="col-lg-6 col-md-8 col-sm-12">
        <h2 class="text-center">Login</h2>

        <!-- Show the warning if the user is not signed up -->
        <div v-if="!isUserSignedUp" class="alert alert-warning">
          You must sign up before logging in.
        </div>

        <!-- Show the error message if login fails -->
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <!-- Show the success message after successful login -->
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              id="username"
              v-model="username"
              required
            />
          </div>

          <div class="mb-3 position-relative">
            <label for="password" class="form-label">Password</label>
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              id="password"
              v-model="password"
              required
            />
            <i
              class="bi text-dark"
              :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
              @click="togglePasswordVisibility"
              role="button"
              style="position: absolute; right: 10px; top: 40px; cursor: pointer"
            ></i>
          </div>

          <!-- Disable login button if the user hasn't signed up -->
          <button
            type="submit"
            class="btn w-100"
            :disabled="!isUserSignedUp"
          >
            Login
          </button>

          <p class="mt-3 text-center">
            Don't have an account? 
            <router-link to="/signup">Sign up</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const username = ref("");
    const password = ref("");
    const showPassword = ref(false);  // Password visibility state
    const isUserSignedUp = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");
    const loading = ref(false);
    const router = useRouter();

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    // Check if the user has signed up (for example, from localStorage)
    onMounted(() => {
      const userSignedUpStatus = localStorage.getItem("userSignedUp");
      if (userSignedUpStatus === "true") {
        isUserSignedUp.value = true;
      } else {
        isUserSignedUp.value = false;
      }
    });

    const handleLogin = () => {
      const storedUsername = localStorage.getItem("username");
      const storedPassword = localStorage.getItem("password");

      if (username.value === storedUsername && password.value === storedPassword) {
        errorMessage.value = ""; // Clear any error message
        successMessage.value = "Login successful!"; // Show success message

        // Show the preloader after successful login
        loading.value = true;

        // Simulate loading and redirect to the dashboard after 3 seconds
        setTimeout(() => {
          loading.value = false;
          router.push("/home");
        }, 5000); // Simulate 5 seconds of loading
      } else {
        errorMessage.value = "Invalid username or password. Please try again.";
      }
    };

    return {
      username,
      password,
      showPassword,
      isUserSignedUp,
      errorMessage,
      successMessage,
      loading,
      togglePasswordVisibility,
      handleLogin,
    };
  },
};
</script>


<style scoped>
.preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #247b7b;
  z-index: 999;
}

.preloader .spinner-border {
  width: 3rem;
  height: 3rem;
}

.header > h1 {
  position: relative;
  top: 0;
  color: #fff;
  z-index: 9999;
}

.container {
  background-color: #1e5b5b;
}

.form-control:focus {
  border-color: #247b7b;
  box-shadow: 0 0 0 0.2rem rgba(36, 123, 123, 0.25);
}

.btn {
  background-color: #247b7b;
  color: #fff;
}

form > button:hover {
    background-color: #fff;
    border: 2px solid #247b7b;
    color: #1e5b5b;
}

.btn:disabled {
  background-color: #d6d6d6;
  cursor: not-allowed;
}

.alert {
  font-weight: bold;
  margin-bottom: 1rem;
}

@media (min-width: 992px) {
  .container {
    max-width: 600px;
  }
}
</style>
