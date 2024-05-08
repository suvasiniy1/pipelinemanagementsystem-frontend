import React, { useState } from 'react'
import { TaskAddEdit } from './taskAddEdit';

const TasksActivites = () => {

    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    return (
        <>
            <div className='activityfilter-row pb-3'>
                <div className='createnote-row'>
                    <button className='btn btn-primary' type='button' onClick={(e: any) => setDialogIsOpen(true)}>Create Task</button>
                </div>
            </div>
            {dialogIsOpen && <TaskAddEdit dialogIsOpen={dialogIsOpen} 
            dealId={0} 
            setDialogIsOpen={setDialogIsOpen}/>
            }
        </>
    )
}

export default TasksActivites