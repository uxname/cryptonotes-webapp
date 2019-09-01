import React, {useState} from 'react';

export default function (props) {
    const [noteKey, setNoteKey] = useState(null);
    const [notePassword, setNotePassword] = useState(null);

    async function createNote() {
        return await props.updateNote(noteKey, notePassword, '');
    }

    async function openNote() {
        return await props.openNote(noteKey, notePassword);
    }

    return (
        <>
            <input type="text" id='input-note-key' placeholder="Note key..."
                   onChange={e => setNoteKey(e.target.value)}/>
            <br/>
            <input type="text" id='input-password' placeholder="Password..."
                   onChange={e => setNotePassword(e.target.value)}/>
            <br/>
            <button id="btn-create" onClick={createNote}>Create new</button>
            <button id="btn-open" onClick={openNote}>Open</button>
        </>
    )
};
