<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 px-6">
    <div class="bg-gray-300 p-8 rounded-xl shadow-lg w-full max-w-sm text-center border border-gray-200">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Login</h1>
      <p class="text-gray-600 mb-6">Enter your credentials to access your notes.</p>

      <form @submit.prevent="validateForm" class="flex flex-col space-y-4">
        <div>
          <input type="text" v-model="email" placeholder="Email"
            class="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p v-if="emailError" class="text-red-600 text-sm mt-2">{{ emailError }}</p>
        </div>

        <div>
          <input type="password" v-model="password" placeholder="Password"
            class="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p v-if="passwordError" class="text-red-600 text-sm mt-2">{{ passwordError }}</p>
        </div>

        <button type="submit"
          class="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all">
          Login
        </button>
      </form>

      <p v-if="loginSuccess" class="text-green-600 font-semibold mt-4">Login successful!</p>
      <p v-if="loginSuccess === false" class="text-red-600 font-semibold mt-4">Incorrect email or password. Please try
        again.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from '@/stores/AuthStore';

const auth = useAuthStore();
const email = ref("");
const password = ref("");
const emailError = ref("");
const passwordError = ref("");
const loginSuccess = ref();

const validateForm = () => {
  emailError.value = "";
  passwordError.value = "";
  loginSuccess.value = false;

  const domainPattern = /.+\.[a-zA-Z]{2,}$/;
  if (!domainPattern.test(email.value)) {
    emailError.value = "The email format is incorrect. Please enter a valid email address (e.g., example@email.com).";
  }

  if (password.value.length < 8) {
    passwordError.value = "Password must be at least 8 characters long";
  }

  if (!emailError.value && !passwordError.value) {
    auth.login(email.value, password.value)
      .then((loginResult) => {
        loginSuccess.value = loginResult ? true : false;
      })
      .catch((error) => {
        console.error(error);
      });
  }
};
</script>