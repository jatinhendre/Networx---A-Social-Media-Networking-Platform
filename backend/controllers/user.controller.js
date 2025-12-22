import User from '../models/users.model.js';
import bcrypt from 'bcryptjs';
import Profile from '../models/profile.model.js';
import crypto from 'crypto';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import Connection from '../models/connections.model.js';
import Testimonial from '../models/testimonials.model.js';

const convertUserDataToPDF = async(userProfile)=>{
    const doc = new PDFDocument();

    const outputPath = 'uploads/'+crypto.randomBytes(16).toString('hex') + '.pdf';
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);
  // ✅ Check if profile picture exists before adding it
    const picturePath = 'uploads/' + userProfile.userId.profilePicture;
    if(fs.existsSync(picturePath)){
        doc.image(picturePath, {align:"center", width:100});
    }

    doc.image('uploads/' + userProfile.userId.profilePicture, {align:"center",width:100});
    doc.fontSize(25).text(`Name:${userProfile.userId.name}`);
    doc.fontSize(20).text(`Username:${userProfile.userId.username}`);
    doc.fontSize(20).text(`Email:${userProfile.userId.email}`);
    doc.fontSize(15).text(`Bio:${userProfile.bio}`);
    doc.fontSize(20).text(`Current Post:${userProfile.currentPost}`);

    doc.fontSize(25).text('Past Work Experience:');
    userProfile.pastWork.forEach((work, index) => {
        doc.fontSize(18).text(`${index + 1}. Company: ${work.company}, Position: ${work.position}, Years: ${work.years}`);
    });
    doc.end();
    return outputPath;
};

export const register = async (req, res) => {
    let { username, name, email, password } = req.body;
    if (!username || !name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });
    const userName = await User.findOne({ username });
    if (userName) return res.status(400).json({ message: "Username already taken" });
    if(password.length < 8 || password.length > 20 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)){
        return res.status(400).json({ message: "Password must be 8-20 characters long and contain at least one uppercase letter, lowercase letter, digit, and special character." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, name, email, password: hashedPassword });
    await newUser.save();
    const profile = new Profile({ userId: newUser._id });
    await profile.save();
    return res.status(201).json({ message: "User registered successfully" });

};


export const login = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const token = crypto.randomBytes(32).toString('hex');
    await User.updateOne({ _id: user._id }, { token });
    return res.status(200).json({ message: "Login successful", token: token });

};

export const updateProfilePicture = async (req, res) => {
    const {token} = req.body;
    try {
        const user = await User.findOne({ token: token });
        if (!user) return res.status(401).json({ message: "Unauthorized" });
        user.profilePicture = req.file.filename;
        await user.save();
        return res.status(200).json({ message: "Profile picture updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const updateUser = async(req, res)=>{
    try{
        let {token, ...newUserData}  = req.body;

        let user = await User.findOne({token:token});
        if(!user) return res.status(401).json({message:"Unauthorized"});
        const {username, email} = newUserData;
        const existingUser = await User.findOne({$or:[{username:username}, {email:email}]});
        if(existingUser){
        if(existingUser._id.toString() !== user._id.toString()){
            return res.status(400).json({message:"Username or email already taken"});
            }
        }
    Object.assign(user, newUserData);
    await user.save();
    return res.status(200).json({message:"Profile updated successfully"});
    }catch(error){
        return res.status(500).json({message:"Server error", error:error.message});
    }
}

export const getProfile = async(req, res)=>{
    try{
            let {token}  = req.query;
        let user = await User.findOne({token:token});
        if(!user) return res.status(401).json({message:"Unauthorized"});
        const profile = await Profile.findOne({userId:user._id}).populate('userId', 'name email profilePicture username');
        return res.json(profile);
    }catch(error){
        return res.status(500).json({message:"Server error", error:error.message});
    }       
}

export const updateProfileData = async(req, res)=>{
    try{
        let {token} = req.query;
        let {...newProfileData}  = req.body;
    let user = await User.findOne({token:token});
    if(!user) return res.status(401).json({message:"Unauthorized"});
    let profile = await Profile.findOne({userId:user._id});
    if(!profile) return res.status(404).json({message:"Profile not found"});
    Object.assign(profile, newProfileData);
    await profile.save();
    return res.status(200).json({message:"Profile data updated successfully"});
    }catch(error){
        return res.status(500).json({message:"Server error", error:error.message});
    }
};

export const getAllUserProfiles = async(req, res)=>{
    try{
        const profiles = await Profile.find().populate('userId', 'name email profilePicture username');
        return res.status(200).json(profiles);
    }catch(error){
        return res.status(500).json({message:"Server error", error:error.message});
    }
}

export const downloadProfile = async(req, res)=>{
    const user_id = req.query.id;
    const user = await User.findById(user_id);
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    const userProfile = await Profile.findOne({userId:user_id}).populate('userId', 'name email profilePicture username');
    let outputPath = await convertUserDataToPDF(userProfile);
    return res.json({"message":outputPath})
}

export const getUserProfileBasedOnUsername = async(req, res)=>{
    try{
        const {username} = req.query;
        const user = await User.findOne({username:username});
        if(!user){
            return res.status(404).json({message:"User not found!!"});
        }   
        const profile = await Profile.findOne({userId:user._id}).populate('userId', 'name email profilePicture username');
        return res.status(200).json(profile);
    }catch(error){
        return res.status(500).json({message:"Server error", error:error.message});
    }   
}
// Connection Request - Send a new connection request
export const connectionRequest = async(req, res) => {
    console.log(req.body);
    const {token, connectionId} = req.body;
    try {
        const user = await User.findOne({token: token});
        if (!user) {
            return res.status(401).json({message: "User not found!!"});
        }
        
        const connectionUser = await User.findOne({_id: connectionId});
        if (!connectionUser) {
            return res.status(404).json({message: "Connection user not found!!"});
        }
        
        // Check if connection already exists (in either direction)
        const existingConnection = await Connection.findOne({
            $or: [
                { userId: user._id, connectionId: connectionId },
                { userId: connectionId, connectionId: user._id }
            ]
        });
        
        if (existingConnection) {
            return res.status(400).json({
                message: "Connection request already sent or you are already connected!!"
            });
        }
        
        const request = new Connection({
            userId: user._id,
            connectionId: connectionId,
            status_accepted: null,
        });
        await request.save();
        
        // Return the newly created connection with populated user data
        const newConnection = await Connection.findById(request._id)
            .populate('userId')
            .populate('connectionId');
        
        return res.status(200).json({
            message: "Connection request sent successfully",
            connection: newConnection
        });

    } catch(err) {
        return res.status(500).json({message: "Server error", error: err.message});
    }
}

// Get Connection Requests - Get pending requests sent TO you
export const myConnectionRequests = async(req, res) => {  
    try {
        const {token} = req.query;
        const user = await User.findOne({token: token});
        if (!user) {
            return res.status(401).json({message: "User not found!!"});          
        }
        
        // Find requests where YOU are the connectionId (receiver)
        // and status is null (pending)
        const requests = await Connection.find({
            connectionId: user._id, 
            status_accepted: null
        }).populate('userId', 'name email profilePicture username');
        
        console.log(`Found ${requests.length} connection requests for user ${user._id}`);
        return res.status(200).json(requests);
        
    } catch(error) {
        return res.status(500).json({message: "Server error", error: error.message});
    }
}

// Get My Connections - Get ONLY accepted connections
export const getMyConnections = async(req, res) => {  
    try {
        const {token} = req.query;
        const user = await User.findOne({token: token});
        if (!user) {
            return res.status(401).json({message: "User not found!!"});          
        }   
        
        // 🔥 FIX: Only get ACCEPTED connections (status_accepted: true)
        const connections = await Connection.find({
            $or: [
                { userId: user._id },
                { connectionId: user._id }
            ],
            status_accepted: true  // ✅ Only accepted connections
        })
        .populate('connectionId', 'name email profilePicture username')
        .populate('userId', 'name email profilePicture username');
        
        console.log(`Found ${connections.length} accepted connections for user ${user._id}`);
        return res.status(200).json(connections);
        
    } catch(error) {
        return res.status(500).json({message: "Server error", error: error.message});
    }   
}

// Accept or Reject Connection Request
export const acceptConnectionRequest = async(req, res) => {
    try {
        const {token, requestId, action_type} = req.body;
        const user = await User.findOne({token: token});
        if (!user) {
            return res.status(401).json({message: "User not found!!"});
        }
        
        const connectionRequest = await Connection.findById(requestId);
        if (!connectionRequest) {
            return res.status(404).json({message: "Connection request not found!!"});
        }
        
        // Verify that the current user is the receiver of the request
        if (connectionRequest.connectionId.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to accept/reject this request!"
            });
        }
        
        if (action_type === 'reject') {
            await Connection.deleteOne({_id: requestId});
            return res.status(200).json({
                message: "Connection request rejected successfully!"
            });
        }
        
        // Accept the request
        connectionRequest.status_accepted = true;
        await connectionRequest.save();
        
        return res.status(200).json({
            message: "Connection request accepted successfully!"
        });
        
    } catch(error) {
        return res.status(500).json({message: "Server error", error: error.message});
    }
}

// File: controllers/userController.js

export const getConnectionStatus = async (req, res) => {
    try {
        const { token, targetUserId } = req.query;
        const user = await User.findOne({ token: token });
        if (!user) return res.status(401).json({ message: "User not found" });

        // Find any connection record involving both users
        const connection = await Connection.findOne({
            $or: [
                { userId: user._id, connectionId: targetUserId },
                { userId: targetUserId, connectionId: user._id }
            ]
        });

        if (!connection) {
            return res.status(200).json({ status: "none" });
        }

        if (connection.status_accepted === true) {
            return res.status(200).json({ status: "connected" });
        }

        // If pending, check who sent it
        if (connection.userId.toString() === user._id.toString()) {
            return res.status(200).json({ status: "pending_sent" });
        } else {
            return res.status(200).json({ status: "pending_received" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const addTestimonial = async(req, res)=>{
    try{
        const { role, testimonial } = req.body;

  const newTestimonial = await Testimonial.create({
    userId: req.user._id,
    role,
    testimonial,
  });

  res.status(201).json(newTestimonial);
    }catch(err){
        return res.status(500).json({message:"server error"})
    }
}