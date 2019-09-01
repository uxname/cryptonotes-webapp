import React from 'react';
import Button from '@material-ui/core/Button';
import {TextField} from "@material-ui/core";

export default function (props) {

    async function saveNote() {
        await props.updateNote(props.currentNoteKey, props.currentNotePassword, props.currentNoteText);
        alert('Saved');
    }

    async function close() {
        props.close();
    }

    return (
        <div style={{
            margin: 100
        }}>
            <TextField
                label={`Note key: ${props.currentNoteKey}`}
                margin="normal"
                variant="outlined"
                multiline
                rows="12"
                rowsMax="20"
                fullWidth
                id='input-note-text'
                placeholder="Note text..."
                onChange={e => props.setCurrentNoteText(e.target.value)}
                value={props.currentNoteText || ''}/>
            <br/>
            <Button style={{
                margin: 10
            }} variant="contained" color="secondary" id="btn-create" onClick={saveNote}>Save</Button>
            <Button variant="contained" color="primary" id="btn-close" onClick={close}>Close</Button>
        </div>
    )
};
