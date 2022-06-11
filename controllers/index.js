const router = require("express").Router();
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

router.use((req, res) => {
  // res.status(404).send('404 Error!');
  console.log("not working");
  return res.send("wrong route");
});

module.exports = router;
