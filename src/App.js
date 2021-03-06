import React, {useState} from 'react';
import './App.css';
import Main from './components/Main'
import NoteView from './components/NoteView'
import client from "./helper/apolloClient";
import {gql} from "apollo-boost";
import Utils from "./helper/utils";
import AppBar from '@material-ui/core/AppBar';

const config = {
    SALT: "oSQjLyBrapncJNkxbAS4JJRtpmzTYTVjaJd3oRsS3aREffnz"
};

function App(props) {

    const [currentNoteKey, setCurrentNoteKey] = useState(null);
    const [currentNotePassword, setCurrentNotePassword] = useState(null);
    const [currentNoteText, setCurrentNoteText] = useState(null);
    const [isOpened, setIsOpened] = useState(false);

    async function updateNote(key, password, text, ttl = -1, maxOpeningCount = -1) {
        try {
            return await client.mutate({
                mutation: gql`
                    mutation UpdateNote($key: String, $password_hash: String!, $text: String!, $ttlInSeconds: Int, $maxOpeningsCount: Int) {
                        update_note(
                            key: $key,
                            password_hash: $password_hash,
                            text: $text,
                            ttlInSeconds:$ttlInSeconds,
                            maxOpeningsCount: $maxOpeningsCount
                        ) {
                            key
                            text
                        }
                    }
                `,
                variables: {
                    key: key,
                    password_hash: Utils.hash(password),
                    text: Utils.encryptString(text, password, config.SALT),
                    ttlInSeconds: parseInt(ttl.toString()),
                    maxOpeningsCount: parseInt(maxOpeningCount.toString())
                },
                fetchPolicy: "no-cache"
            });
        } catch (e) {
            alert(`Error: ${e.message}`);
        }
    }

    async function openNote(key, password) {
        try {
            const note = await client.query({
                query: gql`
                    query Note($key: String!, $password_hash: String!) {
                        note(key: $key, password_hash: $password_hash) {
                            key
                            text
                        }
                    }
                `,
                variables: {
                    key: key,
                    password_hash: Utils.hash(password)
                },
                fetchPolicy: "network-only"
            });
            setCurrentNoteKey(key);
            setCurrentNotePassword(password);
            setCurrentNoteText(Utils.decryptString(note.data.note.text, password, config.SALT));
            setIsOpened(true);
        } catch (e) {
            alert(`Error: ${e.message}`);
        }
    }

    async function doDelete(key, password) {
        try {
            await client.mutate({
                mutation: gql`
                    mutation DeleteNote($key: String, $password_hash: String!) {
                        delete_note(key: $key, password_hash: $password_hash)
                    }
                `,
                variables: {
                    key: key,
                    password_hash: Utils.hash(password)
                },
                fetchPolicy: "no-cache"
            });
            await close();
        } catch (e) {
            alert(`Error: ${e.message}`);
        }
    }

    async function close() {
        setCurrentNoteKey(null);
        setCurrentNotePassword(null);
        setCurrentNoteText(null);
        window.history.replaceState({}, null, process.env.REACT_APP_WEBAPP_URL);
        setIsOpened(false);
    }

    return (
        <div className="App">
            <AppBar style={{maxHeight: 60}}>
                <a href={process.env.REACT_APP_WEBAPP_URL}>
                    <img
                        style={{
                            margin: 5,
                            width: 300,
                            height: 40
                        }}
                        src={process.env.PUBLIC_URL + '/assets/logo.svg'} alt="logo"/>
                </a>
            </AppBar>
            <div style={{marginBottom: 70}}/>
            {
                isOpened ?
                    <NoteView
                        updateNote={updateNote}
                        currentNoteKey={currentNoteKey}
                        currentNotePassword={currentNotePassword}
                        currentNoteText={currentNoteText}
                        setCurrentNoteText={setCurrentNoteText}
                        openNote={openNote}
                        close={close}
                        doDelete={doDelete}
                    /> : <Main updateNote={updateNote} openNote={openNote}/>
            }
            <hr/>
            Web app:&nbsp;&nbsp;&nbsp;
            <a href="https://github.com/uxname/cryptonotes-webapp/">
                <img src="https://img.shields.io/github/forks/uxname/cryptonotes-webapp.svg?style=social" alt=""/>
            </a>&nbsp;
            <a href="https://github.com/uxname/cryptonotes-webapp/">
                <img src="https://img.shields.io/github/stars/uxname/cryptonotes-webapp.svg?style=social" alt=""/>
            </a>&nbsp;
            <a href="https://github.com/uxname/cryptonotes-webapp/">
                <img src="https://img.shields.io/github/license/uxname/cryptonotes-webapp.svg?style=social" alt=""/>
            </a>&nbsp;
            <br/>
            Server:&nbsp;&nbsp;&nbsp;
            <a href="https://github.com/uxname/cryptonotes-server/">
                <img src="https://img.shields.io/github/forks/uxname/cryptonotes-server.svg?style=social" alt=""/>
            </a>&nbsp;
            <a href="https://github.com/uxname/cryptonotes-server/">
                <img src="https://img.shields.io/github/stars/uxname/cryptonotes-server.svg?style=social" alt=""/>
            </a>&nbsp;
            <a href="https://github.com/uxname/cryptonotes-server/">
                <img src="https://img.shields.io/github/license/uxname/cryptonotes-server.svg?style=social" alt=""/>
            </a>&nbsp;
        </div>
    );
}

export default App;
