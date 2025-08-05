import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AddEditDialog } from '../../../../../common/addEditDialog'
import RichTextEditor from '../../../../../elements/richTextEditor';
import { Notes } from '../../../../../models/notes';
import { NotesService } from '../../../../../services/notesService';
import { ErrorBoundary } from 'react-error-boundary';
import Util from '../../../../../others/util';
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
    const methods = useForm();
    const [isSaving, setIsSaving] = useState(false);

    const oncloseDialog = () => {
        setDialogIsOpen(false);
        props.onCloseDialog && props.onCloseDialog();
    }

    const onSave = () => {
        if (isSaving) return; // Prevent duplicate submissions
        
        // Validate note details - strip HTML tags and check for empty content
        const stripHtml = (html: string) => {
            const tmp = document.createElement('div');
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || '';
        };
        
        const textContent = stripHtml(selectedItem.noteDetails || '').trim();
        if (!textContent) {
            toast.error('Please enter note details');
            return;
        }

        setIsSaving(true);
        
        let obj = { ...selectedItem };
        obj.dealID = dealId;
        obj.createdBy = obj.userID = Util.UserProfile()?.userId;
        obj.userName = Util.UserProfile()?.user;
        
        (obj.noteID>0 ? noteSvc.putItemBySubURL(obj, `${obj.noteID}`) : noteSvc.postItemBySubURL(obj, "SaveNoteDetails")).then(res => {
            setDialogIsOpen(false);
            props.onSaveNote && props.onSaveNote();
            toast.success(`Note ${obj.noteID>0 ? " Updated " : " Added "} Successfully`);
        }).catch(err=>{
            toast.error(`Unable to ${obj.noteID>0 ? " Update " : " Add "} note`);
        }).finally(() => {
            setIsSaving(false);
        })
    }

    return (
        <>
            <div>
                <FormProvider {...methods}>
                    <AddEditDialog dialogIsOpen={dialogIsOpen}
                        header={(selectedItem.noteID > 0 ? "Edit" : "Add") + " Note"}
                        onSave={onSave}
                        closeDialog={oncloseDialog}
                        onClose={oncloseDialog}>
                        <RichTextEditor onChange={(e: any) => setSelectedItem({ ...selectedItem, noteDetails: e })}
                                        value={selectedItem.noteDetails} />
                    </AddEditDialog>
                </FormProvider>
            </div>
        </>
    )
}

export default NotesAddEdit