const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const validator = require("validator")
const User = require("../models/User")

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    if (!validator.isEmail(email)) {
        res.status(400).json({ meassage: "Please Provide valid email" })
    }
    if (!validator.isStrongPassword(password)) {
        //Skillhub@123
        // min 8 ,
        return res.status(400).json({ meassage: "Please Provide valid password" })
    }
    if (!name) {
        return res.status(400).json({ meassage: "Please Provide name" })
    }
    const result = await User.findOne({ email })
    if (result) {
        return res.status(400).json({ meassage: "email alrady in use" })
    }
    const hashPass = await bcrypt.hash(password, 10)

    await User.create({ ...req.body, password: hashPass })

    return res.status(201).json({ meassage: "user register success" })
})
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ meassage: "email and password required" })
    }
    if (!validator.isEmail(email)) {

        return res.status(400).json({ meassage: "please provide vaild email" })
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ meassage: "please provide vaild password" })

    }
    const result = await User.findOne({ email })
    if (!result) {
        return res.status(400).json({ meassage: "email not registerd with us" })
    }
    if (!result.active) {
        return res.status(400).json({ meassage: "Account Block.Get in touch with admin" })

    }
    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(400).json({ meassage: "password do not match" })

    }
    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" });
    res.cookie("devAuth", token, {
        maxAge: 3600000 * 6, // 6 hours
        httpOnly: true,      // Prevent JavaScript access
        secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
        sameSite: "strict"   // Or "lax" depending on your needs
    });
    return res.status(200).json({
        message: "login success",
        result: {
            name: result.name,
            email: result.email,
            role: result.role,
        }
    });

})

exports.logout = asyncHandler(async (req, res) => {
    res.clearCookie("devAuth")
    res.status(200).json({ meassage: "logout success" })
})

