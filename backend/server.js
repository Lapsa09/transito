const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3001;

require("dotenv").config;

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", require("./routes/index"));

app.listen(port);
