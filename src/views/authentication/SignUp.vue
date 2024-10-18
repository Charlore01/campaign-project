<template>
  <div class="container p-5 rounded-4 text-white mt-5 animate__animated animate__bounceInLeft">
    <div class="row justify-content-center">
      <div class="col-lg-6 col-md-8 col-sm-12">
        <h2 class="text-center">Sign Up</h2>

        <!-- Error or Success Messages -->
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success" role="alert">
          {{ successMessage }}
        </div>

        <form @submit.prevent="handleSignup">
          <div class="mb-3 position-relative">
            <label for="newUsername" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              id="newUsername"
              v-model="newUsername"
              required
            />
          </div>

          <div class="mb-3 position-relative">
            <label for="newPassword" class="form-label">Password</label>
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              id="newPassword"
              v-model="newPassword"
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

          <div class="mb-3 position-relative">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-control"
              id="confirmPassword"
              v-model="confirmPassword"
              required
            />
            <i
              class="bi text-dark"
              :class="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"
              @click="toggleConfirmPasswordVisibility"
              role="button"
              style="position: absolute; right: 10px; top: 40px; cursor: pointer"
            ></i>
          </div>

          <button type="submit" class="btn btn-success w-100">Sign Up</button>
          <p class="mt-3 text-center">
            Already have an account?
            <router-link to="/login">Log in</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const newUsername = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const router = useRouter();

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const toggleConfirmPasswordVisibility = () => {
      showConfirmPassword.value = !showConfirmPassword.value;
    };

    const handleSignup = () => {
      // Reset messages
      errorMessage.value = "";
      successMessage.value = "";

      // Check if password is at least 6 characters
      if (newPassword.value.length < 6) {
        errorMessage.value = "Password must be at least 6 characters long!";
        return;
      }

      // Check if passwords match
      if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = "Passwords do not match!";
        return;
      }

      // Save the username and password in localStorage
      localStorage.setItem("username", newUsername.value);
      localStorage.setItem("password", newPassword.value);

      // Save signup state in localStorage (to indicate user has signed up)
      localStorage.setItem("userSignedUp", "true");

      // Success message
      successMessage.value = "Sign-up successful! Redirecting to login...";

      // Clear input fields after signup
      newUsername.value = "";
      newPassword.value = "";
      confirmPassword.value = "";

      // Automatically navigate to login page after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    };

    return {
      newUsername,
      newPassword,
      confirmPassword,
      errorMessage,
      successMessage,
      showPassword,
      showConfirmPassword,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
      handleSignup,
    };
  },
};
</script>


<style scoped>
.container {
  background-color: #1e5b5b;
}

.form-control:focus {
  border-color: #247b7b;
  box-shadow: 0 0 0 0.2rem rgba(36, 123, 123, 0.25);
}

form > button {
  background-color: #247b7b;
  color: #fff;
}

form > button:hover {
  background-color: #fff;
  border: 2px solid #247b7b;
  color: #1e5b5b;
}

@media (max-width: 576px) {
  .container {
    padding: 2rem;
    margin-top: 2rem;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 600px;
  }
}
</style>
