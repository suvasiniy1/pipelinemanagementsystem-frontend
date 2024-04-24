import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'react-toastify';
import { DeleteDialog } from '../../../../common/deleteDialog';
import { Notes } from '../../../../models/notes';
import Util from '../../../../others/util';
import { NotesService } from '../../../../services/notesService';
import NotesAddEdit from '../notesAddEdit';
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
  const [selectedIndex, setSelectedIndex]=useState<any>(null);

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
                  <DealNoteDetails note={note} 
                  index={index} 
                  setDialogIsOpen={(e:any)=>{setDialogIsOpen(e)}} 
                  setShowDeleteDialog={(e:any)=>{setShowDeleteDialog(e)}} 
                  setSelectedNoteItem={(e:any)=>{setSelectedNoteItem(e)}} 
                  setSelectedNoteId={(e:any)=>{setSelectedNoteId(e)}}
                  selectedIndex={selectedIndex}
                  setSelectedIndex={(e:any)=>{setSelectedIndex(e)}} />
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