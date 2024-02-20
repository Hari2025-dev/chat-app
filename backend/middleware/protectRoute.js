import jwt from "jsonwebtoken"
import User from "../model/user.model.js"

const protectRoute = async(req,res,next) => {
  try{
    const token = req.cookies.jwt
    console.log(token)
    if(!token){
      res.status(401).json({error:"unAuthorized: No token found"})
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    if(!decoded){
      res.status(401).json({error:"unAuthorized: Invalid token"})
    }

    const user = await User.findById(decoded.userId).select("-password")
    
    if(!user){
      res.status(404).json({error:"User not found"})
    }

    console.log(user)
    req.user = user 

    next()

  }
  catch(error){
    console.log("Error in the protectMiddleware", error)
    res.status(500).json({error:"Internal server error"})
  }
}

export default protectRoute