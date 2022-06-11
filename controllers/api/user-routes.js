const { User } = require("../../models");
const router = require("express").Router();

router.get("/users", (req, res) => {
  User.find()
    .populate({
      path: "thoughts",
      select: "-__v",
    })
    .select("-__v")
    .sort({ _id: -1 })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.get("/users/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-__v")
    .populate({
      path: "thoughts",
      select: "-__v",
    })
    .populate("friends")
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({ message: "No user found with this id!" });
      }
      res.json(dbUserData);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.post("/users", ({ body }, res) => {
  User.create(body)
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.json(err));
});

router.put("/users", ({ params, body }, res) => {
  User.findOneAndUpdate(
    { _id: params.id },
    { $set: body },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((dbUserData) => {
      if (!dbUserData) {
        res.status(404).json({ message: "No user found with this id!" });
        return;
      }
      res.json(dbUserData);
    })
    .catch((err) => res.json(err));
});

router.delete("/users", ({ params }, res) => {
  User.findOneAndDelete({ _id: params.id })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.json(err));
});

router.post("/users/:userId/friends/:friendId", (req, res) => {
  //findoneandupdate take in req.params.userId match with user's id, $addToSet [friends] pass in req.params.friendId
  //new: true
  //.then get data, catch err, return res.json
  User.findOneAndUpdate(
    { userId: req.params.userId },
    { $addToSet: { friends: { friendID: req.params.friendId } } },
    { new: true }
  )
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.json(err));
});

router.delete("/users/:userId/friends/:friendId", (req, res) => {
  //findoneandupdate take in req.params.userId match with user's id, $pull [friends] pass in req.params.friendId
  //new: true
  //.then get data, catch err, return res.json
  User.findOneAndUpdate(
    { userId: req.params.friendId },
    { $pull: { friends: { friendID: req.params.friendId } } },
    { new: true }
  )
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.json(err));
});

module.exports = router;
