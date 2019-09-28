const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");
const PORT = 3000;
const app = express();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newScrapper";

app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"));


mongoose.connect(MONGODB_URI);


app.get("/scrape", function(req, res) {
    axios.get("http://www.vice.com/en_us/topic/hacking/").then(function(response){
        const $ = cheerio.load(response.data);
        
        $(".grid__wrapper__card").each(function(i, element) {
            const result = {};
            result.title = $(this).children('.grid__wrapper__card__text').children().children('h2').text();
            result.link = $(this).attr("href");

            // console.log(result);

            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle)
            })
            .catch(function(err) {
                console.log(err)
            });
        });
        res.send("Complete!");
    });
});

app.get("/articles", function(req,res) {
    db.Article.find({})
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    })
});

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: db.Note._id}, { new: true });        
    })
    .lthen(function(dbArticle) {
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    })
});

  

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
})