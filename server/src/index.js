const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const routes = require("./routes/routes");

const corsOptions = {
  origin: 'http://localhost:3000' || '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/v1/api", routes);

const url = process.env.port || 4000;

app.listen(url, () => {
  console.log(`🚀 Server running on port ${url}`);
});
