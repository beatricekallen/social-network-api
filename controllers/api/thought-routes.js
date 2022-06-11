const { Thought, User } = require("../../models");
const router = require("express").Router();

router.get("/thoughts", (req, res) => {
  Thought.find({})
    .select("-__v")
    .sort({ _id: -1 })
    .then((dbThoughtData) => res.json(dbThoughtData))
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.get("/thoughts/:id", (req, res) => {
  Thought.findOne({ _id: params.id })
    .select("-__v")
    .then((dbThoughtData) => res.json(dbThoughtData))
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.post("/thoughts", ({ body }, res) => {
  Thought.create(body)
    .then(({ _id }) => {
      return Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { thoughts: _id } },
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

router.put("/thoughts", ({ params, body }, res) => {
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

router.delete("/thoughts", ({ params }, res) => {
  Thought.findOneAndDelete({ _id: params.thoughtId })
    .then((deletedThought) => {
      if (!deletedThought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }
      return User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { thought: params.thoughtId } },
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

router.post("/thoughts/:thoughtId/reactions", (req, res) => {
  //
});

router.delete("/thoughts/:thoughtId/reactions", (req, res) => {
  //
});

module.exports = router;
