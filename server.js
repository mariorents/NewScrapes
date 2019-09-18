const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars");
const db = require("./models");
const PORT = 3000;
const app = express();


app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");
mongoose.connect("mongodb://localhost/newScrapper", {
    useNewUrlParser: true
});

app.get("/scrape", function(req, res) {
    axios.get("https://www.vice.com/en_us/topic/hacking").then(function(response){
        const $ = cherrio.load(response.data);
        
        $("a").each(function(i, element) {
            const result = {};
            result.title = $(this).children(".grid__wrapper__card__text__title").text();
            result.link = $(this).attr("href");

            


        });
    });
    res.send("Complete!");
})

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
})