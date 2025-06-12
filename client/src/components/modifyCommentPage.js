import '../stylesheets/App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function ModifyCommentPage({activeUser, posts, comment, comments, setComments, commentType, setActiveView, activePostComment, triggerDataRefresh}){

    //state for input value
    const [commentContent, setCommentContent] = useState(comment.content);

    //state for error
    const [commentContentError, setCommentContentError] = useState(false);

    console.log('comment content:',comment.content);

    const handleUpdateComment = async () =>{
        
        let hasError = false;

        if (commentContent.trim()===''){
            setCommentContentError(true);
            hasError = true;
        }
        else{
            setCommentContentError(false);
        }

        if (hasError){
            return;
        }
        else{

            try{
                const updatedData = {
                    commentID: comment.commentID,
                    content: commentContent,
                    commentIDs: comment.commentIDs,
                    commentedBy: comment.commentedBy,
                    commentedDate: comment.commentedDate
                };

                const updatedComment = await axios.put(`http://localhost:8000/api/comments/${comment._id}`, updatedData);
                triggerDataRefresh();
            } catch(error){
                console.error('Error modifying comment:', error);
            }

        }

        //clearing input values
        setCommentContent('');

        //setting view
        setActiveView('user-profile');
    };

    const findParentPost = (comment)=>{
        return posts.find((post)=>post.commentIDs.includes(comment._id));
    }

    const findParentComment = (comments, childComment)=>{
        
        for (const testComment of comments){
            if (testComment.commentIDs.includes(childComment._id)){
                return testComment;
            }
        }

        // const testComment = comments.find((comment)=>comment._id===commentID);
        // if (testComment.commentIDs.includes(childComment._id)){
        //     return testComment;
        // }
    
    };


    const handleDeleteComment = async () =>{

        //since we'll also have to delete the comment's id from the
        //commentIDs array of the parent post/comment
        const parentPost = findParentPost(comment);

        // if (!parentPost){
        //     //since this is a reply, finding the parent comment
        //     const parentComment = findParentComment(comments, comment);
        // }


        const userConfirmed = window.confirm(
            `Are you sure you want to delete the comment "${comment.content}"? This action cannot be undone. Doing so will also delete all replies belonging to the comment`
        );

        if (!userConfirmed){
            return; //since the user doesn't wanna dletee the community, we're gonna just return from the function
        }

        try{
            await axios.delete(`http://localhost:8000/api/comments/${comment._id}`);
        } catch (error){
            console.error('Failed to delete comment');
        }

        //now updating the parent post/comment's commentIDs array
        if (parentPost){
            const parentPostCommentIDs = parentPost.commentIDs.filter((commentID)=>commentID!==comment._id);

            //update that post
            try{
                const updatedPostData = {
                    postID: parentPost.postID,
                    title: parentPost.title,
                    content: parentPost.content,
                    linkFlairID: parentPost.linkFlairID,
                    postedBy: parentPost.postedBy,
                    postedDate: parentPost.postedDate,
                    commentIDs: parentPostCommentIDs,
                    views: parentPost.views,
                    upvotes: parentPost.upvotes
                };

                await axios.put(`http://localhost:8000/api/posts/${parentPost._id}`, updatedPostData);
            } catch (error){
                console.error('Error modifying post:', error);
            }
        }
        else {
            //since this is a reply, finding the parent comment
            const parentComment = findParentComment(comments, comment);

            if (parentComment){
                const parentCommentCommentIDs = parentComment.commentIDs.filter((commentID)=>commentID!==comment._id);

                //update that comment
                try{
                    const updatedCommentData = {
                        commentID: parentComment.commentID,
                        content: parentComment.content,
                        commentIDs: parentCommentCommentIDs,
                        commentedBy: parentComment.commentedBy,
                        commentedDate: parentComment.commentedDate
                    };

                    await axios.put(`http://localhost:8000/api/comments/${parentComment._id}`, updatedCommentData); 
                } catch(error){
                    console.error('Error modifying comment:', error);
                }
            }
        }

        triggerDataRefresh();
        setActiveView('user-profile');

    };

    return(
        <div>
            <h2 style={{borderBottom:'thin black solid', paddingLeft:'25px', paddingBottom:'10px'}}>Create a Comment</h2>
            <p style={{fontWeight:'bold',margin:'30px 0px 5px 25px'}}
                >Enter comment content</p>
            <input
                type="text"
                value={commentContent}
                maxLength={500}
                style={{width:'400px', borderRadius:'14px', padding:'5px', marginLeft:'25px'}}
                placeholder="(text input of max 500 characters)"
                onChange={(e)=>setCommentContent(e.target.value)} 
            />
            {commentContentError && <p style={{color:'red', marginLeft:'25px'}}>*Error: Comment content cannot be empty!</p>}

            <br />

            <div>
                <button
                    className="button"
                    style={{margin:'30px 0px 20px 25px',cursor:'pointer', borderRadius:'14px', padding:'5px 10px', backgroundColor:'lightgray'}}
                    onClick={(event)=>{
                        event.preventDefault();
                        handleUpdateComment();
                    }}
                    >Update Comment</button>

                <button
                    className="button"
                    style={{margin:'30px 0px 20px 25px',cursor:'pointer', borderRadius:'14px', padding:'5px 10px', backgroundColor:'lightgray'}}
                    onClick={(event)=>{
                        event.preventDefault();
                        handleDeleteComment();
                    }}
                    >Delete Comment</button>

            </div>
            

        </div>
    );
}