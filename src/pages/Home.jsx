import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import NoteCard from '../components/NoteCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [notes, setNotes] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title.trim().length < 3 || content.trim().length < 5) {
            toast.error("Title must be ≥ 3 chars and content ≥ 5 chars.");
            return;
        }
        try {
            await addDoc(collection(db, 'notes'), {
                title: title.trim(),
                content: content.trim(),
                createdAt: serverTimestamp(),
            });
            setTitle('');
            setContent('');
            toast.success("📝 Note added!");
        } catch (error) {
            toast.error("❌ Failed to add note.",error);
        }
    };

    useEffect(() => {
        const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snapshot) => {
            const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotes(notesData);
        });
        return () => unsub();
    }, []);

    return (
        <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-indigo-600 via-pink-500 to-red-500 bg-[length:400%_400%] animate-gradient text-white transition-all duration-500">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-black mb-8 text-center drop-shadow-md">📝 Firebase Notes</h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white/90 text-black p-6 rounded-2xl shadow-2xl space-y-4 backdrop-blur-lg"
                >
                    <div>
                        <input
                            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 text-lg font-medium"
                            placeholder="Enter your note title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <textarea
                            className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-pink-300 text-base"
                            placeholder="Write something amazing..."
                            rows={6}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl"
                    >
                        ➕ Add Note
                    </button>
                </form>

                <div className="mt-12 grid gap-6">
                    {notes.length > 0 ? (
                        notes.map(note => <NoteCard key={note.id} note={note} />)
                    ) : (
                        <p className="text-center text-lg mt-8 text-white/90 animate-pulse">No notes yet. Start your first one now!</p>
                    )}
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={2000} theme="colored" />
        </div>
    );
};

export default Home;