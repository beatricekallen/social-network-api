const { User } = require("../models");

router.get("/users", (req, res) => {
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

router.get("/users/:id", (req, res) => {
  User.findOne({ _id: params.id })
    .populate({
      path: "thoughts",
      select: "-__v",
    })
    .select("-__v")
    .then((dbUserData) => res.json(dbUserData))
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
  User.findOneAndUpdate({ _id: params.id }, body, {
    new: true,
    runValidators: true,
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

router.delete("/users", ({ params }, res) => {
  User.findOneAndDelete({ _id: params.id })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.json(err));
});

router.post("/users/:userId/friends/:friendId", (req, res) => {});

router.delete("/users/:userId/friends/:friendId", (req, res) => {});

module.exports = userRoutes;
