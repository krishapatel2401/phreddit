export default function RetrieveCommunityName({post, communities}){

    // console.log('post id',post._id);
    // communities.map((community)=>{
    //     console.log('community post ids',community.postIDs);
    // });

    const community = communities.find((community) => 
        community.postIDs.includes(post._id)
    );

    return (
        <div >
            {community ? community.name : 'Unknown Community'}
        </div>
    )

}