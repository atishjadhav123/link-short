const asyncHandler = require("express-async-handler")
const validator = require("validator")
const { nanoid } = require("nanoid")
const Url = require("../models/Url")

exports.addUrl = asyncHandler(async (req, res) => {
    const { shortUrl, longUrl, label } = req.body
    if (!longUrl) {
        return res.status(400).json({ meassage: "Please Provide longUrl" })
    }

    if (!label) {
        // return res.status(400).json({ meassage: "Please Provide Label" })
        return res.status(400).json({ message: "Please Provide Labeel" })
    }

    if (shortUrl) {
        const result = await Url.findOne({ shortUrl })
        if (result) {
            return res.status(400).json({ meassage: "please choose another short url" })
        }
    } else {
        req.body.shorturl = nanoid(6)
    }

    await Url.create(req.body)
    res.status(201).json({ meassage: "url create success" })

})
exports.getUserUrl = asyncHandler(async (req, res) => {
    const result = await Url.find({ userId: req.body.userId })
    res.status(200).json({ meassage: "url fetch success", result })

})
exports.deleteUserUrl = asyncHandler(async (req, res) => {
    const { urlId } = req.params
    await Url.findByIdAndDelete(urlId)
    res.status(200).json({ meassage: "url delte success" })

})
exports.updateUserUrl = asyncHandler(async (req, res) => {
    const { urlId } = req.params
    await Url.findByIdAndUpdate(urlId, req.body, { runValidators: true })
    res.status(200).json({ meassage: "url update success" })

})