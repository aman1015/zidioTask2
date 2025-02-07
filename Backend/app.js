const express=require("express");
require("dotenv").config();
const app=express();
require('./conn/conn')
const cors=require("cors");
const UserAPI=require("./routes/user")
const TaskAPI=require("./routes/task")
app.use(cors());
app.use(express.json());
app.use("/api/v1", UserAPI);
app.use("/api/v2", TaskAPI);
app.use("/", (req, res) => {
  res.send("hello from server");
});
const PORT=1000;
app.listen(PORT,()=>{
    console.log("server is started at "+ PORT);
    
});

