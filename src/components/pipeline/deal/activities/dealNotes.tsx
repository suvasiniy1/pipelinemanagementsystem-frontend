import moment from 'moment';
import Accordion from 'react-bootstrap/Accordion';
import { Notes } from '../../../../models/notes';
import NotesAddEdit from '../notesAddEdit';
import { NotesService } from '../../../../services/notesService';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AxiosError } from 'axios';
import Util from '../../../../others/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DeleteDialog } from '../../../../common/deleteDialog';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import DealNoteDetails from './dealNoteDetails';

type params = {
  dealId: number;
}
const DealNotes = (props: params) => {
  const { dealId, ...others } = props;
  const notesSvc = new NotesService(ErrorBoundary);
  const [notesList, setNotesList] = useState<Array<Notes>>([]);
  const [error, setError] = useState<AxiosError>();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number>(0);
  const [selectedNoteItem, setSelectedNoteItem] = useState<Notes>();

  useEffect(() => {
    loadNotes();
  }, [])

  const loadNotes = () => {
    setIsLoading(true);
    notesSvc.getNotes(dealId).then(res => {

      (res as Array<Notes>).forEach(i => {
        i.updatedDate = i.updatedDate ?? i.createdDate;
      });
      setNotesList(Util.sortList(res, "updatedDate", "desc"));
      setIsLoading(false);
    }).catch(err => {
      setError(err);
      setIsLoading(false);
    })
  }

  const deleteNote = () => {
    notesSvc.deleteNote(selectedNoteId).then(res => {
      toast.success("Note deleted successfully");
      setShowDeleteDialog(false);
      setSelectedNoteId(0);
      loadNotes();
    }).catch(err => {

    })
  }

  return (
    <>
      {isLoading ? <div className="alignCenter"><Spinner /></div> :
        <>

            <div className='activityfilter-row pb-3'>
              <div className='createnote-row'>
                <button className='btn btn-primary' type='button' onClick={(e: any) => setDialogIsOpen(true)}>Create Note</button>
              </div>
            </div>
            <h3>April 2024</h3>
            <div className='activityfilter-accrow  mb-3' hidden={notesList.length==0}>
              <Accordion className='activityfilter-acco'>
                {notesList.map((note, index) => (
                  <Accordion.Item eventKey={"" + index} key={index}>
                    <Accordion.Header>
                      <span className='accoheader-title'>
                        <strong>Note</strong> by {note.userName}
                      </span>
                      <span className='accoheader-date'>{moment(note.createdDate).format("MM-DD-YYYY hh:mm:ss a")}</span>
                    </Accordion.Header>
                    <Accordion.Body>
                      <DealNoteDetails noteDetails={note.noteDetails}/>
                      <div className="editstage-delete">
                        <button className="editstage-deletebtn" onClick={(e: any) => { setDialogIsOpen(true); setSelectedNoteItem(note as any) }}><FontAwesomeIcon icon={faEdit} /></button>
                        <button className="editstage-deletebtn" onClick={(e: any) => { setShowDeleteDialog(true); setSelectedNoteId(note.noteID as any) }}><FontAwesomeIcon icon={faTrash} /></button>
                      </div>
                    </Accordion.Body>
                    <div className='accofooter'>
                      <FontAwesomeIcon icon={faCircleCheck} style={{paddingRight:5}}/>{note.noteDetails?.replace(/<[^>]*>/g, '')}
                    </div>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          <div style={{ textAlign: "center" }} hidden={notesList.length > 0}>
            No notes are avilable to show
          </div>
        </>

      }
      {dialogIsOpen && <NotesAddEdit dialogIsOpen={dialogIsOpen}
        dealId={dealId}
        onCloseDialog={(e:any)=>setSelectedNoteItem(null as any)}
        noteItem={selectedNoteItem}
        setDialogIsOpen={setDialogIsOpen}
        onSaveNote={(e: any) => {setSelectedNoteItem(null as any) ; loadNotes()}} />
      }
      {showDeleteDialog &&
        <DeleteDialog itemType={"Note"}
          itemName={""}
          dialogIsOpen={showDeleteDialog}
          closeDialog={(e: any) => setShowDeleteDialog(false)}
          onConfirm={(e: any) => deleteNote()}
          isPromptOnly={false}
          actionType={"Delete"}
        />
      }
    </>
  )
}

export default DealNotes