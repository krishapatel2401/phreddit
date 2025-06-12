import '../stylesheets/App.css';
import upArrow from '../stylesheets/up arrow.png';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import RetrieveTimestamp from './retrieveTimestamp';
import RetrieveCommunityName from './retrieveCommunityName';
import RetrieveLinkFlair from './retrieveLinkFlair';

export default function HomePageView({posts, comments, communities, linkflairs, activeUser, setActiveView, setActivePost}){

    let [orderDesired, setOrderDesired] = useState('n');
    const [orderedPosts, setOrderedPosts] = useState([]); 
    const [firstList, setFirstList] = useState([]); //this will be our first list, in case the user is registered
    const [secondList, setSecondList] = useState([]); //this will be the second list

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
        // if (activeUser){
        //     makeTwoLists();
        // }
    }, [orderDesired, posts]);

    useEffect (()=>{
        //updating our first and second lists whenever the original ordered list changes
        if (activeUser){
            makeTwoLists();
        }
    }, [orderedPosts, activeUser]);

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

    const getCommunity = (post) =>{
        let community = communities.find((community)=>community.postIDs.includes(post._id));
        // console.log(community.members);
        // console.log('includes "astyanax":',community.members.includes('astyanax'));
        // console.log('active user display name:', activeUser.displayName);
        return community;
    };

    const makeTwoLists = () =>{
        let first = orderedPosts.filter((post)=>{
            return getCommunity(post).members.includes(activeUser.displayName);
        })
        // console.log('first:',first);
        setFirstList(first);
        let second = orderedPosts.filter((post)=>{
            return !getCommunity(post).members.includes(activeUser.displayName);
        })
        // console.log('second:',second);
        setSecondList(second);
    };

    if ((!orderedPosts) || (orderedPosts.length===0)){
        return <div>No post data available</div>;
    }
    

    return(
        <div>

            <div className='home-view-header'>
                <div>
                    <h2 style={{marginLeft: '20px'}}> All Posts </h2>
                    <div style={{marginLeft: '20px', paddingBottom:'10px'}}>{posts.length} posts</div>
                </div>
                
                {/* sorting buttons */}
                <div
                    className='button'
                    style={{display:'flex', justifyContent:'flex-end',gap:'5px',paddingRight:'5px'}}
                    >
                    <button 
                        id="newest-button"
                        onClick={(event)=>{
                            event.preventDefault();
                            setOrderDesired('n');
                            console.log('newest button clicked');
                        }}
                        >Newest</button>
                    <button 
                        id="oldest-button"
                        onClick={(event)=>{
                            event.preventDefault();
                            setOrderDesired('o');
                            console.log('oldest button clicked');
                        }}
                        >Oldest</button>
                    <button 
                        id="active-button"
                        onClick={(event)=>{
                            event.preventDefault();
                            setOrderDesired('a');
                            console.log('active button clicked');
                        }}
                        >Active</button>
                </div>

            {/*end of home view header div */}
            </div> 

            {activeUser ? (
                <div>
                    <PrintPost postsArray={firstList} 
                communities={communities} 
                linkflairs={linkflairs} 
                setActiveView={setActiveView} 
                setActivePost={setActivePost} 
                />

                <div style={{border:"medium gray dotted"}}/>

                    <PrintPost postsArray={secondList} 
                    communities={communities} 
                    linkflairs={linkflairs} 
                    setActiveView={setActiveView} 
                    setActivePost={setActivePost} 
                    />
                </div>

            ) : (
            <PrintPost postsArray={orderedPosts} 
                    communities={communities} 
                    linkflairs={linkflairs} 
                    setActiveView={setActiveView} 
                    setActivePost={setActivePost} 
                    />
                )}


        </div>
    );
}

function PrintPost({postsArray, communities, linkflairs, setActiveView, setActivePost}){

    const handlePostClick = (post)=>{

        axios.put(`http://localhost:8000/api/posts/${post._id}/views`)
            .then(response=>{
                console.log('View count updated:',response.data);
            })
            .catch(error=>{
                console.error('Error updating view count:', error);
            });

        post.views+=1;
        setActiveView('post');
        setActivePost(post);       
    };

    return(

        <div>
                {
                postsArray.map((post)=>(
                    <div key={post.postID}
                    className="post-listing" 
                    style={{ cursor: 'pointer', borderBottom:'thin black dotted', padding:'20px'}}
                    onClick={(event) => {
                        event.preventDefault();
                        handlePostClick(post);                        
                      // Logic to open post view (to be implemented)
                      // alert(`Opening post: ${post.title}`);
                    }}
                    >
                        {/* Post Header */}
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        {/* {console.log('post date', post.postedDate)} */}
                        <RetrieveCommunityName post={post} communities={communities} />
                        {' | '}
                        <span style={{marginRight: '5px', marginLeft: '5px'}}>{post.postedBy}</span>
                        {' | '}
                        <RetrieveTimestamp date={post.postedDate} />
                        </div>
    
                        {/* Post Title */}
                        <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop:'8px', marginBottom:'8px' }}>
                        {post.title}
                        </div>
    
                        {/* Post Flair (if exists) */}
                        <RetrieveLinkFlair post={post} linkflairs={linkflairs}/>
                        {post.flair && (
                        <div style={{ color: 'gray', fontStyle: 'italic' }}>{post.flair}</div>
                        )}
    
                        {/* Post Content (first 80 characters) */}
                        <div style={{ marginTop: '5px' }}>
                            {post.content.length > 80 ?
                            `${post.content.substring(0, 80)}...` : post.content}
                        </div>
    
                        {/* View and Comment Count */}
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '5px', alignItems:'center' }}>
                            <div style={{ marginRight: '20px' }}>Views: {post.views}</div>
                            <div style={{ marginRight: '20px' }}>Comments: {post.commentIDs.length}</div>
                            
                            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '5px', alignItems:'center' }}>
                                <img style={{height:'17px', width:'auto'}}
                                    src={upArrow} alt='upvotes-arrow'
                                    />
                                <div style={{ marginLeft: '5px' }}>Upvote count: {post.upvotes}</div>
                            </div>
                        </div>      

                    </div>
                    ))
                }
            </div>

    );
}