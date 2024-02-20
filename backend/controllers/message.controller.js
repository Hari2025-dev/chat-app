import Conversation from "../model/conversation.model.js"
import Message from "../model/message.model.js"

export const sendMessage = async(req,res) => {
  try{
  const{message} = req.body
  const{id:receiverId} = req.params
  const senderId = req.user._id

  let conversation = await Conversation.findOne({
    participants:{ $all : [senderId, receiverId]}
  })

  if(!conversation){
    conversation = await Conversation.create({
      participants:[senderId, receiverId]
    })
  }

  const newMessage = new Message({
    senderId,
    receiverId,
    message
  })
console.log(newMessage)
  if(newMessage){
    conversation.messages.push(newMessage._id)
  }

  // await conversation.save()
  // await newMessage.save()

  await Promise.all([conversation.save(), newMessage.save()])
  res.status(201).json(newMessage)
  }
  catch(error){
    console.log("Error in message controller",error)
    res.status(500).json({message:"Internal Server Error"})
  }  
}

export const getMessage = async(req,res) => {
  try{
    const{id: userToChatId } = req.params
		const senderId = req.user._id
    
    const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
  }
  catch(error){
    console.log("Error in message controller",error)
    res.status(500).json({message:"Internal Server Error"})
  }  
  
}
