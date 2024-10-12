const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const Url = require("../models/Url")
exports.admingetAllusers = asyncHandler(async (req, res) => {
    const result = await User.find({ role: "user" })
    res.status(200).json({ message: "user fetch success", result })
})
exports.adminUpdateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params
    await User.findByIdAndUpdate(userId, { ...req.body, role: "user" }, { runValidators: true })
    res.status(200).json({ message: "user update success" })
})
exports.adminGetUserUrls = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const result = await Url.find({ userId })
    res.status(200).json({ message: "user url fetch success", result })
})