const mongoose=require("mongoose");

const conn=async()=>{
    try{
        const response = await mongoose.connect(`${process.env.MONGO_URI}`)
        
        if(response){
      console.log("DB is conneted");
      
        }
    }catch(e){
   console.log("error while connecting"+e);
   
    }
}
conn();
//db pass dBA1kWFHkFnjNfQQ