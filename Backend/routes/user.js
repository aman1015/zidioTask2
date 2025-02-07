const router=require("express").Router();
const User= require("../models/user");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken");
//for sign-in api//
router.post("/sign-in", async (req,res)=>{
try{
 const { username } = req.body;
 const { email } = req.body;
 const existingUser = await User.findOne({ username: username });
 const existingEmail = await User.findOne({ email: email });
 if (existingUser) {
   return res.status(400).json({ msg: "username already exists" });
 } else if (username.length < 4) {
   return res.status(400).json({ message: "username should alteast 4 char" });
 }
 if (existingEmail) {
   return res.status(400).json({ message: "email already exists" });
 }
 const hashPass=await bcrypt.hash(req.body.password,10);
 const newUser = new User({
   username: req.body.username,
   email: req.body.email,
   password: hashPass,
 });
 await newUser.save();
 return res.status(200).json({ message: "sign-in succesfully" });
}catch(e){
  console.log(e);
  res.status(400).json({message: "internal server error"})
  
}
});
//for login
router.post("/log-in", async(req,res)=>{
 const {username,password}=req.body;
 const existingUser=await User.findOne({username:username});
 if(!existingUser){
  return res.status(400).json({message: "username or password is incorrect"});
 }
 bcrypt.compare(password,existingUser.password, (err,data)=>{
  if(data){
   const authClaims=[{name: username}, {jti: jwt.sign({}, "tcmTM")}];
   const token=jwt.sign({authClaims}, "tcmTM", {expiresIn : "2d"});
   res.status(200).json({id: existingUser._id, token :token})
  }else{
    res.status(400).json({message: "wrong credential"})
  }
 })
});


module.exports=router;