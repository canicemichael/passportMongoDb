require("dotenv").config();

const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname + "/public"));

app.use(cookieParser());

app.get("/", (req, res) => {
    res.render("index.ejs");
});


app.get("/local/signup", (req, res) => {
    res.render("local/signup.ejs");
});

app.get("/local/signin", (req, res) => {
    res.render("local/signin.ejs");
});


app.listen(3000, () => {
    console.log("Server listening on port 3000");
})