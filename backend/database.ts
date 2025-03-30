import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export async function createUser(name: string, lastName: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name: name,
            lastName: lastName,
            email: email,
            password: hashedPassword, 
        },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, { expiresIn: '1h' });

    return { user, token };
}

export async function loginUser(email: string, password: string) {
      const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
        { userId: user.id }, 
        JWT_SECRET as string, 
        { expiresIn: '1h' } 
    );

    return { user, token };
}

export async function createNote(id: number, title: string, body: string) {
    try {
        const note = await prisma.notes.create({
            data: {
                title,
                body,
                authorId: id,
                createdAt: new Date(),
            },
        });
        return note;
    } catch (error) {
        throw new Error("Error creating note");
    }
}

export async function getAllNotesFromUser(userId: number) {
    try {
        const notes = await prisma.notes.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: 'desc' },
        });
        return notes;
    } catch (error) {
        throw new Error("Error retrieving notes");
    }
}

// export async function getAllNotes() {
//     if (!id) {
//         throw new Error("User not authenticated");
//     }

//     try {
//         const notes = await prisma.notes.findMany();
//         return notes;
//     } catch (error) {
//         throw new Error("Error retrieving notes");
//     }
// }

export async function editNote(noteId: number, userId: number, title?: string, body?: string) {
    try {
        const note = await prisma.notes.findUnique({
            where: { id: noteId },
        });

        if (!note) {
            throw new Error("Note not found");
        }

        if (note.authorId !== userId) {
            throw new Error("Unauthorized to edit this note");
        }

        const updatedNote = await prisma.notes.update({
            where: { id: noteId },
            data: {
                title: title || note.title,
                body: body || note.body,
            },
        });

        return updatedNote;
    } catch (error) {
        throw new Error("Error updating note");
    }
}

export async function getUserById(userId: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true }, // Don't send password
        });

        return user;
    } catch (error) {
        throw new Error("Error fetching user data");
    }
}

export async function getNoteById(noteId: number, userId: number) {
    return await prisma.notes.findFirst({
        where: {
            id: noteId,
            authorId: userId,
        },
    });
}