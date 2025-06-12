import '../stylesheets/App.css';
import React, {useState , useEffect} from 'react';
import axios from 'axios';

export default function ModifyPostPage({activeUser, post, communities, linkflairs, setLinkFlairs, setActiveView, triggerDataRefresh}){

    //states for input values
    const [selectOption, setSelectOption] = useState(communities.find((community)=> community.postIDs.includes(post._id)).name); //the community name
    const [postTitleInput, setPostTitleInput] = useState(post.title);
    const [linkFlairOption, setLinkFlairOption] = useState(linkflairs.find((linkflair)=>linkflair._id===post.linkFlairID)? 
                                                linkflairs.find((linkflair)=>linkflair._id===post.linkFlairID).content : '');
    const [isCreatingNewLf, setIsCreatingNewLf] = useState(false);
    const [newLinkFlair, setNewLinkFlair] = useState('');
    const [postContentInput, setPostContentInput] = useState(post.content);

    //states for errors
    const [postTitleError, setPostTitleError] = useState(false);
    const [postContentError, setPostContentError] = useState(false);

    const sortedCommunities = React.useMemo(()=>{
        if (!activeUser){
            return communities;
        }

        const joinedOrder = communities.filter((community)=>
            community.members.includes(activeUser.displayName)
        );
        console.log('joined order:', joinedOrder);

        const otherOrder = communities.filter((community)=>
            !community.members.includes(activeUser.displayName)
        );
        console.log('other order:', otherOrder);

        return [...joinedOrder, ...otherOrder];

    },[activeUser, communities]);


    const handleSelectOption = (event) => {
        setSelectOption(event.target.value);
    };

    const handlePostTitleInput = (event) => {
        setPostTitleInput(event.target.value);
    };

    const handleLinkFlairOption = (event) => {
        const value = event.target.value;
        setLinkFlairOption(value);
        // console.log('setlinkflairoption:', value);
        // console.log('worse than hitler?', 'Worse than Hitler'===value);
        setIsCreatingNewLf(value === 'new-lf');
    };

    const handleNewLinkFlairChange = (event) => {
        setNewLinkFlair(event.target.value);
    };

    const handlePostContent = (event) => {
        setPostContentInput(event.target.value);
    };

    // const handleUsername = (event) => {
    //     setUsernameInput(event.target.value);
    // };

    const handleNewLinkFlair = async () => {
        if (newLinkFlair) {
            const newLf = {
                linkFlairID: `l${linkflairs.length + 1}`,
                content: newLinkFlair,
            };

            // model.data.linkFlairs.push(newLf);

            try{
                //sending POST request to the server
                //newLLf object is passed as request body, to send it as JSON
                const response = await axios.post('http://localhost:8000/api/linkflairs', newLf);
                //response from server stored in resposne will have the saved post
                //use this data to update the linkflairs
                setLinkFlairs((prev)=>[...prev, response.data]);                
            } catch(error){
                console.error('Error creating linkflair:', error);
            }

            //clearing out states we made for linkflairs
            setLinkFlairOption(newLinkFlair);
            setIsCreatingNewLf(false);
            setNewLinkFlair('');
        }
    };

    const handleUpdatePost = async (event) => {

        event.preventDefault();

        let hasError = false;

        if (!selectOption || !postTitleInput || !postContentInput ) {
            alert('Please fill in all required fields.');
            return;
        }

        if (postTitleInput.trim() ===''){
            setPostTitleError(true);
            hasError = true;
        }
        else{
            setPostTitleError(false);
        }

        if (postContentInput.trim() === ''){
            setPostContentError(true);
            hasError = true;
        }
        else{
            setPostContentError(false);
        }

        let selectedLinkFlairID = '';
        if (linkFlairOption === 'new-lf') {
            selectedLinkFlairID = `l${linkflairs.length + 1}`;
        } else if (linkFlairOption) {
            const selectedLinkFlair = linkflairs.find((lf) => lf.content === linkFlairOption);
            selectedLinkFlairID = selectedLinkFlair ? selectedLinkFlair._id : '';
        }

        if (hasError){
            return;
        }

        else{

        //adding the newly formed post to our posts collection in database
        try{
            const updatedData = { //update this lne

                postID: post.postID,
                title: postTitleInput,
                content: postContentInput,
                linkFlairID: selectedLinkFlairID,
                postedBy: post.postedBy,
                postedDate: post.postedDate,
                commentIDs: post.commentIDs,
                views: post.views,
                upvotes: post.upvotes
                // communityName: selectOption, 
            };

            const updatedPost = await axios.put(`http://localhost:8000/api/posts/${post._id}`, updatedData);
            // triggerDataRefresh();

        } catch (error){
            console.error('Error modifying post:', error);
        }

        const originalCommunity = communities.find((community)=>community.postIDs.includes(post._id));
        const newCommunity = communities.find((community)=>community.name===selectOption);

        if(originalCommunity!= newCommunity){
            //if they want the post to be in a different community now
            const originalCommunityPostIDs = originalCommunity.postIDs.filter((postID)=>postID!==post._id);

            //update that community
            try{
                const updatedOriginalData = {
                    communityID: originalCommunity.communityID,
                    name: originalCommunity.name,
                    description: originalCommunity.description,
                    postIDs: originalCommunityPostIDs,
                    startDate: originalCommunity.startDate,
                    members: originalCommunity.members,
                    creator: originalCommunity.creator,
                };
                const updatedCommunity = await axios.put(`http://localhost:8000/api/communities/${originalCommunity._id}`, updatedOriginalData);
            } catch(error){
                console.error('Failed to update community');
            }

            //now add the postID to the new selected community
            try{
                await axios.put(`http://localhost:8000/api/communities/${newCommunity._id}`,{
                    $push: {postIDs: post._id}
                });
                console.log('updated original and new community ka postIDs');
            } catch(error){
                console.error('error adding the new post ID to the community post ID array');
            }
            
        }

        triggerDataRefresh();


        //clearing out input values
        setSelectOption('');
        setPostTitleInput('');
        setLinkFlairOption('');
        setNewLinkFlair('');
        setPostContentInput('');
        // setUsernameInput('');

        //going to the home page view
        setActiveView('user-profile');

    }

    };


    const handleDeletePost = async () =>{

        //on deleting a post, we'll also have to dleete it from it's community's list
        const postCommunity = communities.find((community)=>community.postIDs.includes(post._id));

        const userConfirmed = window.confirm(
            `Are you sure you want to delete the post "${post.title}"? This action cannot be undone. Doing so will also delete all comments and replies belonging to the post`
        );

        if (!userConfirmed){
            return; //since the user doesn't wanna dletee the post, we're gonna just return from the function
        }

        try{
            await axios.delete(`http://localhost:8000/api/posts/${post._id}`);
            // triggerDataRefresh();
        } catch(error){
            console.error('Failed to delete post');
        }

        //now updating it's community's postIDs array
        const postCommunityPostIDs = postCommunity.postIDs.filter((postID)=>postID!==post._id);

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
                const updatedCommunity = await axios.put(`http://localhost:8000/api/communities/${postCommunity._id}`, updatedCommunityData);
            } catch(error){
                console.error('Failed to update community');
            }

        triggerDataRefresh();
        setActiveView('user-profile');


    };

    return(

        <div id='parent-element' >

            {/* //header of the page */}
            <h2 style={{paddingTop: '5px', paddingLeft:'15px', fontWeight: 'bold'}}>
                Create a New Post
            </h2>

            <hr />

            <div id="body-elements" style={{paddingLeft:'15px'}}>
                <form onSubmit={handleUpdatePost}>
                    {/* Selecting a community */}
                    <div>
                        <label htmlFor="select-community"
                            style={{marginRight:'10px'}}
                            >Select a Community:</label>
                        <select
                            id="select-community"
                            value={selectOption}
                            onChange={handleSelectOption}
                            style={{ padding: '5px', marginTop: '5px', borderRadius:'10px'}}
                            required
                        >
                            <option value="">Choose a Community</option>
                            {sortedCommunities.map((community, index) => (
                                <option key={index} value={community.name}>
                                    {community.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Entering the Post Title */}
                    <div>
                        <label htmlFor="post-title">Enter a Post Title:</label>
                        <input
                            id="post-title"
                            type="text"
                            value={postTitleInput}
                            onChange={handlePostTitleInput}
                            required
                            maxLength={100}
                            placeholder="Enter the Title here..."
                            style={{ marginTop: '5px', margin: '10px', borderRadius:'10px', padding:'5px'}}
                        />
                        {postTitleError && <p style={{color:'red', fontSize:'small', marginLeft:'20px'}}>*Error: Post title cannot be empty!</p>}
                    </div>

                    {/* Selecting link flair */}
                    <div>
                        <label htmlFor="select-linkflair"
                            style={{marginRight:'10px'}}
                            >Select a Link Flair:</label>
                        <select
                            id="select-linkflair"
                            value={linkFlairOption}
                            onChange={handleLinkFlairOption}
                            style={{ padding: '5px', marginTop: '5px', borderRadius:'10px'}}
                        >
                            <option value="">Choose a Link Flair or Create a New one:</option>
                            {linkflairs.map((linkflair, index) => (
                                <option key={index} value={linkflair.content}>
                                    {linkflair.content}
                                </option>
                            ))}
                            <option value="new-lf">Create a New Link Flair</option>
                        </select>

                        {isCreatingNewLf && (
                            <div style={{marginTop:'8px'}}>
                                <label>Enter a New Link Flair:</label>
                                <input
                                    id="new-link-flair"
                                    type="text"
                                    value={newLinkFlair}
                                    onChange={handleNewLinkFlairChange}
                                    maxLength={30}
                                    placeholder="Enter the link flair here..."
                                    style={{ marginTop: '5px', margin: '10px', borderRadius:'10px', padding:'5px'}}
                                />
                                <button type="button" onClick={handleNewLinkFlair}
                                    style={{backgroundColor:'lightgray', borderRadius:'15px',
                                        width:'130px'
                                    }}>
                                    Add New Flair
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Entering the post content */}
                    <div>
                        <label htmlFor="post-content">Enter Post Content:</label>
                        <input
                            id="post-content"
                            type="text"
                            value={postContentInput}
                            onChange={handlePostContent}
                            required
                            placeholder="Enter the Post Content here..."
                            style={{width:'400px', marginTop: '5px', margin: '10px', borderRadius:'10px', padding:'5px'}}
                        />
                        {postContentError && <p style={{color:'red', fontSize:'small', marginLeft:'20px'}}>*Error: Post content cannot be empty!</p>}
                    </div>

                    <button type="submit"
                        style={{ marginTop:'15px', marginLeft:'25px', padding:'5px 10px',
                            borderRadius:'15px', backgroundColor:'lightgray',
                            cursor:'pointer'}}
                        >Update Post</button>

                    <button
                        style={{ marginTop:'15px', marginLeft:'25px', padding:'5px 10px',
                            borderRadius:'15px', backgroundColor:'lightgray',
                            cursor:'pointer'}}
                            onClick={(event)=>{
                                event.preventDefault();
                                handleDeletePost();
                            }}
                        >
                        Delete Post
                    </button>
                </form>
            </div>
        </div>

    );
}