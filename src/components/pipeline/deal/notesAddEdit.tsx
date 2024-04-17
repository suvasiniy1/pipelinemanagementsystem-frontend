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
    onSaveNote: any;
}
const NotesAddEdit = (props: params) => {
    
    const { dialogIsOpen, setDialogIsOpen, dealId, ...Others } = props;
    const [selectedItem, setSelectedItem] = useState(new Notes());
    const noteSvc = new NotesService(ErrorBoundary);

    const oncloseDialog = () => {
        setDialogIsOpen(false);
    }

    const onSave = () => {
        
        let obj = { ...selectedItem };
        obj.dealID = dealId;
        obj.createdBy = obj.userID = Util.UserProfile()?.userId;
        obj.userName = Util.UserProfile()?.user;
        noteSvc.postItemBySubURL(obj, "SaveNoteDetails").then(res => {
            setDialogIsOpen(false);
            props.onSaveNote();
            toast.success("Note added successfully");
        })
    }

    return (
        <div>
            <AddEditDialog dialogIsOpen={dialogIsOpen}
                header={"Add Note"}
                onSave={onSave}
                closeDialog={oncloseDialog}
                onClose={oncloseDialog}>
                <br />
                <RichTextEditor onChange={(e: any) => setSelectedItem({ ...selectedItem, noteDetails: e })}
                    value={selectedItem.noteDetails} />
                <br />
            </AddEditDialog>
        </div>
    )
}

export default NotesAddEdit