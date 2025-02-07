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
    const userObj = LocalStorageUtil.getItemObject(Constants.USER_PROFILE) as UserProfile;
    const [editComment, setEditComment] = useState(false);
    const commentSvc = new CommentsService(ErrorBoundary);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(()=>{
        setComment(props.comment)
    },[props])

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

    const updateComment = () => {
        commentSvc.putItemBySubURL({ ...comment, modifiedBy: userObj.userId }, comment.commentId + "").then(res => {
            
            if (res) {
                toast.success("Comment updated successfully");
                setComment(res);
                setEditComment(false);
            }
        }).catch(err => {
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
                <button className="editstage-deletebtn" onClick={(e: any) => { setEditComment(true); setComment(props.comment) }}><FontAwesomeIcon icon={faEdit} /></button>
                <button className="editstage-deletebtn" onClick={(e: any) => setShowDeleteDialog(true)}><FontAwesomeIcon icon={faTrash} /></button>
            </div>
            <div className='editPostComment' hidden={!editComment}>
                <textarea className='form-control pt-4'  defaultValue={comment.comment} onChange={(e: any) => setComment({ ...comment, comment: e.target.value })} style={{ minHeight: "150px"}} />
                <div className='editPostCommentBtnsRow'>
                    <button type="button" className="btn btn-secondary" onClick={(e: any) => updateComment()}>Save</button>
                    <button type="button" className="btn btn-light margin-left" onClick={(e: any) => { setEditComment(false); setComment(props.comment) }}>Cancel</button>
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