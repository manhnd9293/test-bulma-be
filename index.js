const express = require("express");
require('dotenv').config();
const {connectDb} = require("./config/db/mongo");
require("./config/aws/aws");
require('./config/uploadFile')
const {rootRouter} = require("./routes/rootRouter");
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());
app.use('/', rootRouter);


async function start() {
  await connectDb();
  let port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`server running on port 5000`);
  })
}

start();