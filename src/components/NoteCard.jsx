import React, { useState, useCallback } from 'react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { toast } from 'react-toastify';

const NoteCard = ({ note }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(note.title);
    const [editContent, setEditContent] = useState(note.content);

    // Delete note handler
    const handleDelete = useCallback(async () => {
        try {
            await deleteDoc(doc(db, 'notes', note.id));
            toast.success('🗑️ Note deleted successfully!');
        } catch (error) {
            console.error("Error deleting note:", error);
            toast.error('Failed to delete note');
        }
    }, [note.id]);

    // Update note handler
    const handleUpdate = useCallback(async () => {
        // Trim and validate input
        const trimmedTitle = editTitle.trim();
        const trimmedContent = editContent.trim();

        if (trimmedTitle.length < 1) {
            toast.error("Title must be at least 1 characters long.");
            return;
        }

        if (trimmedContent.length < 1) {
            toast.error("Note content must be at least 1 characters long.");
            return;
        }

        try {
            await updateDoc(doc(db, 'notes', note.id), {
                title: trimmedTitle,
                content: trimmedContent
            });
            setIsEditing(false);
            toast.success('✏️ Note updated successfully!');
        } catch (error) {
            console.error("Error updating note:", error);
            toast.error('Failed to update note');
        }
    }, [note.id, editTitle, editContent]);

    // Format date with fallback
    const formattedDate = note.createdAt ? 
        note.createdAt.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 
        'Unknown Date';

    return (
        <div className="relative group perspective-500">
            <div className="border rounded-lg p-5 shadow-lg bg-white/90 hover:scale-[1.03] transform transition-all duration-300 relative overflow-hidden backdrop-blur-sm">
                {isEditing ? (
                    <>
                        <input 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full text-xl font-semibold text-teal-800 border-b border-teal-300 mb-2 focus:outline-none"
                            maxLength={100}
                        />
                        <textarea 
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full text-gray-700 border border-teal-300 rounded p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                            rows={4}
                            maxLength={500}
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                            <button 
                                onClick={handleUpdate}
                                className="text-teal-500 hover:bg-teal-100 p-2 rounded-full transition"
                                title="Save"
                            >
                                ✓
                            </button>
                            <button 
                                onClick={() => {
                                    setEditTitle(note.title);
                                    setEditContent(note.content);
                                    setIsEditing(false);
                                }}
                                className="text-red-500 hover:bg-red-100 p-2 rounded-full transition"
                                title="Cancel"
                            >
                                ✕
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="text-xl font-semibold text-teal-800 mb-2">{note.title}</h3>
                        <p className="text-gray-700 mb-4">{note.content}</p>
                        
                        {/* Floating action buttons */}
                        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="text-teal-500 hover:bg-teal-50 p-2 rounded-full transition"
                                title="Edit Note"
                            >
                                ✏️
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                                title="Delete Note"
                            >
                                🗑️
                            </button>
                        </div>
                    </>
                )}
                
                {/* Timestamp */}
                <p className="text-xs text-gray-500 mt-2 text-right opacity-70">
                    {formattedDate}
                </p>
            </div>
        </div>
    );
};

export default NoteCard;