//jshint esversion:6
import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";


const port = 3000;
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
console.log(process.env.API_KEY);





// mongoose.connect("mongodb://127.0.0.1:27017/userDB");
mongoose.connect(process.env.MONGO_ATLAS_URI);

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:["password"]});



const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save();
    res.render("secrets")
});

app.post("/login", async function(req, res) {
const username = req.body.username;
const password = req.body.password;

const foundUser = await User.findOne({email: username});
if (foundUser) {
    if (foundUser.password === password) {
        res.render("secrets");
    }
    else {
        console.log("Password incorrect");
        res.render("login");
    }
}
else {
    console.log("User Not found");
    res.render("login");
}
});






app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});