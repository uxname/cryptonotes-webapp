import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import cuid from 'cuid';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

export default function (props) {
    let search = window.location.search;
    let params = new URLSearchParams(search);

    let noteKeyFromUrl = params.get('k');
    let notePasswordFromUrl = params.get('p');

    const [noteKey, setNoteKey] = useState(noteKeyFromUrl || cuid());
    const [notePassword, setNotePassword] = useState(notePasswordFromUrl || '');
    const [ttl, setTtl] = useState(-1);
    const [maxOpeningCount, setMaxOpeningCount] = useState(-1);

    async function createNote() {
        if (window.confirm('If note already exists - it will cleared, are you sure?')) {
            if (parseInt(maxOpeningCount.toString()) === 0) {
                return alert('Wrong value: zero');
            }

            if (!noteKey || !notePassword) {
                return alert('Enter key or password');
            }

            await props.updateNote(noteKey, notePassword, '', ttl, parseInt(maxOpeningCount.toString()) > -1 ? parseInt(maxOpeningCount.toString()) + 1 : -1); // +1 for first open by code below
            await props.openNote(noteKey, notePassword);
        }
    }

    async function openNote() {
        if (!noteKey || !notePassword) {
            return alert('Enter key or password');
        }

        return await props.openNote(noteKey, notePassword);
    }

    return (
        <>
            <img
                style={{
                    margin: 30,
                    width: 300
                }}
                src={process.env.PUBLIC_URL + '/assets/logo.svg'} alt="logo"/>
            <br/>
            <div>
                <TextField
                    value={noteKey}
                    variant="standard"
                    margin="normal" type="text" id='input-note-key' label="Note key..."
                    onChange={e => setNoteKey(e.target.value)}/>
                <IconButton aria-label="generateKey" onClick={() => {
                    setNoteKey(cuid());
                    setNotePassword('');
                    window.history.replaceState({}, null, process.env.REACT_APP_WEBAPP_URL);
                }}>
                    <RefreshIcon/>
                </IconButton>
            </div>
            <br/>
            <TextField
                variant="standard"
                value={notePassword}
                margin="normal" label='Password' type="password" id='input-password'
                onChange={e => setNotePassword(e.target.value)}/>
            <br/>
            <br/>
            <InputLabel htmlFor="note-ttl">Delete after</InputLabel>
            <Select
                value={ttl}
                onChange={(val) => setTtl(val.target.value)}
                inputProps={{
                    name: 'ttl',
                    id: 'note-ttl',
                }}>
                <MenuItem value={-1}>Don't delete</MenuItem>
                <MenuItem value={60}>1 minute</MenuItem>
                <MenuItem value={60 * 5}>5 minutes</MenuItem>
                <MenuItem value={60 * 10}>10 minutes</MenuItem>
                <MenuItem value={60 * 30}>30 minutes</MenuItem>
                <MenuItem value={60 * 60}>1 hour</MenuItem>
                <MenuItem value={60 * 60 * 3}>3 hours</MenuItem>
                <MenuItem value={60 * 60 * 6}>6 hours</MenuItem>
                <MenuItem value={60 * 60 * 12}>12 hours</MenuItem>
                <MenuItem value={60 * 60 * 24}>1 day</MenuItem>
                <MenuItem value={60 * 60 * 24 * 3}>3 days</MenuItem>
                <MenuItem value={60 * 60 * 24 * 7}>7 days</MenuItem>
                <MenuItem value={60 * 60 * 24 * 14}>14 days</MenuItem>
                <MenuItem value={60 * 60 * 24 * 30}>30 days</MenuItem>
                <MenuItem value={60 * 60 * 24 * 30 * 3}>3 months</MenuItem>
                <MenuItem value={60 * 60 * 24 * 30 * 6}>6 months</MenuItem>
                <MenuItem value={60 * 60 * 24 * 30 * 12}>1 year</MenuItem>
                <MenuItem value={60 * 60 * 24 * 30 * 12 * 3}>3 years</MenuItem>
                <MenuItem value={60 * 60 * 24 * 30 * 12 * 5}>5 years</MenuItem>
            </Select>
            <br/>
            <TextField
                variant="standard"
                inputProps={{
                    min: -1
                }}
                value={maxOpeningCount}
                margin="normal" label='Max openings count' type="number" id='input-max-openings-count'
                onChange={e => setMaxOpeningCount(e.target.value)}/>
            <br/>
            <Button style={{
                margin: 10
            }} variant="contained" color="primary" id="btn-open" onClick={openNote}>Open</Button>
            <Button variant="contained" color="secondary" id="btn-create" onClick={createNote}>Create new</Button>
        </>
    )
};
