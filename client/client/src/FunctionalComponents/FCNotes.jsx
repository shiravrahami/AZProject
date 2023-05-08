import React, { useState } from 'react';
import { FaArrowLeft, FaPlus, FaEdit } from 'react-icons/fa';

export default function FCNotes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  }

  const addNote = () => {
    if (newNote !== "") {
      setNotes(notes.concat(newNote));
      setNewNote("");
    }
  }

  const editNote = (index, newNote) => {
    let updatedNotes = [...notes];
    updatedNotes[index] = newNote;
    setNotes(updatedNotes);
  }

  const deleteNote = (index) => {
    let updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
  }

  return (
    <div>
      <div className="header">
        <FaArrowLeft className="icon" />
        <h1>פתקים</h1>
      </div>
      <ul>
        {notes.map((note, index) =>
          <li key={index}>
            {note}
            <button className="delete-button" onClick={() => deleteNote(index)}>מחק</button>
            <button className="edit-button" onClick={() => editNote(index, prompt("הכנס פתק חדש", note))}>ערוך</button>
          </li>
        )}
      </ul>
      <div className="footer">
        <input className="note-input" type="text" value={newNote} onChange={handleNoteChange} />
        <button className="add-button" onClick={addNote}><FaPlus /></button>
        <button className="edit-button"><FaEdit /></button>
      </div>
    </div>
  );
}

