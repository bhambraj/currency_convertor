const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const cors = require('cors');

// Stores the conversion factor that will be multiplied by input from the fron-end
let conversionFactor = 0;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
 *   Calculates exchange rates for input from the request
 *   Conversion Algorithm: input X (2 + random markup between 0 and 1)
 *   Calculation is not based on the currency selected as there are no specifications outlined in the document
 *      `conversionFactor` will be updated every 100ms.
 *   If there are 100 requests in that window of time,
 *      every request will get the same conversion factor
 */
app.post('/api/getRates', (req, res) => {
  let amount = req.body.amount;
  if (amount && !isNaN(amount)) {
    amount = getParsedAmount(amount);
  } else {
    amount = 0;
  }
  res.send({
    calculatedValue: getParsedAmount(conversionFactor * amount),
    usdEquivalent: conversionFactor
  });
});
app.listen(port, () => {
  console.log(`Starting the server at port -> ${port}`);
  setInterval(() => {
    conversionFactor = getParsedAmount(2 + Math.random());
  }, 100);
});

function getParsedAmount(value) {
  return parseFloat(value).toFixed(2);
}
