<template>
  <div class="bg-gray-100 min-h-screen flex justify-center items-center p-6 sm:p-8 relative">
    <button @click="goBack"
      class="absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all">
      Back to Notes</button>
    <div v-if="note" class="bg-gray-300 p-12 rounded-2xl shadow-lg w-full max-w-4xl border border-gray-200">
      <!-- Inline Editing for Title -->
      <h2 @click="isTitleEditable = true"
        class="text-4xl font-bold text-gray-800 cursor-pointer mb-6 transition-transform transform hover:-translate-y-1 break-words p-3 bg-gray-200 rounded-lg">
        <template v-if="isTitleEditable">
          <input v-model="editedTitle" @blur="saveTitle" @keydown.enter="saveTitle" autofocus
            class="w-full p-4 border border-gray-300 rounded-lg text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition break-words" />
        </template>
        <template v-else>
          {{ note.title }}
        </template>
      </h2>

      <!-- Inline Editing for Body -->
      <p @click="isBodyEditable = true"
        class="text-xl text-gray-700 cursor-pointer leading-relaxed transition-transform transform hover:-translate-y-1 break-words bg-gray-200 rounded-lg p-3">
        <template v-if="isBodyEditable">
          <textarea v-model="editedBody" @blur="saveBody" @keydown.enter="saveBody" @input="resizeTextarea" autofocus
            class="w-full p-4 border border-gray-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition break-words min-h-screen"></textarea>
        </template>
        <template v-else>
          {{ note.body }}
        </template>
      </p>
    </div>
    <p v-else class="text-center text-gray-500 text-lg py-6">⚠ Note not found.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNoteStore } from '@/stores/NoteStore';

const store = useNoteStore();
const route = useRoute();
const router = useRouter();
const note = ref(null);
const editedTitle = ref('');
const editedBody = ref('');
const isTitleEditable = ref(false);
const isBodyEditable = ref(false);

onMounted(async () => {
  const noteId = Number(route.params.id);
  if (!isNaN(noteId)) {
    note.value = await store.fetchNoteById(noteId);
    editedTitle.value = note.value.title;
    editedBody.value = note.value.body;
  } else {
    console.error("Invalid note ID");
  }
});

const saveTitle = async () => {
  isTitleEditable.value = false;
  if (editedTitle.value !== note.value.title) {
    const updatedNote = await store.updateNote(note.value.id, editedTitle.value, note.value.body);
    if (updatedNote) {
      note.value = updatedNote;
    }
  }
};

const saveBody = async () => {
  isBodyEditable.value = false;
  if (editedBody.value !== note.value.body) {
    const updatedNote = await store.updateNote(note.value.id, note.value.title, editedBody.value);
    if (updatedNote) {
      note.value = updatedNote;
    }
  }
};

const resizeTextarea = (event) => {
  const textarea = event.target;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
};

const goBack = () => {
  router.push('/notes');
};
</script>