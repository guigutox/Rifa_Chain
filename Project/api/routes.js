const router = require("express").Router();

//Rotas devem ser escritas aqui

router.get("/", (req, res) => {
  res.send("Hello World");
});



module.exports = router;