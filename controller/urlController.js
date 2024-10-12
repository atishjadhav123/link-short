const asyncHandler = require("express-async-handler")
const Url = require("../models/Url")

exports.getlongUrl = asyncHandler(async (req, res) => {
    const { shortUrl } = req.params
    // const { shortUrl } = req.body
    const result = await Url.findOne({ shortUrl })
    if (!result) {
        return res.status(400).json({ message: "invaild code" })
    }
    await Url.findByIdAndUpdate(result._id, { count: result.count + 1 })
    res.status(200).json({ message: "url fetch success", result: result.longUrl })
})