const express = require("express");
const nunjuncks = require("nunjucks");

const server = express();

server.use(express.static("public"));

nunjuncks.configure("src/views", {
  express: server,
  noCache: true,
});

server.get("/", (req, res) => {
  return res.render("index.html", { title: "Um título" });
});

server.get("/create-point", (req, res) => {
  return res.render("create-point.html");
});

server.get("/search", (req, res) => {
  return res.render("search-results.html");
});

server.listen(3000);
