import express from 'express';
import db from './db/db';
import bodyParser from 'body-parser';
import mollieClient from '@mollie/api-client';
import http from 'http';

const mollie = mollieClient(
  { apiKey: 'test_RHmg4uuCq8fWS6vH7dSaGBm4SMuajk' }
);

// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json()) // This is to request body from the pay request
app.use(express.urlencoded({ extended: true })); // This is to get the id from the request body of mollie's webhook 

app.post('/api/v1/pay', async (req, res) => {
  // console.log(req);
  if (req.body.amount == null) {
    return res.status(400).send({
      success: 'false',
      message: 'amount is required'
    });
  } else if (req.body.currency == null) {
    return res.status(400).send({
      success: 'false',
      message: 'currency is required'
    });
  } else if (req.body.description == null) {
    return res.status(400).send({
      success: 'false',
      message: 'description is required'
    });
  }
  else {
    const payment = await mollie.payments.create({
      amount: {
        currency: req.body.currency,
        value: req.body.amount,
      },
      description: req.body.description,
      redirectUrl: 'mollie://payment-return',
      webhookUrl: req.body.webhookUrl,
      metadata: {
        order_id: req.body.orderid
      },
      // checkoutUrl: 'https://442a-182-178-218-57.in.ngrok.io/mollie/create/order',
    });
    return res.status(200).send({
      // checkoutUrl: payment.webhookUrl, 
      success: 'true',
      message: "paid successfully",
      payment: payment,
    });
  }

});

app.post('/webhook', async (req, res) => {
  const paymentId = req.body.id;
  const payment = await mollie.payments.get(paymentId);
  // Update your DB HERE based on the status of the payment
  res.status(200).send();
});

// get all todos
app.get('/api/v1/todos', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully',
    todos: db
  })
});

// port 
const PORT = process.env.PORT || 8080;


const server = http.createServer((req, res) => {
  res.end('Pictowin Server');
});

server.listen(PORT, (err) => {
  if (err) return console.log(`Something bad happened: ${err}`);
  console.log(`Node.js server listening on ${PORT}`);
});