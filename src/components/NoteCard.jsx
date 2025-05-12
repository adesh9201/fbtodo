import React from 'react';

const NoteCard = ({ note }) => {
    return (
        <div className="border rounded-lg p-4 shadow-lg bg-white hover:scale-105 transform transition-all duration-300">
            <h3 className="text-xl font-semibold text-blue-800">{note.title}</h3>
            <p className="text-gray-700 mt-2">{note.content}</p>
        </div>
    );
};

export default NoteCard;