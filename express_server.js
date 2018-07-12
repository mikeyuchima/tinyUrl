var express = require("express");
var app = express();
var PORT = 8080; // default port 8080
var express = require('express')
var cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(function (req, res, next) {
    // console.log(req.method + ": " +req.path);
    console.log(req.cookies);
    console.log('____________________________');
    console.log(users);
    console.log('____________________________');
    console.log(urlDatabase);
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    next();
});

var urlDatabase = {
    "ID1": {
        "b2xVn2": "http://www.lighthouselabs.ca",
        "9sm5xK": "http://www.google.com",
    }
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
    if (req.cookies['user_id']){
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
    res.render("urls_register")
});

app.post("/register", (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400);
        res.send('404 ERROR');
    } else if (req.body.email && req.body.password) {
        let idGen = generateRandomString();
        users[idGen] = {id : idGen, email: req.body.email, password: req.body.password, urlLibrary: []};
        urlDatabase[idGen] = {'shortURL': 'longURL'}
        res.cookie('user_id', idGen)
        res.redirect("/urls");
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
    res.render('urls_login', {user: users[req.cookies['user_id']]});
});

app.post("/login", (req, res) => {
    let id = '';

    for(var element in users) {
        if (req.body.email == users[element].email && req.body.password == users[element].password) {
        id = element;

        res.cookie('user_id', id);
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
    res.send('identification error')
});
//____________________________________________________________________________________________________________//

//LOGOUT______________________________________________________________________________________________________//
app.get("/logout", (req, res) => {
    res.clearCookie('user_id');
    res.redirect('/login');
});
//____________________________________________________________________________________________________________//

//HOME________________________________________________________________________________________________________//
app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase[req.cookies['user_id']], user: users[req.cookies['user_id']] };
    res.render("urls_index", templateVars);
});
//____________________________________________________________________________________________________________//

//NEW TINY URL________________________________________________________________________________________________//
app.get("/urls/new", (req, res) => {
    res.render("urls_new", {user: users[req.cookies['user_id']]});
});

app.post("/urls", (req, res) => {
    if (users[req.cookies['user_id']]) {
    let shrtURL = generateRandomString();
    urlDatabase[req.cookies['user_id']][shrtURL] = req.body.longURL;
    res.redirect(`http://localhost:8080/urls/${shrtURL}`)
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

    for (var element in urlDatabase) {
        console.log(element)
        for (var element2 in urlDatabase[element]) {
            console.log(element2)
            console.log(shortUrl)
            if (shortUrl == element2){
                let longURL = urlDatabase[element][element2];
                console.log(longURL)
                res.redirect(longURL);
                return;
            }
        }
    }
});
//____________________________________________________________________________________________________________//

//UPDATE______________________________________________________________________________________________________//
app.get("/urls/:id/update", (req, res) => {
    res.render("urls_show", { shortURL: req.params.id, user: users[req.cookies['user_id']]});
});

app.post("/urls/:id/update", (req, res) => {
    let shortUrl = req.params.id;
    let longURL = req.body.longURL;
    urlDatabase[req.cookies['user_id']][shortUrl] = longURL; //.body/.params????
    res.redirect("/urls");
});
//____________________________________________________________________________________________________________//


//DELETE______________________________________________________________________________________________________//
app.post("/urls/:id/delete", (req ,res) => {
    delete urlDatabase[req.cookies['user_id']][req.params.id];
    res.redirect("/urls");
});
//____________________________________________________________________________________________________________//

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//FUNCTIONS___________________________________________________________________________________________________//
function genID() {
    let rand = '';

    for (let i = 0; i < 3; i++) {
        rand += Math.floor(Math.random() * Math.floor(10));
    }
    return rand;
}

function generateRandomString() {
    let rand = '';

    for (let i = 0; i < 6; i++) {
        rand += Math.floor(Math.random() * Math.floor(10));
    }
    return rand;
}

// function uniqueID(id){
//     let url = {};

// }
//____________________________________________________________________________________________________________//