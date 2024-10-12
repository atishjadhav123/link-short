
const { admingetAllusers, adminUpdateUser, adminGetUserUrls } = require("../controller/adminController")

const router = require("express").Router()

router
    .get("/user", admingetAllusers)
    .put("/user/:userId", adminUpdateUser)
    .get("/user/url/:userId", adminGetUserUrls)

module.exports = router