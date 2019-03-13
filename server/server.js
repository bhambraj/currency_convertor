const express = require('express');
const app = express();
const port = 5000;

app.get('/api/getRates', (req, res) => {
  res.send(`I'll start serving rates very soon, Stay Tuned!`);
});
app.listen(port, () => console.log(`Server started on port ${port}`));
