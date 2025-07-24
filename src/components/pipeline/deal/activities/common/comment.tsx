import { faEdit, faTrash, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { toast } from 'react-toastify'
import { DeleteDialog } from '../../../../../common/deleteDialog'
import { UserProfile } from '../../../../../models/userProfile'
import LocalStorageUtil from '../../../../../others/LocalStorageUtil'
import Constants from '../../../../../others/constants'
import { CommentsService } from '../../../../../services/commentsService'
import { Comment } from '../../../../../models/comment'

type params = {
    comment: Comment,
    loadComments:any
}

const Comments = (props: params) => {
    const [comment, setComment] = useState(props.comment);
    const [commentText, setCommentText] = useState("");
    const [commentError, setCommentError] = useState("");
    const userObj = LocalStorageUtil.getItemObject(Constants.USER_PROFILE) as UserProfile;
    const [editComment, setEditComment] = useState(false);
    const commentSvc = new CommentsService(ErrorBoundary);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(()=>{
        setComment(props.comment);
        setCommentText(props.comment.comment || "");
        setCommentError("");
    },[props.comment])

    const deleteComment = () => {
        commentSvc.delete(comment.commentId).then(res => {
            if (res) {
                toast.success("Comment deleted successfully");
                setShowDeleteDialog(false);
                props.loadComments();
            }
        }).catch(err => {
            toast.error("Unable to delete comment");
        })
    }

    // Only allow update if commentText is different from original and not empty
    const updateComment = () => {
        
        if (!commentText.trim()) {
            setCommentError("Please enter a comment.");
            return;
        }
        if (commentText.trim() === (props.comment.comment || "").trim()) {
            setCommentError("No changes detected. Please edit the comment before saving.");
            return;
        }
        setCommentError("");
        commentSvc.putItemBySubURL({ ...comment, comment: commentText, modifiedBy: userObj.userId }, comment.commentId + "")
            .then(res => {
                if (res) {
                    toast.success("Comment updated successfully");
                    setComment({ ...comment, comment: commentText });
                    setEditComment(false);
                    props.loadComments();
                }
            })
            .catch(err => {
                toast.error("Unable to update comment");
            })
    }

    return (
        <>
        <div className='editnoteuserrow'>
            <div className='editComment' hidden={editComment}>
                <div className='userEditComment'><FontAwesomeIcon icon={faUser} /> {userObj?.user}</div>
                <div className='userEditCommentDetail'><span>{comment.comment}</span></div>
            </div>
            <div className="editstage-delete editComment-stage" hidden={editComment}>
                <button className="editstage-deletebtn" onClick={(e: any) => { setEditComment(true); setComment(props.comment); setCommentText(props.comment.comment || ""); setCommentError(""); }}><FontAwesomeIcon icon={faEdit} /></button>
                <button className="editstage-deletebtn" onClick={(e: any) => setShowDeleteDialog(true)}><FontAwesomeIcon icon={faTrash} /></button>
            </div>
            <div className='editPostComment' hidden={!editComment}>
                <textarea className='form-control pt-4' value={commentText} onChange={(e: any) => { setCommentText(e.target.value); setCommentError(""); }} style={{ minHeight: "150px"}} />
                {commentError && <div className='text-danger pt-2'>{commentError}</div>}
                <div className='editPostCommentBtnsRow'>
                    <button type="button" className="btn btn-secondary" onClick={updateComment}>Save</button>
                    <button type="button" className="btn btn-light margin-left" onClick={() => { setEditComment(false); setComment(props.comment); setCommentText(props.comment.comment || ""); setCommentError(""); }}>Cancel</button>
                </div>
            </div>
            
            {showDeleteDialog &&
                <DeleteDialog itemType={"Comment"}
                    itemName={""}
                    dialogIsOpen={showDeleteDialog}
                    closeDialog={(e: any) => setShowDeleteDialog(false)}
                    onConfirm={(e: any) => deleteComment()}
                    isPromptOnly={false}
                    actionType={"Delete"}
                />
            }
            </div>
        </>

    )
}

export default Comments