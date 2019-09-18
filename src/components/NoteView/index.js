import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import {TextField} from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Utils from "../../helper/utils";
import Grid from '@material-ui/core/Grid';

export default function (props) {

    const [showPasswordInUrl, setShowPasswordInUrl] = useState(false);
    const [autoOpenInUrl, setAutoOpenInUrl] = useState(false);

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
        + (showPasswordInUrl ? '&p=' + Utils.base64encode(props.currentNotePassword) : "")
        + (autoOpenInUrl ? '&ao=true' : "");

    return (
        <div>
            <Grid container
                  spacing={1}
            >
                <Grid item md={12} sm={12} xs={12} style={{marginLeft: 10, marginRight: 10}}>
                    <TextField
                        label={`Note text`}
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows="15"
                        rowsMax="20"
                        fullWidth
                        id='input-note-text'
                        placeholder="Note text..."
                        onChange={e => props.setCurrentNoteText(e.target.value)}
                        value={props.currentNoteText || ''}/>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                    <a href={urlString}>
                        {urlString}
                    </a>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox checked={showPasswordInUrl} value={showPasswordInUrl}
                                      onChange={e => {
                                          if (e.target.checked) {
                                              if (!window.confirm('Are you sure to show password?')) return;
                                          }
                                          setShowPasswordInUrl(e.target.checked)
                                          if (!e.target.checked) {
                                              setAutoOpenInUrl(false);
                                          }
                                      }}/>
                        }
                        label="Show password in URL"
                    />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox disabled={!showPasswordInUrl} checked={autoOpenInUrl}
                                      value={autoOpenInUrl}
                                      onChange={e => {
                                          setAutoOpenInUrl(e.target.checked)
                                      }}/>
                        }
                        label="Auto open"
                    />
                </Grid>

                <Grid item md={4} sm={4} xs={4}>
                    <Button variant="contained" color="secondary" id="btn-create" onClick={saveNote}>Save</Button>
                </Grid>
                <Grid item md={4} sm={4} xs={4}>
                    <Button variant="contained" color="primary" id="btn-close" onClick={close}>Close</Button>
                </Grid>
                <Grid item md={4} sm={4} xs={4}>
                    <Button variant="contained" color="default" id="btn-delete" onClick={doDelete}>Delete</Button>
                </Grid>

            </Grid>
        </div>
    )
};
