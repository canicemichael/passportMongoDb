require("dotenv").config();

const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const uuid = require("uuid");
const bcrypt = require('bcrypt');
const UserService = require("./src/user");

require("./src/config/passport");
require("./src/config/google");
require("./src/config/local");

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, },
    (error) => { if (error) console.log(error) }
    )
    // .then(() => console.log('DB connection successful'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("html", require("ejs").renderFile);
app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
app.use(
    session({
        secret: "secr3t",
        resave: false,
        saveUninitialized: true,
    })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

app.get("/auth/google/callback", 
    passport.authenticate("google", {
        failureRedirect: "/",
        successRedirect: "/profile",
        failureFlash: true,
        successFlash: "Successfully logged in!",
    })
);

app.get("/", (req, res) => {
    res.render("index.ejs");
});

const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
};

app.get("/profile", isLoggedIn, (req, res) => {
    res.render("profile.ejs", { user: req.user });
})


app.get("/local/signup", (req, res) => {
    res.render("local/signup.ejs");
});

app.post("/auth/local/signup", async (req, res) => {
    const { first_name, last_name, email, password } = req.body

    if (password.length < 8) {
        req.flash("error", "Account not created. Password must be 7+ characters long");
        return res.redirect("/local/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await UserService.addLocalUser({
            id: uuid.v4(),
            email,
            firstName: first_name,
            lastName: last_name,
            password: hashedPassword
        })
    } catch (e) {
        req.flash("error", "Error creating a new account. Try a different login method.");
        return res.redirect("/local/signup")
    }

    return res.redirect("/local/signin")
});

app.get("/local/signin", (req, res) => {
    res.render("local/signin.ejs");
});

app.post('/auth/local/signin', 
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/local/signin',
        failureFlash: true
    })
);

app.get("/auth/logout", (req, res) => {
    req.flash("success", "Successfully logged out");
    req.session.destroy(function () {
        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
})