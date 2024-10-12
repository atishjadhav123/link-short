const { getlongUrl } = require("../controller/urlController")


const router = require("express").Router()

router
    .get("/:shortUrl", getlongUrl)


module.exports = router