import { defineStore } from 'pinia'
import { Note } from "@/Classes/Note";
import axios from "axios";

export const useNoteStore = defineStore("notes", {
    state: () => ({
        notes: [] as Note[],
    }),

    actions: {
        async fetchNotes() {
            try {
                const { data } = await axios.get('/api/allnotes');
                console.log(data);
                this.notes = data;
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async fetchNotesFromUser() {
            try {
                const { data } = await axios.post('/api/notess');
                this.notes = data;
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async fetchNoteById(noteId: number) {
            try {
                const { data } = await axios.get(`/api/notes/${noteId}`);
                return data;
            } catch (error) {
                console.error("Error fetching note:", error);
                return null;
            }
        },
        async createNote(note: Note) {
            try {
                const { data } = await axios.post('/api/notes', note, {
                    withCredentials: true
                });
                this.notes.push(data);
            } catch (error) {
                console.error("Error creating note:", error);
            }
        },
        async updateNote(noteId: number, title: string, body: string) {
            try {
                const response = await axios.put(`/api/notes/${noteId}`, { title, body }, {
                    withCredentials: true
                });
                const updatedNote = response.data;

                // Find the note in the state and update it
                const noteIndex = this.notes.findIndex(note => note.id === noteId);
                if (noteIndex !== -1) {
                    this.notes[noteIndex] = updatedNote;
                }

                return updatedNote;
            } catch (error) {
                console.error("Error updating note:", error);
                return null;
            }
        },
    }
})