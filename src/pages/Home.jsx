import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import NoteCard from '../components/NoteCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [notes, setNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch notes from Firestore
    useEffect(() => {
        const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snapshot) => {
            const notesData = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            setNotes(notesData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching notes:", error);
            toast.error("Failed to fetch notes");
            setIsLoading(false);
        });
        return () => unsub();
    }, []);

    // Handle note submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Trim and validate input
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (trimmedTitle.length < 1) {
            toast.error("Title must be at least 1 characters long.");
            return;
        }

        if (trimmedContent.length < 1) {
            toast.error("Note content must be at least 1 characters long.");
            return;
        }

        try {
            await addDoc(collection(db, 'notes'), {
                title: trimmedTitle,
                content: trimmedContent,
                createdAt: serverTimestamp(),
            });
            
            // Reset form
            setTitle('');
            setContent('');
            
            toast.success("📝 Note added successfully!");
        } catch (error) {
            console.error("Error adding note:", error);
            toast.error("❌ Failed to add note. Please try again.");
        }
    };

    // Filter notes
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Clear all notes with confirmation
    const handleClearAllNotes = useCallback(async () => {
        if (notes.length === 0) {
            toast.info("No notes to delete.");
            return;
        }

        const confirmDelete = window.confirm('Are you sure you want to delete ALL notes? This action cannot be undone.');
        
        if (confirmDelete) {
            try {
                const batch = notes.map(note => deleteDoc(doc(db, 'notes', note.id)));
                await Promise.all(batch);
                toast.success('🗑️ All notes deleted successfully!');
            } catch (error) {
                console.error("Error deleting notes:", error);
                toast.error('Failed to delete notes. Please try again.');
            }
        }
    }, [notes]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-8 text-center drop-shadow-lg flex items-center justify-center gap-3 text-white">
                    <span className="animate-pulse">📝</span>
                    Eco Notes
                </h1>
                
                {/* Note Input Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 text-white p-6 rounded-3xl shadow-2xl space-y-4 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl"
                >
                    <div>
                        <input
                            className="w-full p-4 bg-white/20 border border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 text-lg font-medium placeholder-white/60 transition-all duration-300 hover:bg-white/30"
                            placeholder="Enter your note title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={100}
                        />
                    </div>
                    
                    <div>
                        <textarea
                            className="w-full p-4 bg-white/20 border border-white/30 rounded-2xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-300 text-base placeholder-white/60 transition-all duration-300 hover:bg-white/30"
                            placeholder="Write something amazing..."
                            rows={6}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={500}
                        />
                        <p className="text-right text-xs text-white/70 mt-1">
                            {content.length}/500
                        </p>
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-3 rounded-xl transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform active:scale-95"
                    >
                        ➕ Add Note
                    </button>
                </form>

                {/* Search and Filter Section */}
                <div className="mt-6 flex space-x-4">
                    <div className="relative flex-grow">
                        <input 
                            type="text"
                            placeholder="🔍 Search notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-3 pl-10 bg-white/20 backdrop-blur-lg text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-white/60 transition-all duration-300 hover:bg-white/30"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-red-300 transition-colors"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    
                    {notes.length > 0 && (
                        <button 
                            onClick={handleClearAllNotes}
                            className="bg-red-500/80 text-white px-4 py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center space-x-2 transform active:scale-95"
                        >
                            🗑️ Clear All
                        </button>
                    )}
                </div>

                {/* Notes Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                    </div>
                ) : (
                    <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotes.length > 0 ? (
                            filteredNotes.map(note => <NoteCard key={note.id} note={note} />)
                        ) : (
                            <div className="col-span-full text-center">
                                <p className="text-lg mt-8 text-white/90 animate-pulse">
                                    {searchTerm 
                                        ? "No notes match your search" 
                                        : "No notes yet. Start your first one now!"
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;