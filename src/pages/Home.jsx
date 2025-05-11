// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import NoteCard from '../components/NoteCard';

const Home = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [notes, setNotes] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) return;
        await addDoc(collection(db, 'notes'), { title, content });
        setTitle('');
        setContent('');
    };

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'notes'), (snapshot) => {
            const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotes(notesData);
        });
        return () => unsub();
    }, []);

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">📝 Firebase Notes</h1>

            <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                <input
                    className="w-full p-2 border rounded"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="w-full p-2 border rounded"
                    placeholder="Content"
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add Note
                </button>
            </form>

            <div className="grid gap-4">
                {notes.map(note => <NoteCard key={note.id} note={note} />)}
            </div>
        </div>
    );
};

export default Home;