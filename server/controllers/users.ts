import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import generateToken from "../utils/generateToken.js";
import IUserRequest from "../interfaces/userRequest.js";
import IUser from "../interfaces/userModel.js";
import nodemailer from 'nodemailer'
import jwt, { DecodeOptions, JwtPayload } from 'jsonwebtoken'

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const name: string | undefined = req.body.name;
  const email: string | undefined = req.body.email;
  const password: string | undefined = req.body.password;
  const confirmPassword: string | undefined = req.body.confirmPassword;

  if (!name || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error("Please fill in all the fields");
  }

  if (confirmPassword !== password) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  const existingEmail: IUser = await User.findOne({ email });
  if (existingEmail) {
    res.status(400);
    throw new Error("Email already in use");
  }

  const existingName: IUser = await User.findOne({ name })
  if(existingName) {
    res.status(400)
    throw new Error('Name already in use')
  }

  const newUser: IUser = new User({ name, email, password, role: "read-only" });
  await newUser.save();

  res.status(201);
  res.json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    token: generateToken(res, newUser.id),
    role: newUser.role,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const email: string | undefined = req.body.email;
  const password: string | undefined = req.body.password;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill in all the fields");
  }

  const user: IUser = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  if (await user.matchPassword(password)) {
    res.status(200);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(res, user.id),
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

export const getProfile = asyncHandler(
  async (req: IUserRequest, res: Response) => {
    const user: IUser = await User.findById(req.userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }
);

export const updateProfile = asyncHandler(
  async (req: IUserRequest, res: Response) => {
    const name: string | undefined = req.body.name;
    const password: string | undefined = req.body.password;
    const newPassword: string | undefined = req.body.newPassword;

    const user: IUser = await User.findById(req.userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (!password) {
      res.status(400);
      throw new Error("Your current password is required");
    }

    if (await user.matchPassword(password)) {
      if (newPassword) {
        user.password = newPassword;
      }
      user.name = name || user.name;

      const updatedUser: IUser = await user.save();
      res.status(201);
      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(401);
      throw new Error("Wrong password");
    }
  }
);

export const deleteProfile = asyncHandler(
  async (req: IUserRequest, res: Response) => {
    const password: string | undefined = req.body.password;
    if (!password) {
      res.status(400);
      throw new Error("Please enter your password");
    }

    const user: IUser = await User.findById(req.userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (await user.matchPassword(password)) {
      await User.deleteOne({ _id: user._id });
      res.status(200);
      res.json({
        msg: "User successfully deleted",
      });
    } else {
      res.status(401);
      throw new Error("Wrong password");
    }
  }
);

export const forgotPassword = asyncHandler(async (req: IUserRequest, res: Response) => {
  const email: string = req.body.email
  if(!email) {
    res.status(400)
    throw new Error('Please provide an email')
  }

  const user: IUser = await User.findOne({ email })
  if(!user) {
    res.status(404)
    throw new Error('No user with that email')
  }

  const transporter: nodemailer.Transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const token: string = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: 60 * 30
  })

  const mailOptions: { from: string, to: string, subject: string, html: string } = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Reset your Eclesia Worship account password',
    html: `
      <h1>PASSWORD RESET REQUEST</h1>
      <p>
        Hi there!<br />
        ${token}
        We have received your request to reset your Eclesia Songs account password. Please click the link below to reset your password.<br />
        <a href='${process.env.CLIENT_URL}/reset-password/${token}'>
          Reset my password
        </a>
      </p>
    `
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      res.status(400)
      throw new Error('Could not send email')
    } else {
      console.log('Email sent: ' + info.response);
    }
  })

  res.status(200)
  res.json({
    msg: 'We have sent you an email. Please check your inbox.'
  })
})

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const password: string = req.body.password
  const emailToken: string = req.params.token.toString()
  
  if(!password) {
    res.status(400)
    throw new Error('Please enter your new password')
  }

  try {
    const decoded: string | JwtPayload  = jwt.decode(emailToken, process.env.JWT_SECRET as DecodeOptions) as JwtPayload
    const user = await User.findOne({ email: decoded.email })
    
    user.password = password

    res.json({
      msg: 'Password saved'
    })
  } catch (error) {
    res.status(400)
    throw new Error("Link expired")
  }
})