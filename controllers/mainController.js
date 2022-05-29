const path = require("path");
const { isBuffer } = require("util");
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://root:root@cluster0.icqrx.mongodb.net/?retryWrites=true&w=majority"
module.exports = function (app) {
    app.get("/", (req, res) => {
        res.sendFile(path.join(path.dirname(__dirname), "public", "index.html"));
    })

    app.post("/login", (req, res) => {
        const user = {
            username: req.body.username,
            password: req.body.password
        }
        MongoClient.connect(url, (err, dbo) => {
            if (err) throw err;
            let db = dbo.db("login");
            db.collection("users").findOne(user, (err, data) => {
                if (err) throw err;
                if (data) {
                    res.render("profile", { user: data })
                } else {
                    res.render("register", { username: user.username })
                }
            })
        })
    })

    app.post("/newUser", (req, res) => {
        const user = {
            username: req.body.username,
            password: req.body.password
        }
        MongoClient.connect(url, (err, dbo) => {
            if (err) throw err;
            let db = dbo.db("login");

            db.collection("users").insertOne(user, (err, data) => { if (err) throw err; })
            res.sendFile(path.join(path.dirname(__dirname), "public", "index.html"));
        })
    })

    app.get("/forgotPass", (req, res) => {
        res.sendFile(path.join(path.dirname(__dirname), "public", "forgotPass.html"));
    })

    app.post("/updateUser", (req, res) => {
        MongoClient.connect(url, (err, dbo) => {

            if (err) throw err;
            let db = dbo.db("login");
            db.collection("users").findOne({ username: req.body.origUser }, (err, person) => {

                if (req.body.username)
                    person.username = req.body.username;
                if (req.body.password)
                    person.password = req.body.password;
                if (req.body.desc)
                    person.desc = req.body.desc;

                db.collection("users").updateOne({ username: req.body.origUser }, { $set: { username: person.username, password: person.password, desc: person.desc } }, (err, data) => res.json(person))
            })
        })
    })
}