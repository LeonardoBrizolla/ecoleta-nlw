const express = require("express");
const nunjuncks = require("nunjucks");

const db = require("./database/db");

const server = express();

// Configura a pasta publica
server.use(express.static("public"));

// Habilita o uso do req.body na nossa aplicacao
server.use(express.urlencoded({ extended: true }));

nunjuncks.configure("src/views", {
  express: server,
  noCache: true,
});

server.get("/", (req, res) => {
  return res.render("index.html", { title: "Um título" });
});

server.get("/create-point", (req, res) => {
  console.log(req.query);

  return res.render("create-point.html");
});

server.post("/savepoint", (req, res) => {
  // req.body: O Corpo do nosso formulário
  // console.log(req.body);

  // Inseri dados no DB
  const query = `
      INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
      ) VALUES (?,?,?,?,?,?,?);
      `;

  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items,
  ];

  function afterInsertData(err) {
    if (err) {
      console.log(err);
      return res.send("Erro no cadastro!");
    }

    console.log("Cadastrado com sucesso");
    console.log(this);

    return res.render("create-point.html", { saved: true });
  }

  db.run(query, values, afterInsertData);
});

server.get("/search", (req, res) => {
  const search = req.query.search;

  if (search == "") {
    // Pesquisa vazia
    return res.render("search-results.html", { total: 0 });
  }

  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (
    err,
    rows
  ) {
    if (err) {
      return console.log(err);
    }

    const total = rows.length;

    // Mostrar a página html com os dados do banco da dedos
    return res.render("search-results.html", { places: rows, total });
  });
});

server.listen(3000);
