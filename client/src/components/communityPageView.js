import '../stylesheets/App.css';
import upArrow from '../stylesheets/up arrow.png';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import RetrieveTimestamp from './retrieveTimestamp';
// import RetrieveCommunityName from './retrieveCommunityName';
import RetrieveLinkFlair from './retrieveLinkFlair';

export default function CommunityPageView({community, posts, comments, linkflairs, setActiveView, setActivePost, activeUser, triggerDataRefresh}){

    //filtering posts
    posts = posts.filter((post)=>community.postIDs.includes(post._id));
    
    let [orderDesired, setOrderDesired] = useState('n');
    const [orderedPosts, setOrderedPosts] = useState([]);

    useEffect(() => {
        // Sort posts whenever `orderDesired` changes
        let sortedPosts = [...posts];
        if (orderDesired === 'n') {
            sortedPosts.sort((a, b) => {
                let aDate = new Date(a.postedDate);
                let bDate = new Date(b.postedDate);
                return bDate - aDate;
        });
        } 
        else if (orderDesired === 'o') {
            sortedPosts.sort((a, b) => {
                let aDate = new Date(a.postedDate);
                let bDate = new Date(b.postedDate);
                return aDate - bDate;
        });
        }
        else if (orderDesired === 'a'){
            sortedPosts.sort((a,b)=>{
                const most_recent_a = most_recent_comment_date(a, comments);
                const most_recent_b = most_recent_comment_date(b, comments);
                return most_recent_b - most_recent_a;

            });
        }
        setOrderedPosts(sortedPosts);
    }, [orderDesired, posts]);

    // if ((!orderedPosts) || (orderedPosts.length===0)){
    //     return <div>No post data available</div>;
    // }

    const most_recent_comment_date = (post, comments_array)=>{

        //filtering comments based on whether they belong to a post or not
        let post_comments = comments_array.filter(comment => post.commentIDs.includes(comment._id));
        
        //if there aren't any comments on the post, return a really really old date
        if (post_comments.length === 0){
          return new Date(0);
        }
      
        //getting the most recent date out of all the comment's dates
        let most_recent_date = new Date(Math.max(...post_comments.map(p_comment => new Date(p_comment.commentedDate))));
      
        return most_recent_date;
    }

    const handlePostClick = (post)=>{

        axios.put(`http://localhost:8000/api/posts/${post._id}/views`)
            .then(response=>{
                console.log('View count updated:',response.data);
            })
            .catch(error=>{
                console.error('Error updating view count:', error);
            });
        // post.views+=1;
        setActiveView('post');
        setActivePost(post);       
    };

    const handleLeaveCommunity = async () => {

        const targetMember = activeUser.displayName;

        const newCommunityMembers = community.members.filter(member => member !== targetMember);

        // const newCommunityPostIDs = newCommunity.postIDs.filter((postID)=>postID!==post._id);

        try{
            const updatedOriginalData = {
                communityID: community.communityID,
                name: community.name,
                description: community.description,
                postIDs: community.postIDs,
                startDate: community.startDate,
                members: newCommunityMembers,
                creator: community.creator,
            };
            const updatedCommunity = await axios.put(`http://localhost:8000/api/communities/${community._id}`, updatedOriginalData);
        } catch(error){
            console.error('Failed to update community');
        }

        triggerDataRefresh();

    };

    const handleJoinCommunity = async () => {

        const targetMember = activeUser.displayName;

        const newCommunityMembers = [...community.members, targetMember];

        // const newCommunityPostIDs = newCommunity.postIDs.filter((postID)=>postID!==post._id);

        try{
            const updatedOriginalData = {
                communityID: community.communityID,
                name: community.name,
                description: community.description,
                postIDs: community.postIDs,
                startDate: community.startDate,
                members: newCommunityMembers,
                creator: community.creator,
            };
            const updatedCommunity = await axios.put(`http://localhost:8000/api/communities/${community._id}`, updatedOriginalData);
        } catch(error){
            console.error('Failed to update community');
        }

        triggerDataRefresh();

    };

    // console.log("active user in the community memebers list:",community.members.includes(activeUser.displayName));

    return(
        <div>
            {/* {!activePost && ( */
                    // community page header 
                    <div style={{borderBottom:'1px solid black'}}>
                        <div 
                            className='home-view-header' 
                            style={{borderBottom:'none'}}
                            >
                                <h2 style={{paddingLeft:'15px'}}>{community.name}</h2>

                                {/* sorting buttons */}
                                <div
                                    className='button' 
                                    style={{display:'flex', justifyContent:'flex-end',gap:'5px',paddingRight:'5px'}}
                                    >
                                        <button
                                            onClick={(event)=>{
                                                event.preventDefault();
                                                setOrderDesired('n');
                                                console.log('newest button clicked');
                                            }}>Newest</button>
                                        <button
                                            onClick={(event)=>{
                                                event.preventDefault();
                                                setOrderDesired('o');
                                            }}>Oldest</button>
                                        <button
                                            onClick={(event)=>{
                                                event.preventDefault();
                                                setOrderDesired('a');
                                            }}>Active</button>

                                </div>

                        </div>

                        {/* community description  */}
                        <p style={{marginTop:'10px', marginBottom:'3px', paddingLeft:'15px'}}>{community.description}</p>

                        {/* community timestamp and creator  */}
                        <div style={{display:'flex', alignItems:'center'}}>
                            <div style={{marginBottom:'3px', paddingLeft:'15px', display:'flex', alignItems:'center', marginRight:'25px'}}>
                                <p>Created: </p>
                                <RetrieveTimestamp date={community.startDate} />
                            </div>

                            <div>Created by: {community.creator}</div>
                        </div>
                        

                        {/* community post count  */}
                        <div style={{display:'flex'}}>
                            <p style={{paddingLeft:'15px'}}>Post count: {community.postIDs.length}</p>
                            <p style={{paddingLeft:'30px'}}>Member count: {community.members.length}</p>

                        </div>

                        {/* button for the member of the community */}

                        <div style={{display:'flex'}}>

                            { activeUser && community.members.includes(activeUser.displayName) &&

                                <button 
                                    style={{borderRadius:'15px', padding:'0 8px', cursor:'pointer'}}
                                    onClick={(event)=>{
                                        event.preventDefault();
                                        handleLeaveCommunity();
                                    }}
                                > Leave Community
                                </button>
                            }

                            { activeUser && !community.members.includes(activeUser.displayName) &&

                                <button     
                                    style={{borderRadius:'15px', padding:'0 8px', cursor:'pointer'}}
                                    onClick={(event)=>{
                                    event.preventDefault();
                                    handleJoinCommunity();
                                    }}
                                > Join Community
                                </button>
                            }                       
                        </div>
                        
                        
                    </div>
                }

            {/*community page post content*/}
            <div style={{display:'block'}}>
                {orderedPosts.map(post=>(
            
                <div 
                    key={post.postID}
                    style={{paddingLeft:'15px', paddingBottom:'10px', borderBottom:'thin dotted black', cursor:'pointer'}}
                    onClick={(event)=>{
                        event.preventDefault();
                        {post.views +=1}
                        handlePostClick(post);
                    }}
                    >
                    <div style={{display:'flex', alignItems:'center'}}>
                        <p style={{marginRight:'5px'}}>{post.postedBy}</p>
                        {'|'}
                        <p><RetrieveTimestamp date={post.postedDate} /></p>
                    </div>
                    

                    <p style={{marginBottom:'3px', marginTop:'5px',fontSize: '18px', fontWeight: 'bold'}}>{post.title}</p>

                    <p style={{marginBottom:'3px', marginTop:'8px'}}><RetrieveLinkFlair post={post} linkflairs={linkflairs}/></p>

                    <p style={{marginBottom:'3px', marginTop:'8px'}}>
                            {post.content.length > 80 ?
                            `${post.content.substring(0, 80)}...` : post.content}</p>

                    <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
                        <p style={{marginBottom:'3px', marginRight: '20px'}}>View Count: {post.views}</p>
                        <p style={{marginBottom:'3px', marginRight: '20px'}}>Current Comment count: {post.commentIDs.length}</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '5px', alignItems:'center' }}>
                                <img style={{height:'17px', width:'auto'}}
                                    src={upArrow} alt='upvotes-arrow'
                                    />
                                <div style={{ marginLeft: '5px' }}>Upvote count: {post.upvotes}</div>
                            </div>
                    </div>
                    

                    
            </div>
            

            
        ))}

        
        
    </div>

        </div>

    );
}