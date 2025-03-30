import express, { Express, Request, Response } from 'express';
import { createUser, loginUser, createNote, getUserById, editNote, getNoteById, getAllNotesFromUser } from './database.ts';
import { authMiddleware, CustomRequest } from "./middleware/authMiddleware";
import cookieParser from "cookie-parser";
import cors from 'cors';

const app: Express = express();
app.use(express.json());
app.use(cookieParser());

app.post('/api/signup', async (req, res) => {
    const {name, lastName, email, password} = req.body;

    const user = await createUser(name, lastName, email, password);
    res.send(user)
})

app.post('/api/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const { user, token } = await loginUser(email, password);
        res.cookie("token", token,{
            httpOnly: true,
            secure: false,   
            maxAge: 3600000 
        });
        res.json({
            user,
            token,
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unexpected error occurred' });
        }
    }
})

app.post('/api/notes', authMiddleware, async (req: CustomRequest, res: Response): Promise<void> => {
    const { title, body } = req.body;
    const userId = req.user.userId; 

    if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
        return;
    }

    try {
        const note = await createNote(userId, title, body);
        res.status(201).json(note);
    } catch (error: any) {
        res.status(500).json({ message: "Error creating note", error: error.message });
    }
});

app.post('/api/notess', authMiddleware, async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user.userId; 

    if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
        return;
    }

    try {
        const notes = await getAllNotesFromUser(userId);
        res.json(notes);
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching notes", error: error.message });
    }
})

// app.get('/api/allnotes', async (req, res) => {
//     try {
//         const notes = await getAllNotes();
//         res.json(notes);
//     } catch (error: any) {
//         res.status(500).json({ message: "Error fetching notes", error: error.message });
//     }
// })

app.put('/api/notes/:id', authMiddleware, async (req: CustomRequest, res: Response): Promise<void> => {
    const noteId = parseInt(req.params.id, 10);
    const { title, body } = req.body;
    const userId = req.user.userId;

    if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
        return;
    }

    if (isNaN(noteId)) {
        res.status(400).json({ message: "Invalid note ID" });
        return;
    }

    try {
        const updatedNote = await editNote(noteId, userId, title, body);
        res.json(updatedNote);
    } catch (error: any) {
        res.status(500).json({ message: "Error updating note", error: error.message });
    }
});

app.get('/api/notes/:id', authMiddleware, async (req: CustomRequest, res: Response): Promise<void> => {
    const noteId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
        return;
    }

    if (isNaN(noteId)) {
        res.status(400).json({ message: "Invalid note ID" });
        return;
    }

    try {
        const note = await getNoteById(noteId, userId);
        if (!note) {
            res.status(404).json({ message: "Note not found" });
            return;
        }
        res.json(note);
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching note", error: error.message });
    }
});

app.get("/api/me", authMiddleware, async (req: any, res: any) => {
    try {
        const user = await getUserById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user data" });
    }
});

app.get('/api/logout', (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfull" });
});

app.use(
    cors({
        origin: 'http://127.0.0.1:3000',
        methods: ["GET", "POST", "PUT", "DELETE"], 
        credentials: true, // If you're using cookies or authentication headers
    })
);

const port: number = 8000;
app.listen(port, () => {
    console.log('Server has started...');
});
