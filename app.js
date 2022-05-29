const express = require("express");
const mainController = require("./controllers/mainController")

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }))
app.use(express.static("./public"))

mainController(app);

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening to http://localhost:${PORT}`);
})