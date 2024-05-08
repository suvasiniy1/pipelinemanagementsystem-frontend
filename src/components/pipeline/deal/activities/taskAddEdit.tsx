import React, { useState } from 'react'
import { AddEditDialog } from '../../../../common/addEditDialog'
import RichTextEditor from '../../../../elements/richTextEditor'
import TextArea from '../../../../elements/TextArea';
import { Task } from '../../../../models/task';
import SelectDropdown from '../../../../elements/SelectDropdown';
import { DATEPICKER } from '../../../../elements/datePicker';

type params = {
    dealId: number;
    dialogIsOpen: any;
    setDialogIsOpen: any;
    onSaveNote?: any;
    onCloseDialog?: any;
}

export const TaskAddEdit = (props: params) => {

    const { dialogIsOpen, setDialogIsOpen, dealId, ...Others } = props;
    const [selectedItem, setSelectedItem]=useState(new Task());

    const oncloseDialog = () => {
        setDialogIsOpen(false);
        props.onCloseDialog && props.onCloseDialog();
    }


    const onSave = () => {
    }

    const getDueDates=()=>{
        return [];
    }

    return (
        <div>
            <AddEditDialog dialogIsOpen={dialogIsOpen}
                header={"Add Task"}
                onSave={onSave}
                closeDialog={oncloseDialog}
                onClose={oncloseDialog}>
                <br />
                <TextArea   isValidationOptional={true} 
                            item={selectedItem} 
                            selectedItem={selectedItem}/>
                <div className="form-group row" >
                    <DATEPICKER selectedItem={selectedItem}
                            isValidationOptional={true}/>
                </div>
                <div className="form-group row" >
                    <DATEPICKER selectedItem={selectedItem}
                            isValidationOptional={true}/>
                </div>

                {/* <SelectDropdown isValidationOptional={true} 
                                item={selectedItem} 
                                selectedItem={selectedItem} 
                                list={getDueDates()}/> */}
                {/* <RichTextEditor onChange={(e: any) => setSelectedItem({ ...selectedItem, noteDetails: e })}
                    value={selectedItem.noteDetails} /> */}
                <br />
            </AddEditDialog>
        </div>
    )
}
