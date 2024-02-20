import User from "../model/user.model.js"
import bcrypt from 'bcryptjs'
import generateTokenAndCookie from "../utils/generateToken.js"
export const signup = async(req,res) => {
  try{
    const{fullName, username, password, confirmPassword,gender} = req.body

    if(password !== confirmPassword){
      return res.status(400).json({error:"Passwords dont match"})
    }

    const user = await User.findOne({username})
    
    if(user){
      return res.status(400).json({error:"username already exist"})
    }

    //HASH PASSWORD HERE

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

    const newUser = new User({
      fullName,
      username,
      password:hashedPassword,
      gender,
      profilePic: gender === 'male' ? boyProfilePic : girlProfilePic
    })

    if(newUser){
    generateTokenAndCookie(newUser._id, res)
    await newUser.save()

    res.status(201).json({
      _id:newUser._id,
      fullName:newUser.fullName,
      username:newUser.username,
      profilePic:newUser.profilePic
    })
  }
  else{
    res.status(400).json({error:"Invalid user Data"})
  }
  }catch(err){
    console.log("Error in the signup controller", err.message)
    res.status(500).json({Error : "Internal server error"})
  }
}
export const login = async(req,res) => {
  try{
    const{username, password} = req.body

    const user = await User.findOne({username})
    const isPasswordCorrect = await bcrypt.compare(password,user?.password || "")

    if(!user || !isPasswordCorrect){
      res.status(400).json({error:"Invalid username or password"})
    }

    generateTokenAndCookie(user._id, res)

    res.status(200).json({
      _id:user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic
    })
  }
  catch(err){
    console.log("Error in the signup controller", err.message)
    res.status(500).json({Error : "Internal server error"})
  }
}
export const logout = (req,res) => {
  try{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"logged out successfully"})
  }
  catch(err){
    console.log("Error in the logout controller", err.message)
    res.status(500).json({Error : "Internal server error"})
  }
}