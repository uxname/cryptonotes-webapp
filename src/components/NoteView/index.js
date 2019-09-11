import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import {TextField} from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default function (props) {

    const [showPasswordInUrl, setShowPasswordInUrl] = useState(false);

    async function saveNote() {
        await props.updateNote(props.currentNoteKey, props.currentNotePassword, props.currentNoteText);
        alert('Saved');
    }

    async function close() {
        props.close();
    }

    async function doDelete() {
        if (window.confirm('Are you sure?')) {
            props.doDelete(props.currentNoteKey, props.currentNotePassword);
        }
    }

    const urlString = process.env.REACT_APP_WEBAPP_URL
        + '?k='
        + props.currentNoteKey
        + (showPasswordInUrl ? '&p=' + props.currentNotePassword : "");

    return (
        <div style={{
            margin: 100
        }}>
            <a href={urlString}>
                {urlString}
            </a>

            <br/>
            <FormControlLabel
                control={
                    <Checkbox checked={showPasswordInUrl} value={showPasswordInUrl}
                              onChange={e => {
                                  if (e.target.checked) {
                                      if (!window.confirm('Are you sure to show password?')) return;
                                  }
                                  setShowPasswordInUrl(e.target.checked)
                              }}/>
                }
                label="Show password in URL"
            />


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
            <Button variant="contained" color="secondary" id="btn-create" onClick={saveNote}>Save</Button>
            <Button style={{
                margin: 10
            }} variant="contained" color="primary" id="btn-close" onClick={close}>Close</Button>
            <Button variant="contained" color="default" id="btn-delete" onClick={doDelete}>Delete</Button>
        </div>
    )
};
