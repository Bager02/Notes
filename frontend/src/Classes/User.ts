import type { Note } from "./Note";

export class User {
    id: number;
    name: string;
    lastName: string;
    email: string;
    password: string;
    notes: Note[];

    constructor(id: number, name: string, lastName: string, email: string, password: string, notes: Note[]) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.notes = notes;
    }
}