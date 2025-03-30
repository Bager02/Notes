<template>
  <div class="container mx-auto p-6">
    <div class="bg-gray-100 p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Your Notes</h2>

      <!-- New Note Form -->
      <div class="mb-8">
        <input v-model="newNote.title" type="text" placeholder="Note Title"
          class="w-full p-4 mb-4 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
        <textarea v-model="newNote.body" placeholder="Note Body"
          class="w-full p-4 mb-4 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
        <button @click="createNote"
          class="p-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition">Create Note</button>
      </div>

      <div v-if="formattedNotes.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link v-for="note in formattedNotes" :key="note.id" :to="`/note/${note.id}`"
            class="bg-gray-300 rounded-lg p-6 border border-gray-400 transition-transform transform hover:-translate-y-1 hover:shadow-lg w-full h-64 flex flex-col">
            <p class="text-xl font-medium overflow-hidden text-gray-900 mb-2">{{ note.title }}</p>
            <p class="text-gray-700 flex-grow overflow-hidden break-words line-clamp-6">{{ note.body }}</p>
            <p class="text-gray-700 text-sm mt-2">{{ note.formattedDate }}</p>
          </router-link>
        </div>
      </div>

      <p v-else class="text-center text-gray-600 text-lg py-6">No notes found</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useNoteStore } from '@/stores/NoteStore';

const store = useNoteStore();

// Define a new note to bind to the form inputs
const newNote = ref({
  title: '',
  body: '',
});

const createNote = async () => {
  if (newNote.value.title && newNote.value.body) {
    await store.createNote(newNote.value);
    newNote.value.title = '';
    newNote.value.body = '';
  } else {
    alert('Title and body cannot be empty!');
  }
};

const formattedNotes = computed(() => {
  return store.notes.map(note => ({
    ...note,
    formattedDate: new Date(note.createdAt).toISOString().replace('T', ' ').split('.')[0]
  }));
});

onMounted(() => {
  store.fetchNotesFromUser();
});
</script>
