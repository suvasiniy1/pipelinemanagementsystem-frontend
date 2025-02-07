import { faCircleCheck, faEdit, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'react-toastify';
import { Comment } from '../../../../../models/comment';
import { Notes } from '../../../../../models/notes';
import { UserProfile } from '../../../../../models/userProfile';
import LocalStorageUtil from '../../../../../others/LocalStorageUtil';
import Constants from '../../../../../others/constants';
import { CommentsService } from '../../../../../services/commentsService';
import { NotesService } from '../../../../../services/notesService';
import Comments from '../common/comment';

type params = {
    note: Notes;
    index: number;
    setDialogIsOpen: any;
    setShowDeleteDialog: any;
    setSelectedNoteItem: any;
    setSelectedNoteId: any;
    selectedIndex: any;
    setSelectedIndex: any;
}
const NoteDetails = (props: params) => {
    const { index, selectedIndex, ...others } = props;
    const [note, setNote] = useState(props.note);
    const divRef = useRef();
    const userObj = LocalStorageUtil.getItemObject(Constants.USER_PROFILE) as UserProfile;
    const [showcomments, setShowComments] = useState(false);
    const commentSvc = new CommentsService(ErrorBoundary);
    const noteSvc = new NotesService(ErrorBoundary);
    const [comment, setComment] = useState(new Comment());
    const [defaultComment, setDefaultComment]=useState(null);
    const commentRef = useRef();

    useEffect(() => {
        if (divRef) {
            (divRef.current as any).innerHTML = note?.noteDetails;
        }
    }, [props])

    const getnote = () => {
        noteSvc.getItem(note.noteID).then(res => {
            
            setNote(res);
        })
    }

    const saveComment = () => {
        
        let obj = { ...comment };
        obj.noteId = note.noteID;
        obj.dealID = note.dealID;
        obj.createdBy = userObj.userId;
        commentSvc.addComment(obj).then(res => {
            
            if (res) {
                toast.success("Comment added successfully");
                setDefaultComment(null);
                (commentRef.current as any).value=null;
                getnote();
            }
        }).catch(err => {
            toast.error("Unable to add comment");
        })
    }

    return (
        <Accordion.Item eventKey={"" + index} key={index}>
            <Accordion.Header onClick={(e: any) => {
                props.setSelectedIndex((prevIndex: any) => prevIndex === index ? null : index);
            }}>
                <span className='accoheader-title'>
                    <strong>Note</strong> by {note?.userName}
                </span>
                <span className='accoheader-date'>{moment(note?.createdDate).format("MM-DD-YYYY hh:mm:ss a")}</span>
            </Accordion.Header>
            <Accordion.Body>
                    <div className='notecomment-text' ref={divRef as any}></div>
                    <div className="editstage-delete">
                        <button className="editstage-deletebtn" onClick={(e: any) => { props.setDialogIsOpen(true); props.setSelectedNoteItem(note as any) }}><FontAwesomeIcon icon={faEdit} /></button>
                        <button className="editstage-deletebtn" onClick={(e: any) => { props.setShowDeleteDialog(true); props.setSelectedNoteId(note?.noteID as any) }}><FontAwesomeIcon icon={faTrash} /></button>
                        <a className='margin-left' href="javascript:void(0);"><span style={{ color: "#0091ae" }} onClick={(e: any) => { setShowComments(!showcomments) }}>{showcomments ? note.comments.length > 1 ? 'Hide Comments' : 'Hide Comment' : note.comments.length > 0 ? note.comments.length == 1 ? note.comments.length + " Comment" : note.comments.length + " Comments" : 'Add Comment'} </span></a>
                    </div>
                
                <div className='showcomments' hidden={!showcomments}>
                    <div className='noteuserrow'>
                        {
                        note.comments?.map((c, index) => (
                            <Comments comment={c}
                            loadComments={(e:any)=>getnote()} />
                        ))}
                    </div>
                    <div className='noteUserComment pt-4'>
                        <div className='userEditComment noteuser'><FontAwesomeIcon icon={faUser} /> {userObj?.user}</div>
                        <div className='noteUserCommentTextarea'>
                            <textarea className='form-control pt-4' ref={commentRef as any} defaultValue={defaultComment as any} onChange={(e: any) => setComment({ ...comment, comment: e.target.value })} style={{ minHeight: "150px"}} />
                        </div>
                        <button type="button" className="btn btn-secondary" onClick={(e: any) => saveComment()}>Save</button>
                    </div>
                </div>

            </Accordion.Body>
            <div className='accofooter' hidden={index == selectedIndex}>
                <FontAwesomeIcon icon={faCircleCheck} style={{ paddingRight: 5 }} />{note.noteDetails?.replace(/<[^>]*>/g, '')}
            </div>
        </Accordion.Item>
    )
}

export default NoteDetails