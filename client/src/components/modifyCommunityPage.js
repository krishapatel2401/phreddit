import '../stylesheets/App.css';
import React, {useState , useEffect} from 'react';
import axios from 'axios';

export default function ModifyCommunityPage({activeUser, community, setActiveCommunity, setActiveView, triggerDataRefresh}){

    //states for input values
    const [communityName, setCommunityName] = useState(community.name);
    const [description, setDescription] = useState(community.description);

    //states for errors
    const [nameError, setNameError] = useState(false);
    const [nameExistsError, setNameExistsError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);

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

    const handleUpdateCommunity = async ()=>{
        let hasError = false;

        if (communityName.trim()===''){
            setNameError(true);
            hasError = true;
        }
        else{
            setNameError(false);
        }

        const nameExists = await checkNameExists();
        if (nameExists && (communityName!==community.name)){
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
            return;
        }
        else{
            // const updatedData = {
            //     communityID: community.communityID,
            //     name: communityName,
            //     description: description,
            //     postIDs: community.postIDs,
            //     startDate: community.startDate,
            //     members: community.members,
            //     creator: community.creator,
            // };

            try{
                const updatedData = {
                    communityID: community.communityID,
                    name: communityName,
                    description: description,
                    postIDs: community.postIDs,
                    startDate: community.startDate,
                    members: community.members,
                    creator: community.creator,
                };
                const updatedCommunity = await axios.put(`http://localhost:8000/api/communities/${community._id}`, updatedData);
                triggerDataRefresh();
            } catch(error){
                console.error('Failed to update community');
            }

            //clearing input values
            setCommunityName('');
            setDescription('');
            // setActiveCommunity(community);
            setActiveView('user-profile')
        }

    };

    

    const handleDeleteCommunity = async ()=>{

        const userConfirmed = window.confirm(
            `Are you sure you want to delete the community "${community.name}"? This action cannot be undone. Doing so will also delete all posts and comments belonging to the community`
        );

        if (!userConfirmed){
            return; //since the user doesn't wanna dletee the community, we're gonna just return from the function
        }

        try{
            await axios.delete(`http://localhost:8000/api/communities/${community._id}`);
            triggerDataRefresh();
        } catch(error){
            console.error('Failed to delete community');
        }

        setActiveView('user-profile');

    };


    return(
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

            <div>
                <button
                    style={{width:'175px', marginTop:'20px',marginBottom:'20px',
                        cursor:'pointer', borderRadius:'18px', marginLeft:'20px',
                        backgroundColor:'lightgray'}}
                    onClick={handleUpdateCommunity}
                    >
                    Update Community
                </button>

                <button
                    style={{width:'175px', marginTop:'20px',marginBottom:'20px',
                        cursor:'pointer', borderRadius:'18px', marginLeft:'40px',
                        backgroundColor:'lightgray'}}
                        onClick={(event)=>{
                            event.preventDefault();
                            handleDeleteCommunity();
                        }}
                    >Delete Community
                </button>


            </div>

            


        </div>

    );
}