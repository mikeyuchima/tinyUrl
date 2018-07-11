var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
    res.render("urls_new");
});

app.post("/urls", (req, res) => {
    let shrtURL = generateRandomString();
    urlDatabase[shrtURL] = req.body.longURL;
    res.redirect(`http://localhost:8080/urls/${shrtURL}`)
});

app.get("/urls/:id", (req, res) => {
    let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id] };
    res.render("urls_show", templateVars);
  });

app.get("/u/:shortURL", (req, res) => {
    let shortUrl = req.params.shortURL;
    let longURL = urlDatabase[shortUrl];
    res.redirect(longURL);
});

app.get("/urls/:id/update", (req, res) => {
    res.render("urls_show", { shortURL: req.params.id });
});

app.post("/urls/:id/update", (req, res) => {
    let shortUrl = req.params.id;
    let longURL = req.body.longURL;
    console.log(req.params);
    console.log(req.body)
    urlDatabase[shortUrl] = longURL; //.body/.params????
    res.render("urls_index", { urls: urlDatabase });
});

app.post("/urls/:id/delete", (req ,res) => {
    delete urlDatabase[req.params.id];
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
    let rand = '';

    for (let i = 0; i < 6; i++) {
        rand += Math.floor(Math.random() * Math.floor(10));
    }
    return rand;
}