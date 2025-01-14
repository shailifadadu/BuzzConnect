import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  //fetch the data that user sends(to grab this fields, we will need middleware)
  const { fullName, email, password } = req.body;

  //Now in try, we will signup user, hash their pass & create a token to let them know they are authenticated
  try {
    //signup user
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 character" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    //hash passwords(use bcryptjs)
    const salt = await bcrypt.genSalt(10); //generate salt
    const hashedPassword = await bcrypt.hash(password, salt); //hash pass with the salt

    //create new user
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    //save the user to db
    if (newUser) {
      //generate jwt token(utils.js)
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  //get email & pass from the body
  const { email, password } = req.body;
  try {
    //check if user exist in db
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    //if both email & pass are correct, generate token
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  //if user logout, just clear the cookie
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    //check which user it is
    const userId = req.user._id; //coming from protectRoute middleware

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pis is required" });
    }

    //if pic is provided, upload it to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    //then update the user in db
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Sends back the authenticated user’s details if the request is authorized.
//Useful for verifying active sessions or displaying user-specific data in the frontend.
export const checkAuth = (req, res) => {
  try {
    //send the user back to client
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
