import '../stylesheets/App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function NewCommentPageView({activeUser, posts, comments, setComments, commentType, setActiveView, activePostComment, triggerDataRefresh}){

    const [commentContent, setCommentContent] = useState('');
    const [username, setUsername] = useState('');

    const [commentContentError, setCommentContentError] = useState(false);
    const [usernameError, setUsernameError] = useState(false);


    const refreshComments = async ()=>{
        try{
            const response = await axios.get('http://localhost:8000/api/comments');
            setComments(response.data);
        } catch(error){
            console.error('Error refreshing comments');
        }
    };

    useEffect(()=>{
        refreshComments();
    }, []);

    const handleSubmitComment = async (parentID, newComment, addType) => {
        
        let newCommentID;
        // Update model comments with the new comment
        try{
            const response = await axios.post('http://localhost:8000/api/comments', newComment);
            newCommentID = response.data._id;
            setComments((prev)=>[...prev, response.data]);
            triggerDataRefresh();
            //refreshing the comments, or like reloading the page
            // await refreshComments();
        } catch(error){
            console.error('Error creating comment:', error);
        }
        
        // const newCommentID = newComment._id;
        console.log('new comment id', newCommentID);

        if (addType === 'c') {
            // Adding a comment to a post
            updateParentAddComment(parentID, newCommentID, posts);
            // triggerDataRefresh();
        } else if (addType === 'r') {
            // Adding a reply to a comment
            updateParentAddReply(parentID, newCommentID, comments);
            // triggerDataRefresh();
        }

        // await refreshComments();
        triggerDataRefresh();

        //update the comments, idk why the triggerDataRefresh didn't work properly
        // try{
        //     const response = axios.get('http://localhost:8000/api/comments');
        //     setComments(response.data);
        // } catch(error){
        //     console.error('There was an error in fetching comments', error);
        // }

    };


    const updateParentAddComment = async (postID, commentID, posts) => {
        const post = posts.find(p => p._id === postID);
        if (post) {
            console.log('found a parent post');
            console.log('post',post);
            console.log('comment id',commentID);
            try{
                //updating the post's commentIDs array
                await axios.put(`http://localhost:8000/api/posts/${postID}`,{
                    $push: { commentIDs: commentID}
                });
                post.commentIDs.push(commentID);
                // await refreshComments();
                // triggerDataRefresh();
                console.log('CommentID added to post ka commentIDS');
            } catch(error){
                console.error('Error adding commentID to post commentIDs');
            }
            // post.commentIDs.push(commentID);
        }
    };

    const updateParentAddReply = async (commentID, replyID, comments) => {
        const comment = comments.find(c => c._id === commentID);
        if (comment) {
            console.log('found a parent comment');
            try{
                await axios.put(`http://localhost:8000/api/comments/${commentID}`,{
                    $push : { commentIDs : replyID}
                });
                comment.commentIDs.push(replyID);
                // triggerDataRefresh();
                // await refreshComments();
                console.log('replyID added to commentIDs of comment');
            } catch(error){
                console.error('Failed to add replyID to the commentIDs array');
            }
            // comment.commentIDs.push(replyID);
        }
    };

    const handleNewComment = (commentType) =>{
        let hasError = false;

        if (commentContent.trim()===''){
            setCommentContentError(true);
            hasError = true;
        }
        else{
            setCommentContentError(false);
        }

        if (!activePostComment) {
            console.error("No active post selected for commenting.");
            return <div>No active post selected</div>; // Early return if activePost is null
        }

        //checking if there are any errors and updating model
        if (hasError){
            alert('There is an error in 1 or more fields.')

        }
        else{

            const newComment = {
                commentID: `comment${activePostComment.commentIDs.length +1}`,
                content: commentContent,
                commentIDs: [],
                commentedBy: activeUser.displayName,
                commentedDate: new Date(),

            };

            console.log('new comment:', newComment);
            console.log('comments lentgh:', comments.length);

            handleSubmitComment(activePostComment._id, newComment, commentType);

            // triggerDataRefresh();

            //clearing input values
            setCommentContent('');
            setUsername('');

            //hiding other views to display this view
            // triggerDataRefresh();
            setActiveView('post');
            // setActivePost(null);

            

        };


    }

    return(
        <div>
            <h2 style={{borderBottom:'thin black solid', paddingLeft:'25px', paddingBottom:'10px'}}>Create a Comment</h2>
            <p style={{fontWeight:'bold',margin:'30px 0px 5px 25px'}}
                >Enter comment content</p>
            <input
                type="text"
                maxLength={500}
                style={{width:'400px', borderRadius:'14px', padding:'5px', marginLeft:'25px'}}
                placeholder="(text input of max 500 characters)"
                onChange={(e)=>setCommentContent(e.target.value)} 
            />
            {commentContentError && <p style={{color:'red', marginLeft:'25px'}}>*Error: Comment content cannot be empty!</p>}

            <br />

            {/* <p style={{fontWeight:'bold',marginBottom:'5px'}}
                >Enter commentor's username</p>
            <input
                type="text"
                // maxLength={500}
                placeholder="(text input)"
                onChange={(e)=>setUsername(e.target.value)} 
            />
            {usernameError && <p style={{color:'red'}}>*Error: Username cannot be empty!</p>}

            <br /> */}

            <button
                className="button"
                style={{margin:'30px 0px 20px 25px',cursor:'pointer', borderRadius:'14px', padding:'5px 10px', backgroundColor:'lightgray'}}
                onClick={(event)=>{
                    event.preventDefault();
                    handleNewComment(commentType);
                }}
                >Submit Comment</button>

        </div>
    );
}