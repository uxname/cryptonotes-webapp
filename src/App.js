import React, {useState} from 'react';
import './App.css';
import Main from './components/Main'
import NoteView from './components/NoteView'
import client from "./helper/apolloClient";
import {gql} from "apollo-boost";
import Utils from "./helper/utils";

const config = {
    SALT: "oSQjLyBrapncJNkxbAS4JJRtpmzTYTVjaJd3oRsS3aREffnz"
};

function App(props) {

    const [currentNoteKey, setCurrentNoteKey] = useState(null);
    const [currentNotePassword, setCurrentNotePassword] = useState(null);
    const [currentNoteText, setCurrentNoteText] = useState(null);
    const [isOpened, setIsOpened] = useState(false);

    async function updateNote(key, password, text) {
        try {
            return await client.mutate({
                mutation: gql`
                    mutation UpdateNote($key: String, $password_hash: String!, $text: String!) {
                        update_note(key: $key, password_hash: $password_hash, text: $text) {
                            key
                            text
                        }
                    }
                `,
                variables: {
                    key: key,
                    password_hash: Utils.hash(password),
                    text: Utils.encryptString(text, password, config.SALT)
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
        setIsOpened(false);
    }

    return (
        <div className="App">
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
        </div>
    );
}

export default App;
