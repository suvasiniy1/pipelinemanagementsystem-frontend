import React, { useState } from 'react'
import { AddEditDialog } from '../../../common/addEditDialog'
import RichTextEditor from '../../../elements/richTextEditor';
import { Notes } from '../../../models/notes';
import { NotesService } from '../../../services/notesService';
import { ErrorBoundary } from 'react-error-boundary';
import Util from '../../../others/util';
import { toast } from 'react-toastify';

type params = {
    dealId: number;
    dialogIsOpen: any;
    setDialogIsOpen: any;
    onSaveNote?: any;
    noteItem?: Notes;
    onCloseDialog?:any;
}
const NotesAddEdit = (props: params) => {

    const { dialogIsOpen, setDialogIsOpen, dealId, noteItem, ...Others } = props;
    const [selectedItem, setSelectedItem] = useState(noteItem ?? new Notes());
    const noteSvc = new NotesService(ErrorBoundary);

    const oncloseDialog = () => {
        setDialogIsOpen(false);
        props.onCloseDialog && props.onCloseDialog();
    }

    const onSave = () => {

        let obj = { ...selectedItem };
        obj.dealID = dealId;
        obj.createdBy = obj.userID = Util.UserProfile()?.userId;
        obj.userName = Util.UserProfile()?.user;
        (obj.noteID>0 ? noteSvc.putItemBySubURL(obj, `${obj.noteID}`) : noteSvc.postItemBySubURL(obj, "SaveNoteDetails")).then(res => {
            setDialogIsOpen(false);
            props.onSaveNote();
            toast.success(`Note ${obj.noteID>0 ? " Updated " : " Added "} Successfully`);
        }).catch(err=>{
            toast.error(`Unable to ${obj.noteID>0 ? " Update " : " Add "} note`);
        })
    }

    return (
        <>
            <div>
                <AddEditDialog dialogIsOpen={dialogIsOpen}
                    header={(selectedItem.noteID > 0 ? "Edit" : "Add") + " Note"}
                    onSave={onSave}
                    closeDialog={oncloseDialog}
                    onClose={oncloseDialog}>
                    <br />
                    <RichTextEditor onChange={(e: any) => setSelectedItem({ ...selectedItem, noteDetails: e })}
                                    value={selectedItem.noteDetails} />
                    <br />
                </AddEditDialog>
            </div>
        </>
    )
}

export default NotesAddEdit