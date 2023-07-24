import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Paper, TextField, Button } from '@mui/material';
import { Box } from '@mui/material';
import axios from 'axios';
import '../Styles/Notes.css';
import { useUserContext } from './UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function FCNotes() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteForm, setNoteForm] = useState({});
  const { user, path } = useUserContext();

  useEffect(() => {
    axios.get(`${path}Notes`).then(res => {
      setNotes(res.data);
    });
  }, []);

  const onFormChange = (event) => {
    const { name, value } = event.target;
    const updatedForm = { ...noteForm };
    updatedForm[name] = value;
    setNoteForm(updatedForm);
  };

  const UpsertNote = (e) => {
    e.preventDefault();
    const { ID, EmployeePK, Title, Description } = noteForm;
    if (Title && Description) {
      const note = {
        "ID": ID ?? Math.floor(Math.random() * 100000),
        "EmployeePK": EmployeePK ?? Math.floor(Math.random() * 10),
        Title,
        Description
      };
      if (ID) {
        axios.put(`${path}Notes/${ID}`, { ...note }).then((res) => {
          const newNote = res.data;
          const updatedNotes = [...notes];
          const thisNote = updatedNotes.filter(note => note.ID === selectedNote)[0];
          thisNote.Title = newNote.Title;
          thisNote.Description = newNote.Description;
          setNotes(updatedNotes);
          toggleAddingNote();
        }).catch(e => {
          console.log(e);
        })
      } else {
        axios.post(`${path}Notes`, { ...note }).then((res) => {
          setNotes(prev => [...prev, res.data]);
          toggleAddingNote();
        }).catch(e => {
          console.log(e)
        })
      }
    }
  }

  const onEdit = () => {
    const note = notes.filter((note) => note.ID === selectedNote)[0];
    setNoteForm({ ...note });
    toggleAddingNote();
  };

  const handleNoteClick = (id) => {
    setSelectedNote(id)
  }

  const onDelete = () => {
    axios.delete(`${path}/Notes/${selectedNote}`).then(res => {
      let oldNotes = [...notes];
      oldNotes = oldNotes.filter((note) => note.ID !== selectedNote);
      setNotes(oldNotes);
      setSelectedNote(null);
    });
  }

  const toggleAddingNote = () => {
    if (isAddingNote) {
      setNoteForm({});
      setSelectedNote(undefined);
    }
    setIsAddingNote(!isAddingNote);
  }

  return (
    <div className='fullpade'>
      <div className="NotesTitle" style={{ alignItems: 'left', fontSize: '20px' }}>
        <h2>פתקים</h2>
      </div>
      <div>
        <div className='notes-wrapper'>
          {notes.map((note, idx) => (
            <div className={`note-wrapper${selectedNote === note.ID ? ' selected' : ''}`} onClick={() => handleNoteClick(note.ID)} >
              <h3>{note.Title}</h3>
              <p>{note.Description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='button'>
        <button type="button" className="edit-button" onClick={onEdit} disabled={!selectedNote}>
          <FaEdit />
        </button>
        <button type="button" className="add-button" onClick={toggleAddingNote}>
          <FaPlus />
        </button>
        <button type="button" className="trash-button" onClick={onDelete} disabled={!selectedNote}>
          <FaTrash />
        </button>
      </div>
      {isAddingNote && (
        <div className='popup-wrapper'>
          <div className='popup-backdrop' onClick={toggleAddingNote} />
          <div className='popup-overlay'>
            <form className='add-note-form' onSubmit={UpsertNote}>
              <TextField
                dir='rtl'
                label="כותרת"
                value={noteForm.Title}
                onChange={onFormChange}
                name={'Title'}
                placeholder="כותרת"
                className='field'
              />
              <TextField
                dir='rtl'
                label="תיאור"
                value={noteForm.Description}
                onChange={onFormChange}
                name={'Description'}
                placeholder="תיאור"
                multiline
                className='field'
              />
              <Button
                type='submit'
                onClick={UpsertNote}
              >{
                  noteForm.ID ? 'עדכן פתק' : 'הוסף פתק'
                }</Button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}