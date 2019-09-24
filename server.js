const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.use(express.static(`${__dirname}/src/data/`));

const port = 9000;

app.listen(port, () => console.log(`Listening very intently to ${port}`));