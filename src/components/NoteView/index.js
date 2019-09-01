import React from 'react';

export default function (props) {

    async function updateNote() {
        return await props.updateNote(props.currentNoteKey, props.currentNotePassword, props.currentNoteText);
    }

    async function close() {
        props.close();
    }

    return (
        <>
            Current note: {props.currentNoteKey}
            <br/>
            <textarea rows={12} cols={70} id='input-note-text'
                      placeholder="Note text..." onChange={e => props.setCurrentNoteText(e.target.value)}
                      value={props.currentNoteText || ''}/>
            <br/>
            <button id="btn-create" onClick={updateNote}>Save</button>
            <button id="btn-close" onClick={close}>Close</button>
        </>
    )
};
