// src/components/NoteCard.jsx
import React from 'react';

const NoteCard = ({ note }) => {
    return (
        <div className="border rounded p-4 shadow-sm bg-white">
            <h3 className="text-lg font-bold">{note.title}</h3>
            <p className="text-gray-700 mt-2">{note.content}</p>
        </div>
    );
};

export default NoteCard;