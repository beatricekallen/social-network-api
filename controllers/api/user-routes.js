const { User } = require("../../models");
const router = require("express").Router();

//get all users
router.get("/", (req, res) => {
  User.find({})
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

//get user by id
router.get("/:id", (req, res) => {
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

//create a user
router.post("/", ({ body }, res) => {
  User.create(body)
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.json(err));
});

//update a user by id
router.put("/:id", ({ params, body }, res) => {
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

//delete a user by id
router.delete("/:id", ({ params }, res) => {
  User.findOneAndDelete({ _id: params.id })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.json(err));
});

//add a friend to a user
router.post("/:userId/friends/:friendId", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $addToSet: { friends: req.params.friendId } },
    { new: true }
  )
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.json(err));
});

//delete a friend from a user
router.delete("/:userId/friends/:friendId", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId } },
    { new: true }
  )
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.json(err));
});

module.exports = router;
