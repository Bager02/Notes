<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 px-4">
    <div class="bg-gray-300 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">Sign Up</h1>
      <p class="text-gray-600 mb-6">Create an account to start tracking your notes.</p>

      <form @submit.prevent="validateForm" class="space-y-4">
        <div>
          <input type="text" v-model="firstName" placeholder="First Name" required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <p v-if="firstNameError" class="text-red-600 text-sm mt-1">{{ firstNameError }}</p>
        </div>

        <div>
          <input type="text" v-model="lastName" placeholder="Last Name" required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <p v-if="lastNameError" class="text-red-600 text-sm mt-1">{{ lastNameError }}</p>
        </div>

        <div>
          <input type="email" v-model="email" placeholder="Email" required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <p v-if="emailError" class="text-red-600 text-sm mt-1">{{ emailError }}</p>
        </div>

        <div>
          <input type="password" v-model="password" placeholder="Password" required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <p v-if="passwordError" class="text-red-600 text-sm mt-1">{{ passwordError }}</p>
        </div>

        <div>
          <input type="password" v-model="confirmPassword" placeholder="Confirm Password" required
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <p v-if="confirmPasswordError" class="text-red-600 text-sm mt-1">{{ confirmPasswordError }}</p>
        </div>

        <button type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition">Sign Up</button>
      </form>

      <p v-if="signupSuccess" class="text-green-600 text-sm font-bold mt-4">Account created successfully!</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore"; // Import the AuthStore

// Define the form inputs and error messages
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const firstNameError = ref("");
const lastNameError = ref("");
const emailError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");
const signupSuccess = ref(false);

// Create an instance of the AuthStore
const authStore = useAuthStore();

const validateForm = async () => {
  // Reset errors and success message
  firstNameError.value = "";
  lastNameError.value = "";
  emailError.value = "";
  passwordError.value = "";
  confirmPasswordError.value = "";
  signupSuccess.value = false;

  // Form validation
  if (!firstName.value.trim()) {
    firstNameError.value = "First Name is required";
  }

  if (!lastName.value.trim()) {
    lastNameError.value = "Last Name is required";
  }

  const domainPattern = /.+\.[a-zA-Z]{2,}$/;
  if (!domainPattern.test(email.value)) {
    emailError.value = "Email must contain a valid domain (e.g., .com, .uk)";
  }

  if (password.value.length < 8) {
    passwordError.value = "Password must be at least 8 characters long";
  }

  if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = "Passwords do not match";
  }

  // If no validation errors, attempt to sign up
  if (
    !firstNameError.value &&
    !lastNameError.value &&
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value
  ) {
    try {
      // Call the signup action from the AuthStore
      const userData = await authStore.signup(firstName.value, lastName.value, email.value, password.value);
      signupSuccess.value = true; // Display success message
    } catch (error) {
      console.error("Signup failed:", error); // Handle signup error
    }
  }
};
</script>