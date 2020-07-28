const express = require("express");
const {
  insert,
  find,
  findById,
  insertComment,
  findCommentById,
  remove,
  findPostComments,
  update,
} = require("../data/db.js");

const router = express.Router();

router.get("/", (req, res) => {
  find()
    .then((post) => {
      res.status(201).json({ data: post });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  try {
    findById(id).then(([item]) => {
      if (item === undefined) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(201).json({ data: item });
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "The post information could not be retrieved." });
  }
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  try {
    findCommentById(id).then((comment) => {
      res.status(201).json({ data: comment });
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "The post information could not be retrieved." });
  }
});

router.post("/", (req, res) => {
  const postData = req.body;
  insert(postData);
  try {
    if (postData.title && postData.contents) {
      res.status(201).json(postData);
    } else {
      res.status(400).json({
        errorMessage: "Please provide title and contents for the post.",
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Error: ", err });
  }
});

router.post("/:id/comments", (req, res) => {
  //TODO figure out how to refactor this code
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment" });
  }
  findById(id).then((post) => {
    if (post === undefined) {
      res.status(404).json({
        errorMessage: "The post with the specified ID does not exist.",
      });
    }

    insertComment({ post_id: id, text: text })
      .then((comment) => {
        res.status(201).json(comment);
      })
      .catch((err) => console.log(err));
  });
});

// Removes the post with the specified id and returns the deleted
// post object. You may need to make additional calls to the
// database in order to satisfy this requirement.

// TODO finish the DELETE request for :/id
router.delete(":/id", (req, res) => {
  const { id } = req.params;

  // findById(id)
  //   .remove(id)
  //   .then((post) => {
  //     status(200).json(id);
  //   });
});

// TODO finish the PUT request for :/id
router.put(":/id", (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;

  if (!title && !contents) {
    return res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  }

  findById(id).then((post) => {
    post === undefined
      ? res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." })
      : update(id, { title: title, contents: contents }).then((post) =>
          res.status(200).json(post)
        );
  });
});

module.exports = router;
