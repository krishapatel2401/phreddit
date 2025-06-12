import '../stylesheets/App.css';
// import React, {useState, useEffect} from 'react';
import RetrieveTimestamp from './retrieveTimestamp';
import RetrieveCommunityName from './retrieveCommunityName';
import RetrieveLinkFlair from './retrieveLinkFlair';
import upArrow from '../stylesheets/up arrow.png';
import downArrow from '../stylesheets/down arrow.png';
import axios from 'axios';

export default function PostPageView({post, communities, linkflairs, comments, users, setActivePost, setActiveView, setCommentType, setActivePostComment, triggerDataRefresh, activeUser}){

    // console.log('post element:',post);
    const post_comments = comments.filter((comment)=>
        post.commentIDs.includes(comment._id)
    );

    // triggerDataRefresh();

    const sortedComments = post_comments.sort((a,b)=> {
        let aDate = new Date(a.commentedDate);
        let bDate = new Date(b.commentedDate);
        return bDate - aDate;
    });

    const handleAddCommentClick = (post)=>{
        setCommentType('c');
        setActiveView('new-comment');
        setActivePostComment(post);

    };

    const handleUpvote = () => {
        
        if(activeUser.reputationValue >= 50){

            axios.put(`http://localhost:8000/api/posts/${post._id}/upvotes`)
            .then(response=>{
                console.log('upvote updated:',response.data);
            })
            .catch(error=>{
                console.error('Error updating view count:', error);
            });

            post.upvotes+=1;
            //find the user who posted the post and update their reputation value
            const poster = users.find((user)=>user.displayName===post.postedBy);
            if (poster){
                poster.reputationValue +=5;
            }
            triggerDataRefresh();
        }
        else{
            alert("Sorry! The user does not have enough reputation!")
        }
    };

    const handleDownvote = () => {

        console.log("Post data:", post); // Debugging log
        
        if(activeUser.reputationValue >= 50){

            axios.put(`http://localhost:8000/api/posts/${post._id}/downvotes`)
            .then(response=>{
                console.log('upvote updated:',response.data);
            })
            .catch(error=>{
                console.error('Error updating view count:', error);
            });

            post.upvotes-=1;
            //find the user who posted the post and update their reputation value
            const poster = users.find((user)=>user.displayName===post.postedBy);
            if (poster){
                poster.reputationValue -=10;
            }
            triggerDataRefresh();
        }
        else{
            alert("Sorry! The user does not have enough reputation!")
        }
    };

    return(
        <div>

            {/* post page header */}
            <div style={{borderBottom:'thin solid black', paddingLeft:'20px'}}>
                <div style={{display:'flex', alignItems:'center', paddingTop:'25px', fontSize:'18px'}}>
                    <p><RetrieveCommunityName post={post} communities={communities}/> </p>
                    <p>|</p>
                    <p><RetrieveTimestamp date={post.postedDate} /> </p>

                </div>
                    
                <p style={{marginTop:'10px'}}>{post.postedBy}</p>
                <h2 style={{marginTop:'10px'}}>{post.title}</h2>
                <p style={{marginTop:'10px'}}><RetrieveLinkFlair post={post} linkflairs={linkflairs}/></p>
                <p style={{marginTop:'10px'}}>{post.content}</p>

                {/* Upvote for guest users
                {!activeUser &&
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px', marginBottom:'20px' }}>
                    <div style={{ marginRight: '15px' }}>View count: {post.views}</div>
                    <div>Comment count: {post.commentIDs.length}</div>
                    <img style={{height:'17px', width:'auto', marginLeft:'15px'}} src={upArrow}/>
                    <div style={{ marginLeft: '5px' }}> Upvote Count: {post.upvotes}</div>
                    
                </div>
                } */}
                
                {/* Upvote for active users */}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', marginBottom:'20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start'}}>
                        <div style={{ marginRight: '15px' }}>View count: {post.views}</div>
                        <div>Comment count: {post.commentIDs.length}</div>
                        <img style={{height:'17px', width:'auto', marginLeft:'25px'}} src={upArrow}/>
                        <div style={{ marginLeft: '5px' }}> Upvote Count: {post.upvotes}</div>

                    </div>
                    
                    
                    {activeUser && (
                        <div style={{display:'flex'}}>
                    
                            <button style={{ marginRight: '15px', padding:'5px 9px 5px 9px', borderRadius:'20px', backgroundColor:'lightgreen' }}
                                onClick={(event)=>{
                                    event.preventDefault();
                                    handleUpvote();
                            }}>
                                <img style={{height:'17px', width:'auto', marginRight:'10px', borderRadius:'20px'}} src={upArrow}/>
                                Upvote
                            </button>
                    
                            <button style={{ marginRight: '30px', padding:'5px 9px 5px 9px', borderRadius:'20px', backgroundColor:'#FF7F7F' }}
                                onClick={(event)=>{
                                    event.preventDefault();
                                    handleDownvote();
                            }}>
                                <img style={{height:'17px', width:'auto', marginRight:'10px', borderRadius:'20px'}} src={downArrow}/>
                                Downvote
                            </button>

                    </div>
                    )}
                
                </div>
                
        
                {/* <p style={{marginTop:'10px', marginBottom:'20px'}}>View counts: {post.views}    Current comment count: {post.commentIDs.length}</p> */}

                <button 
                    className='button'
                    style={{cursor:'pointer', marginBottom:'15px', borderRadius:'14px', padding:'5px 10px', backgroundColor:'lightgray'}}
                    disabled = {!activeUser || !activeUser.displayName}
                    onClick={(event)=>{
                        event.preventDefault();
                        handleAddCommentClick(post);
                    }}
                    >
                        Add a comment
                    </button>

                    
            </div>

            {/*post comments section threading*/}
            <div>
            {sortedComments.map((comment)=>(
                <div key={comment.commentID}>
                    <DisplayComment 
                        comment={comment} 
                        comments={comments}
                        setActiveView={setActiveView}
                        setCommentType={setCommentType}
                        setActivePostComment={setActivePostComment}
                        activeUser={activeUser}
                        triggerDataRefresh={triggerDataRefresh}
                        />
                </div>
                
                ))}
            </div>
        

        </div>

    );
}


function DisplayComment({comment, comments, setActiveView, setCommentType, setActivePostComment, activeUser, triggerDataRefresh}){

    let childComments = comments.filter((childComment)=>(
        comment.commentIDs.includes(childComment._id)
    ))

    childComments = childComments.sort((a,b)=> {
        let aDate = new Date(a.commentedDate);
        let bDate = new Date(b.commentedDate);
        return bDate - aDate;
    });

    const handleReplyClick = (comment) =>{
        setCommentType('r');
        setActiveView('new-comment');
        setActivePostComment(comment);
        // setActivePost(null);
        // setActiveCommunity(null);
    }

    const handleUpvoteComment = () => {
        // alert("Hey!");

        if(activeUser.reputationValue >= 50){

            axios.put(`http://localhost:8000/api/comments/${comment._id}/commentUpvotes`)
            .then(response=>{
                console.log('upvote updated:',response.data);
            })
            .catch(error=>{
                console.error('Error updating view count:', error);
            });

            comment.upvotes+=1;
            triggerDataRefresh();
        }
        else{
            alert("Sorry! The user does not have enough reputation!")
        }
    };

    const handleDownvoteComment = () => {

        if(activeUser.reputationValue >= 50){

            axios.put(`http://localhost:8000/api/comments/${comment._id}/commentDownvotes`)
            .then(response=>{
                console.log('upvote updated:',response.data);
            })
            .catch(error=>{
                console.error('Error updating view count:', error);
            });

            comment.upvotes+=1;
            triggerDataRefresh();
        }
        else{
            alert("Sorry! The user does not have enough reputation!")
        }
    }


    return(
        <div className="nested-comments">

                <div style={{display:'flex',alignItems:'center', marginTop:'10px', marginBottom:'0px'}}>
                    <p style={{marginRight:'5px'}}>{comment.commentedBy}</p>
                    <p>|</p>
                    <p><RetrieveTimestamp date={comment.commentedDate} /></p>
                </div>
                
                
                <p style={{marginTop:'0px', marginBottom:'10px'}}>{comment.content}</p>
                <div style={{display:'flex', alignItems:'center'}}>
                    <button 
                    style={{fontSize:'small', marginBottom:'10px', cursor:'pointer', borderRadius:'14px', padding:'4px 10px', backgroundColor:'lightgray'}}
                    onClick={(event)=>{
                        event.preventDefault();
                        console.log('reply button clicked');
                        handleReplyClick(comment);
                    }}
                    disabled = {!activeUser || !activeUser.displayName}
                    >
                        Reply
                    </button>

                    <div style={{display:'flex', alignItems:'center'}}>
                        <img style={{height:'17px', width:'auto', marginLeft:'15px'}} src={upArrow}/>
                        <p style={{ marginLeft: '5px', marginRight:'30px' }}> Upvote Count: {comment.upvotes}</p>
                    </div>
                    

                    {activeUser && (
                        <div>
                            <button style={{ marginRight: '15px', cursor:'pointer', padding:'5px 9px 5px 9px', 
                                borderRadius:'20px', backgroundColor: 'lightgreen', fontSize:'small' }}
                                onClick={(event)=>{
                                event.preventDefault();
                                handleUpvoteComment();
                            }}>
                                <img style={{height:'13px', width:'auto', marginRight:'10px', borderRadius:'20px'}} src={upArrow}/>
                                Upvote
                            </button>

                            <button style={{ marginRight: '15px', cursor:'pointer', padding:'5px 9px 5px 9px', 
                                borderRadius:'20px', backgroundColor:'#FF7F7F', fontSize:'small' }}
                                onClick={(event)=>{
                                event.preventDefault();
                                handleDownvoteComment();
                            }}>
                                <img style={{height:'13px', width:'auto', marginRight:'10px', borderRadius:'20px'}} src={downArrow}/>
                                Downvote
                            </button>

                        </div>
                    )}

                </div>
        

               {/* now doing the recursion */}
               {childComments.length >0 &&(
                    <div>
                        {childComments.map((childComment)=>(
                            <DisplayComment 
                                key={childComment._id} 
                                comment={childComment}
                                comments={comments}
                                setActiveView={setActiveView}
                                setCommentType={setCommentType}
                                setActivePostComment={setActivePostComment}
                                activeUser={activeUser}
                                triggerDataRefresh={triggerDataRefresh}
                                />

                        ))}
                    </div>
               )}
        </div>

    );
}