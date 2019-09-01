import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export default function (props) {
    const [noteKey, setNoteKey] = useState(null);
    const [notePassword, setNotePassword] = useState(null);

    async function createNote() {
        if (window.confirm('If note already exists - it will cleared, are you sure?')) {
            await props.updateNote(noteKey, notePassword, '');
            await props.openNote(noteKey, notePassword);
        }
    }

    async function openNote() {
        return await props.openNote(noteKey, notePassword);
    }

    return (
        <>
            <img
                style={{
                    margin: 30,
                    width: 300
                }}
                src={process.env.PUBLIC_URL + '/assets/logo.svg'}/>
            <br/>
            <TextField
                variant="standard"
                margin="normal" type="text" id='input-note-key' label="Note key..."
                onChange={e => setNoteKey(e.target.value)}/>
            <br/>
            <TextField
                variant="standard"
                margin="normal" label='Password' type="password" id='input-password'
                onChange={e => setNotePassword(e.target.value)}/>
            <br/>
            <Button style={{
                margin: 10
            }} variant="contained" color="primary" id="btn-open" onClick={openNote}>Open</Button>
            <br/>
            <Button variant="contained" color="secondary" id="btn-create" onClick={createNote}>Create new</Button>
        </>
    )
};
