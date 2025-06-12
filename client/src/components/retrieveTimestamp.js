

export default function RetrieveTimestamp({date}){

    //ensuring the date is a Date object
    const post_time_date = new Date(date);

    if (isNaN(post_time_date)){
      return <div>Invalid date</div>;
    }

    const current_time = new Date();  
    const post_time = Math.abs(current_time - post_time_date);  
    
    //calculating the individual values to later compare with zero and print accordingly
    const seconds_post_time = Math.floor(post_time/1000);
    const minutes_post_time = Math.floor(seconds_post_time/60);
    const hours_post_time = Math.floor(minutes_post_time/60);
    const days_post_time = Math.floor(hours_post_time/24);
    const months_post_time = Math.floor(days_post_time/30);
    const years_post_time = Math.floor(months_post_time/12);

    if(years_post_time > 0){
        return <div style={{paddingLeft:'5px'}}>{years_post_time} year(s) ago</div>;
      }
    if(months_post_time > 0){
        return <div style={{paddingLeft:'5px'}}>{months_post_time} month(s) ago.</div>;
      }
    if(days_post_time > 0){
        return <div style={{paddingLeft:'5px'}}>{days_post_time} days ago.</div>;
      }
    if(hours_post_time > 0){
        return <div style={{paddingLeft:'5px'}}>{hours_post_time} hours ago.</div>;
      }
    if(minutes_post_time > 0){
        return <div style={{paddingLeft:'5px'}}>{minutes_post_time} minutes ago.</div>;
      }
    return <div style={{paddingLeft:'5px'}}>{seconds_post_time} seconds ago.</div>;
    
}