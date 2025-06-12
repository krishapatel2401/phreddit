import '../stylesheets/App.css';
import upArrow from '../stylesheets/up arrow.png';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import RetrieveTimestamp from './retrieveTimestamp';
import RetrieveCommunityName from './retrieveCommunityName';
import RetrieveLinkFlair from './retrieveLinkFlair';

export default function UserProfilePageView({activeUser, setActiveUser, 
                                            admin, users, 
                                            posts, communities, 
                                            comments, setActiveCommunity, 
                                            setActivePost,
                                            setActiveView,
                                            setActiveComment,
                                            triggerDataRefresh}){

    // console.log('reputation:', activeUser.reputationValue);

    const [currentListing, setCurrentListing] = useState(admin ? 'users' : 'posts');

    // if (activeUser){
    //     setCurrentListing('users');
    // }

    return(
        <div>

            {/* the page header */}
            <div 
                style={{marginTop:'20px', paddingBottom:'20px', borderBottom:'thin black solid'}}
                >
                <div 
                    style={{display:'flex', justifyContent:'space-between', 
                        alignItems:'center', marginRight:'10px'}}
                    >
                    <h2 style={{marginLeft:'15px'}}>{activeUser.displayName}</h2>
                    {admin && 
                        <button style={{borderRadius:'15px', padding:'5px 10px'}}
                            onClick={(event)=>{
                                event.preventDefault();
                                setActiveUser(admin);
                            }}
                        >Admin Profile</button>
                        }
                </div>
                

                <div style={{display:'flex'}}>
                    <div style={{marginLeft:'15px'}}>Email: {activeUser.email}</div>

                    <div style={{display:'flex', marginLeft:'25px'}}>
                        <div>Member since:</div>
                        <RetrieveTimestamp date={activeUser.joinedDate} />
                    </div>

                    <div style={{marginLeft:'25px'}}>Reputation: {activeUser.reputationValue}</div>
                    
                </div>

            </div>

            {/* the listings text box */}
            <div 
                style={{borderBottom:'medium gray dotted', display:'flex', 
                alignItems:'center', justifyContent:'space-between',
                padding:'0px 10px'}}
                >
                <h3 style={{paddingLeft:'10px'}}>Listings: {currentListing}</h3>

                {/* start of buttons */}
                <div style={{textAlign:'right', display:'flex', gap:'5px'}}>
                    <button
                        style={{cursor:'pointer'}}
                        onClick={(event)=>{
                            event.preventDefault();
                            setCurrentListing('communities');
                        }}>Communities</button>

                    <button
                        style={{cursor:'pointer'}}
                        onClick={(event)=>{
                            event.preventDefault();
                            setCurrentListing('posts');
                        }}>Posts</button>

                    <button
                        style={{cursor:'pointer'}}
                        onClick={(event)=>{
                            event.preventDefault();
                            setCurrentListing('comments');
                        }}>Comments</button>

                    {(activeUser == admin) &&
                        <button
                        style={{cursor:'pointer'}}
                        onClick={(event)=>{
                            event.preventDefault();
                            setCurrentListing('users');
                        }}>Users</button>}
                    {/* end of buttons */}
                </div>
            </div>

            {/* the actual listings content */}
            <div>
                <PrintListings activeUser={activeUser}
                                setActiveUser={setActiveUser}
                                admin={admin}
                                users={users}
                                posts={posts} 
                                communities={communities} 
                                comments={comments}
                                currentListing={currentListing}
                                setCurrentListing={setCurrentListing}
                                setActiveCommunity={setActiveCommunity}
                                setActivePost={setActivePost}
                                setActiveView={setActiveView}
                                setActiveComment={setActiveComment}
                                triggerDataRefresh={triggerDataRefresh} />

            </div>


        </div>
    );
}

function PrintListings({activeUser, setActiveUser, admin, 
                        users, posts, communities, comments, 
                        currentListing, setCurrentListing,
                        setActiveCommunity, setActivePost,
                        setActiveView, setActiveComment,
                        triggerDataRefresh}){

    //filtering what we want
    let list = [];

    
    if (currentListing ==='posts'){
        list = posts.filter((post)=>post.postedBy===activeUser.displayName);
    }
    else if (currentListing === 'communities'){
        // console.log('active user:', activeUser.displayName);
        // console.log('communities:', communities);
        // console.log('creators:',communities.filter((community)=>community.creator === activeUser.displayName));
        list = communities.filter((community)=>community.creator=== activeUser.displayName);
    }
    else if (currentListing === 'comments'){
        // console.log('active user2:', activeUser.displayName);
        list = comments.filter((comment)=>comment.commentedBy === activeUser.displayName);
    }
    else if ((activeUser == admin) && (currentListing ==='users')){
        list = users;
    }

    // console.log('list:',list);
    // console.log('list communities:', list.map((community)=>community.name));

    const findParentPost = (comment)=>{
        return posts.find((post)=>post.commentIDs.includes(comment._id));
    }

    const findParentComment = (comments, childComment)=>{
        
        for (const testComment of comments){
            if (testComment.commentIDs.includes(childComment._id)){
                return testComment;
            }
        }    
    };

    const handleDeleteUser = async (selectedUser) =>{

        const userConfirmed = window.confirm(
            `Are you sure you want to delete the user "${selectedUser.displayName}"? This action cannot be undone. Doing so will also delete all communities, posts, comments, and replies belonging to the user.`
        );

        if (!userConfirmed){
            return; //since the user doesn't wanna dletee the community, we're gonna just return from the function
        }

        //first, let's delete all comments that the user authored
        const userComments = comments.filter((comment)=>comment.commentedBy === selectedUser.displayName);
        //now, for all the comments in this array, delete the comment itself, and take it out of the parent post/comment's commentIDs array
        for (const selectedComment of userComments){
            const parentPost = findParentPost(selectedComment);

            try{
                await axios.delete(`http://localhost:8000/api/comments/${selectedComment._id}`);
            } catch (error){
                console.error('Failed to delete comment');
            }
            if (parentPost){
                const parentPostCommentIDs = parentPost.commentIDs.filter((commentID)=>commentID!==selectedComment._id);
    
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
                const parentComment = findParentComment(comments, selectedComment);
    
                if (parentComment){
                    const parentCommentCommentIDs = parentComment.commentIDs.filter((commentID)=>commentID!==selectedComment._id);
    
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
        }

        //now let's delete all posts that were posted by the user
        const userPosts = posts.filter((post)=>post.postedBy === selectedUser.displayName);
        //now, for all posts in this array, delete those posts
        for (const selectedPost of userPosts){
            //we'll have to delete the post from the community it was osted in
            const postCommunity = communities.find((community)=>community.postIDs.includes(selectedPost._id));

            try{
                await axios.delete(`http://localhost:8000/api/posts/${selectedPost._id}`);
                // triggerDataRefresh();
            } catch(error){
                console.error('Failed to delete post');
            }
            //now updating it's community's postIDs array
            const postCommunityPostIDs = postCommunity.postIDs.filter((postID)=>postID!==selectedPost._id);

            //update that community
            try{
                const updatedCommunityData = {
                    communityID: postCommunity.communityID,
                    name: postCommunity.name,
                    description: postCommunity.description,
                    postIDs: postCommunityPostIDs,
                    startDate: postCommunity.startDate,
                    members: postCommunity.members,
                    creator: postCommunity.creator,
                };
                await axios.put(`http://localhost:8000/api/communities/${postCommunity._id}`, updatedCommunityData);
            } catch(error){
                console.error('Failed to update community');
            }

        }

        //lastly, let's delete all communities that the user creates
        const userCommunities = communities.filter((community)=>community.creator === selectedUser.displayName);
        for (const selectedCommunity of userCommunities){
            try{
                await axios.delete(`http://localhost:8000/api/communities/${selectedCommunity._id}`);
                // triggerDataRefresh();
            } catch(error){
                console.error('Failed to delete community');
            }
        }

        //now, since we're done with deleting all comments, posts and communities create
        //by the user, et's delete the user itself
        try{
            await axios.delete(`http://localhost:8000/api/users/${selectedUser._id}`);
            // triggerDataRefresh();
        } catch(error){
            console.error('Failed to delete user');
        }

        triggerDataRefresh();
        setActiveUser(admin);
        setActiveView('user-profile');
        return;
    };

    return(
        <div>
            {(currentListing === 'posts') &&
                <div>
                    {(list.length > 0) ? (
                        list.map((post)=>(
                            <div key={post._id}
                                style={{padding:'10px 20px', borderBottom:'thin black dotted', fontSize:'18px', cursor:'pointer'}}
                                onClick={(event)=>{
                                    event.preventDefault();
                                    setActivePost(post);
                                    // setActiveCommunity(getCommunity(post));
                                    setActiveView('modify-post');
                                }}
                                >
                                {post.title}
                            </div>
                        ))

                    ) : (<p style={{paddingLeft:'15px'}}>No posts found</p>)
                    }
                </div>
            }

            {(currentListing === 'communities') &&
                <div>
                    {/* <p>communities ka listing</p> */}
                    {(list.length>0) ? (
                        list.map((community)=>(
                            <div key={community._id}
                                style={{padding:'10px 20px', borderBottom:'thin black dotted', fontSize:'18px', cursor:'pointer'}}
                                onClick={(event)=>{
                                    event.preventDefault();
                                    setActiveCommunity(community);
                                    setActiveView('modify-community');
                                }}>
                                {/* <div>hi</div> */}
                                {community.name}
                            </div>
                        )
                        )) : (<p style={{paddingLeft:'15px'}}>No communities found</p>)
                    }
                    
                </div>
            }

            {(currentListing === 'comments') &&
                <div>
                    {(list.length>0) ? (
                        list.map((comment)=>{
                            let parentPost = FindParentPost(posts, comments, comment);
                            return(
                                <div key={comment._id}
                                    style={{padding:'10px 20px', borderBottom:'thin black dotted', cursor:'pointer'}}
                                    onClick={(event)=>{
                                        event.preventDefault();
                                        setActiveComment(comment);
                                        setActiveView('modify-comment');
                                    }}
                                    >
                                    <div style={{fontSize:'17px', fontWeight:'bold'}}>{ parentPost ? parentPost.title : 'No parent post'}</div>
                                    <div style={{paddingLeft:'30px'}}>{comment.content.slice(0,20)}...</div>
                                </div>

                            );
                        })

                        ) : (<p style={{paddingLeft:'15px'}}>No comments found</p>)
                    }
                </div>
            }

            {(currentListing ==='users') &&
                <div>
                    {(list.length>0) ? (
                        list.map((user)=>(
                            <div key={user._id}
                                style={{padding:'0px 20px', borderBottom:'thin black dotted', cursor:'pointer'}}
                                onClick={(event)=>{
                                    event.preventDefault();
                                    setActiveUser(user);
                                    setCurrentListing('posts');
                                }}
                                >
                                <div 
                                    style={{display:'flex', justifyContent:'space-between', alignContent:'center'}}>
                                    <h3 style={{marginBottom:'0px'}}>{user.displayName}</h3>
                                    <button
                                        style={{marginTop:'10px', cursor:'pointer', borderRadius:'14px', backgroundColor:'lightgray'}}
                                        onClick={(event)=>{
                                            event.preventDefault();
                                            handleDeleteUser(user);
                                        }}
                                        >Delete User</button>
                                </div>
                                
                                <div style={{display:'flex'}}>
                                    <p style={{marginRight:'40px'}}>Email address: {user.email}</p>
                                    <p>Reputation: {user.reputationValue}</p>
                                </div>

                            </div>
                        ))
                    ) : (<p style={{paddingLeft:'15px'}}>No users found</p>)}
                </div>
            }

        </div>

    );

}


function FindParentPost(posts, comments, requiredComment){

    const post = posts.find((p) => p.commentIDs.includes(requiredComment._id));
    // console.log('found post:', post);
    if (post){
      return post;
    }
    else{
      for (const comment of comments){
        if (comment.commentIDs.includes(requiredComment._id)){
          return FindParentPost(posts, comments, comment);
        }
      }

    }

    return null;

  }