import '../stylesheets/App.css';
import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function NewCommunityPageView({activeUser, communities, setCommunities, setActiveView, setActiveCommunity}){

    //states for input values
    const [communityName, setCommunityName] = useState('');
    const [description, setDescription] = useState('');

    //states for errors
    const [nameError, setNameError] = useState(false);
    const [nameExistsError, setNameExistsError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);

    
    const handleCreateCommunity = async () =>{
        let hasError = false;

        if (communityName.trim()===''){
            setNameError(true);
            hasError = true;
        }
        else{
            setNameError(false);
        }

        let nameExists = await checkNameExists();
        if (nameExists){
            setNameExistsError(true);
            hasError = true;
        }
        else{
            setNameExistsError(false);
        }

        if (description.trim() === ''){
            setDescriptionError(true);
            hasError = true;
        }
        else{
            setDescriptionError(false);
        }


        if (hasError){
            alert('There is an error in 1 or more fields.');
        }
        else{
            //since all inputs are alright, create the community
            const newCommunity = {
                communityID: `community${communities.length+1}`,
                name: communityName,
                description: description,
                postIDs: [],
                startDate: new Date(),
                members: [activeUser.displayName],
                creator: activeUser.displayName,
            };

            console.log('new community', newCommunity);

            //adding the newly formed community to our model
            console.log('communities before dding new', communities);

            try{
                //sending a POST request to the server at the /api/communities endpoint
                //the newCommunity object is passed as the request body, to send it as json
                const response = await axios.post('http://localhost:8000/api/communities', newCommunity);
                //response from the server was stored in response, it will have the saved community
                //using this data to update the commnuities
                setCommunities((prev)=>[...prev, response.data]);
                // alert('community created successfully!');
            } catch (error){
                console.error('Error creating community:', error);
            }

            console.log('communities after adding new', communities);

            // //clearing input values
            setCommunityName('');
            setDescription('');

            // //show the newly created community page and hide the create community page
            setActiveView('community');
            setActiveCommunity(newCommunity);
            // setActivePost(null);
                        
        
        }

    };

    const checkNameExists = async () =>{
        try{
            const response = await axios.post('http://localhost:8000/api/check-community',{
                communityName: communityName,
            });
            return response.data.exists;
        } catch(error){
            console.error('Error checking community name existence');
            return false;
        }
    };

    return (
        <div >

            <h2 style={{paddingLeft:'20px', paddingBottom:'20px', borderBottom:'thin black solid'}}>Create a Community</h2>

            <p  id="name_question"
                style={{fontWeight:'bold', marginBottom:'5px', marginTop:'20px', marginLeft:'20px'}}
                > Enter community name
            </p>
            <input type="text"
                style={{width:'210px', borderRadius:'10px', border: 'thin solid black', padding:'5px', marginLeft:'20px'}}
                value={communityName}
                onChange={(e)=>setCommunityName(e.target.value)}
                maxLength={100}
                placeholder="(text input of max 100 characters)" 
            />
            {nameError && <p style={{color:'red', fontSize:'small', marginLeft:'20px'}}>*Error: Community name cannot be empty!</p>}
            {nameExistsError && <p style={{color:'red', fontSize:'small', marginLeft:'20px'}}>*Error: A community with the same name already exists!</p>}
            
            <br />

            <p  id="description_question"
                style={{fontWeight:'bold', marginBottom:'5px', marginLeft:'20px', marginTop:'25px'}}
                > Enter community description
            </p>
            <input type="text"
                style={{width:'210px', borderRadius:'10px', border: 'thin solid black', padding:'5px', marginLeft:'20px'}}
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                maxLength={500}
                placeholder="(text input of max 500 characters)"
            />
            {descriptionError && <p style={{color:'red', fontSize:'small', marginLeft:'20px'}}>*Error: Community description cannot be empty!</p>}


            <br />
            <br />

            <button
                style={{width:'175px', marginTop:'20px',marginBottom:'20px',
                    cursor:'pointer', borderRadius:'18px', marginLeft:'40px',
                    backgroundColor:'lightgray'}}
                onClick={handleCreateCommunity}
                >
                Engender Community
            </button>


        </div>
    );
}