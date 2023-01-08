const express = require("express");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use("/api", require("./v1/routes/schema"));

app.listen(port, console.log(`Server is running at port: ${port}`));
