export class Note {
    id: number;
    title: string;
    authorId: number;
    body?: string;

    constructor(id: number, title: string, authorId: number, body?: string) {
        this.id = id;
        this.title = title;
        this.authorId = authorId;
        this.body = body;
    }
}