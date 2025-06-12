import '../stylesheets/App.css';
import React, {useState/*, useEffect*/} from 'react';
import axios from 'axios';

export default function NewPostPageView({activeUser, posts, setPosts, communities, linkflairs, setLinkFlairs, setActiveView}){

    //states for input values
    const [selectOption, setSelectOption] = useState(''); //the community name
    const [postTitleInput, setPostTitleInput] = useState('');
    const [linkFlairOption, setLinkFlairOption] = useState('');
    const [isCreatingNewLf, setIsCreatingNewLf] = useState(false);
    const [newLinkFlair, setNewLinkFlair] = useState('');
    const [postContentInput, setPostContentInput] = useState('');
    const [usernameInput, setUsernameInput] = useState('');

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

    const handleSubmit = async (event) => {

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
        }
        else if(linkFlairOption === 'none'){
            selectedLinkFlairID = null;
        }
        else if (linkFlairOption) {
            const selectedLinkFlair = linkflairs.find((lf) => lf.content === linkFlairOption);
            selectedLinkFlairID = selectedLinkFlair ? selectedLinkFlair._id : '';
        }

        if (!hasError){


        const newPost = {
            postID: `p${posts.length + 1}`,
            title: postTitleInput,
            content: postContentInput,
            linkFlairID: selectedLinkFlairID,
            postedBy: activeUser.displayName,
            postedDate: new Date(),
            commentIDs: [],
            views: 0,
            upvotes:0
            // communityName: selectOption, 
        };

        // console.log('newPost at 96:', newPost);

        let createdPostID;

        //adding the newly formed post to our posts collection in database
        try{
            //sending a POST request to the server at the /api/posts endpoint
            //the newPost object is passed as the request body, to send it as json
            console.log('new post at 104:', newPost);
            const response = await axios.post('http://localhost:8000/api/posts', newPost);
            //response from the server was stored in response, it will have the saved community
            //using this data to update the commnuities
            createdPostID = response.data._id;
            setPosts((prev)=>[...prev, response.data]);
            // alert('community created successfully!');
        } catch (error){
            console.error('Error creating post:', error);
        }

        const selectedCommunity = communities.find((community) => 
            community.name === selectOption
        );
        console.log('community found? : ', selectedCommunity);

        console.log('created post id:',createdPostID);

        //update the postIDs array in the community
        try{
            await axios.put(`http://localhost:8000/api/communities/${selectedCommunity._id}`,{
                $push: {postIDs: createdPostID}
            });
            selectedCommunity.postIDs.push(createdPostID);
            console.log('Post id added to the communiy ka post ID list');
        } catch(error){
            console.error('error adding the new post ID to the community post ID array');
        }

        //clearing out input values
        setSelectOption('');
        setPostTitleInput('');
        setLinkFlairOption('');
        setNewLinkFlair('');
        setPostContentInput('');
        // setUsernameInput('');

        //going to the home page view
        setActiveView('home');

    }

    }

    return(
        <div id='parent-element' >

            {/* //header of the page */}
            <h2 style={{paddingTop: '5px', paddingLeft:'15px', fontWeight: 'bold'}}>
                Create a New Post
            </h2>

            <hr />

            <div id="body-elements" style={{paddingLeft:'15px'}}>
                <form onSubmit={handleSubmit}>
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
                            <option value="none">None</option>
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

                    {/* Entering the username
                    <div>
                        <label htmlFor="username">Enter the Username:</label>
                        <input
                            id="username"
                            type="text"
                            value={usernameInput}
                            onChange={handleUsername}
                            required
                            placeholder="Enter Username here..."
                            style={{ marginTop: '5px', margin: '10px' }}
                        />
                    </div> */}

                    <button type="submit"
                        style={{width:'80px', marginTop:'15px', marginLeft:'25px', 
                            borderRadius:'15px', backgroundColor:'lightgray',
                            cursor:'pointer'}}
                        >Submit</button>
                </form>
            </div>
        </div>
    ); 
}


