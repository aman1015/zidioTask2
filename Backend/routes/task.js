const router=require("express").Router();
const task = require("../models/task");
const Task=require("../models/task");
const User=require("../models/user");
const {authenticateToken}= require("./auth")
//create task api//
router.post("/create-task", authenticateToken,async (req,res)=>{
    try{
  const {title,desc}=req.body;
  const {id}=req.headers;
  const newTask=new Task({title: title, desc: desc});
  const saveTask=await newTask.save();
  const taskId=saveTask._id;
  await User.findByIdAndUpdate(id,{$push: {tasks: taskId._id}});
  res.status(200).json({message: "task created"});
    }catch(e){
 console.log(e);
 res.status(4000).json({message: "internal server error"});
 
    }
});
//get all tasks//
router.get("/get-all-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; // Assuming authenticateToken adds user info

    const userData = await User.findById(id).populate({
      path: "tasks",
      options: { sort: { createdAt: -1 } },
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: userData.tasks }); // Send only tasks, not full user data
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.delete("/delete-task/:id",authenticateToken,async(req,res)=>{
  try{
 const {id}=req.params;
 const userId=req.headers.id;
 await task.findByIdAndDelete(id);
 await User.findByIdAndUpdate(userId, { $pull: { tasks: id } });
 res.status(200).json({message:"task deleted succesfully"})
  }catch(e){
    console.log(e);
    res.status(400).json({message: "internal server error"});
    
  }
});
//update task
router.put("/update-task/:id", authenticateToken,async(req,res)=>{
  try{
    const {id}=req.params;
    const {title,desc}=req.body;
    await Task.findByIdAndUpdate(id,{title:title,desc:desc});
    res.status(200).json({message:"task updated succesfully"})
  }catch(e){
    console.log(e);
  res.status(400).json({message:"internal server error"});
    
  }
});
//update important task//

router.put("/update-imp-task/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const TaskData = await Task.findById(id);
    const ImpTask = TaskData.important;
    await Task.findByIdAndUpdate(id, { important: !ImpTask });
    res.status(200).json({ message: "task update success" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "internal server error" });
  }
});
//update complete task//
router.put("/update-complete-task/:id", authenticateToken,async(req,res)=>{
  try{
    const {id}=req.params;
    const TaskData=await Task.findById(id);
    const completeTask=TaskData.complete;
    await Task.findByIdAndUpdate(id, { complete: !completeTask });
    res.status(200).json({message:"task update success"});
  }catch(e){
    console.log(e);
    res.status(400).json({message: "internal server error"}); 
  }
});
//get all important task
router.get("/get-imp-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; // Assuming authenticateToken adds user info

    const Data = await User.findById(id).populate({
      path: "tasks",
      match:{important:true},
      options: { sort: { createdAt: -1 } },
    });

    if (!Data) {
      return res.status(404).json({ message: "data not found" });
    }

    res.status(200).json({ data: Data.tasks }); // Send only tasks, not full user data
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});
//get complete task
router.get("/get-complete-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; // Assuming authenticateToken adds user info

    const Data = await User.findById(id).populate({
      path: "tasks",
      match: { complete: true },
      options: { sort: { createdAt: -1 } },
    });

    if (!Data) {
      return res.status(404).json({ message: "data not found" });
    }

    res.status(200).json({ data: Data.tasks }); // Send only tasks, not full user data
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});
//get imcomplete task
router.get("/get-incomplete-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers; // Assuming authenticateToken adds user info

    const Data = await User.findById(id).populate({
      path: "tasks",
      match: { complete: false },
      options: { sort: { createdAt: -1 } },
    });

    if (!Data) {
      return res.status(404).json({ message: "data not found" });
    }

    res.status(200).json({ data: Data.tasks }); // Send only tasks, not full user data
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports=router;
