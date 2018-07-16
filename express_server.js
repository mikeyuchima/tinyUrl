var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var express = require('express');
var cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.set('trust proxy', 1); // trust first proxy
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
   }));
app.use(function (req, res, next) {
req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge
next()
})

app.use(function (req, res, next) {
    // console.log(req.method + ": " +req.path);
    console.log(req.session.user_id);
    console.log('____________________________');
    console.log(users);
    console.log('____________________________');
    console.log(urlDatabase);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    next();
});

var urlDatabase = {
        "b2xVn2": "http://www.lighthouselabs.ca",
        "9sm5xK": "http://www.google.com",
};

var users = { 
    "ID1": {
        id: "ID1", 
        email: "user@example.com", 
        password: "pw1",
        urlLibrary: [],
    },
    "ID2": {
        id: "ID2", 
        email: "user2@example.com", 
        password: "pw2",
        urlLibrary: [],
    }
}

app.get("/", (req, res) => {
    if (req.session.user_id){
    res.redirect('/urls');
    } else {
    res.redirect("/login");
}});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});
//___________________________________________________________________________________________________________//

//REGISTER____________________________________________________________________________________________________//
app.get("/register", (req, res) => {
    res.render("urls_register");
});

app.post("/register", (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400);
        res.send('404 ERROR');
    } else if (req.body.email && req.body.password) {
        let idGen = `ID${generateRandomString()}`;
        let hasedPw = bcrypt.hashSync(req.body.password, 10);
        users[idGen] = {id : idGen, email: req.body.email, password: hasedPw, urlLibrary: []};
        res.redirect("/login");
    } 
    else if (function() { 
        for(let element in users) {
            if (users.element.email == req.body.email)
            return true }}) 
    {
        res.status(400);
        res.send('404 ERROR');
    }
});
//____________________________________________________________________________________________________________//

//LOGIN_______________________________________________________________________________________________________//
app.get('/login', (req, res) => {
    res.render('urls_login', {user: users[req.session.user_id = generateRandomString()]});
});

app.post("/login", (req, res) => {
    let id = '';

    for(var element in users) {
        if (req.body.email == users[element].email && bcrypt.compareSync(req.body.password, users[element].password)) {
        id = element;
        req.session.user_id = id;
        res.redirect("/urls");
        }
    }

    for (let element in users) {    
        if (req.body.email !== users[element].email || req.body.password !== users[element].password) {
            res.redirect('/error');
        }
    }
});
//____________________________________________________________________________________________________________//

//ERROR_______________________________________________________________________________________________________//
app.get('/error', (req, res) => {
    res.status(400);
    res.send('identification error');
});
//____________________________________________________________________________________________________________//

//LOGOUT______________________________________________________________________________________________________//
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect('/login');
});
//____________________________________________________________________________________________________________//

//HOME________________________________________________________________________________________________________//
app.get("/urls", (req, res) => {
    if (!req.session.user_id) {
        res.redirect("/login");
    } else {
        let id = req.session.user_id;
        res.render("urls_index", { urls: uniqueID(id), user: users[id] });
    }
});
//____________________________________________________________________________________________________________//

//NEW TINY URL________________________________________________________________________________________________//
app.get("/urls/new", (req, res) => {
    res.render("urls_new", {user: users[req.session.user_id]});
});

app.post("/urls", (req, res) => {
    if (users[req.session.user_id]) {
    let shrtURL = generateRandomString();
    urlDatabase[shrtURL] = req.body.longURL;
    users[req.session.user_id].urlLibrary.push(shrtURL);
    res.redirect(`http://localhost:8080/urls/${shrtURL}`);
    } else {
        res.redirect('/login');
    }
});

app.get("/urls/:id", (req, res) => {
    res.redirect('/urls');
  });
//____________________________________________________________________________________________________________//

//EXECUTE TINYURL_____________________________________________________________________________________________//
app.get("/u/:shortURL", (req, res) => {
    let shortUrl = req.params.shortURL;
    let longURL = urlDatabase[shortUrl];
    res.redirect(longURL);
});
//____________________________________________________________________________________________________________//

//UPDATE______________________________________________________________________________________________________//
app.get("/urls/:id/update", (req, res) => {
    res.render("urls_show", { shortURL: req.params.id, user: users[req.session.user_id]});
});

app.post("/urls/:id/update", (req, res) => {
    let shortUrl = req.params.id;
    let longURL = req.body.longURL;
    urlDatabase[shortUrl] = longURL;

    res.redirect("/urls");
});
//____________________________________________________________________________________________________________//


//DELETE______________________________________________________________________________________________________//
app.post("/urls/:id/delete", (req ,res) => {
    delete urlDatabase[req.params.id];

    let index = users[req.session.user_id].urlLibrary.indexOf(req.params.id);

    if (index !== -1) {
        users[req.session.user_id].urlLibrary.splice(index, 1);
    }
    res.redirect("/urls");
});
//____________________________________________________________________________________________________________//

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//FUNCTIONS___________________________________________________________________________________________________//
function generateRandomString() {
    let rand = '';

    for (let i = 0; i < 6; i++) {
        rand += Math.floor(Math.random() * Math.floor(10));
    }
    return rand;
}

function uniqueID(id){
    let tempUrl = {};
    let arr = users[id].urlLibrary;

    if (arr.length) {
        arr.forEach((element, index) => {
            tempUrl[element] = urlDatabase[element];
        }); }
return tempUrl;
}
//____________________________________________________________________________________________________________//