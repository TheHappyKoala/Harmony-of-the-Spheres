const express = require('express');
const app = express();

app.use(express.static(`${__dirname}/dist/`));

const port = process.env.PORT;

app.listen(port, () => console.log(`Listening to ${port}`));