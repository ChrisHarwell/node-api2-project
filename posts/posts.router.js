const express = require("express");

// add require for post.model.js later

const router = express.Router();

router.get("/", (req, res) => {});

router.get("/:id", (req, res) => {});


router.post("/", (req, res) => {
    const {title, contents} = req.body;
    if(title && contents) {

    }
});

router.delete(":/id", (req, res) => {});

router.put(":/id", (req, res) => {});

module.exports = router;