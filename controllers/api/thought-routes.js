const { Thought, User } = require("../../models");
const router = require("express").Router();

//get all thoughts
router.get("/", (req, res) => {
  Thought.find({})
    .select("-__v")
    .sort({ _id: -1 })
    .then((dbThoughtData) => res.json(dbThoughtData))
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

//get thought by id
router.get("/:id", (req, res) => {
  Thought.findOne({ _id: req.params.id })
    .select("-__v")
    .then((dbThoughtData) => res.json(dbThoughtData))
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

//add a thought
router.post("/", (req, res) => {
  Thought.create(req.body)
    .then((dbThoughtData) => {
      return User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );
    })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => res.json(err));
});

//update a thought
router.put("/:id", ({ params, body }, res) => {
  Thought.findOneAndUpdate({ _id: params.id }, body, {
    new: true,
    runValidators: true,
  })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        res.status(404).json({ message: "No thought found with this id!" });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch((err) => res.json(err));
});

//delete a thought
router.delete("/:thoughtId", (req, res) => {
  Thought.findOneAndDelete({ _id: req.params.thoughtId })
    .then((deletedThought) => {
      if (!deletedThought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }
      return User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thought: req.params.thoughtId } },
        { new: true }
      );
    })
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => res.json(err));
});

//add a reaction to a thought
router.post("/:thoughtId/reactions", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    {
      $addToSet: {
        reactions: {
          reactionBody: req.body.reactionBody,
        },
      },
    },
    { new: true }
  )
    .then((dbThoughtData) => res.json(dbThoughtData))
    .catch((err) => res.json(err));
});

//delete a reaction to a thought
router.delete("/:thoughtId/reactions/:reactionId", (req, res) => {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { _id: req.params.reactionId } } },
    { new: true }
  )
    .then((dbThoughtData) => res.json(dbThoughtData))
    .catch((err) => res.json(err));
});

module.exports = router;
