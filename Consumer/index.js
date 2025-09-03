import express from "express";
import amqp from "amqplib";

const app = express();
app.use(express.json());
app.use(express.static("public"));

let client = null;
let lastMessagaes = [];

async function startConsumer() {
  const connection = await amqp.connect("amqp://localhost");

  const channel = await connection.createChannel();

  const queue = "messageQueue";

  channel.assertQueue(queue, { durable: false });

  channel.consume(
    queue,
    function msg(msg) {
      console.log("[x] Received: ", msg.content.toString());
      if (client) {
        client.write(`data: ${msg.content.toString()}\n\n`);
      } else {
        lastMessagaes.push(msg.content.toString());
      }
    },
    { noAck: true }
  );
}

startConsumer();

app.get("/messages", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  client = res;

  if (lastMessagaes.length > 0) {
    lastMessagaes.forEach((message) => {
      res.write(`data: ${message}\n\n`);
    });
    lastMessagaes = [];
  }

  req.on("close", () => {
    console.log("Client disconnected");
    client = null;
  });
});

app.get("/", (req, res) => {
  res.status(200).sendFile("index.html");
});

app.listen(3000, () => {
  console.log("Consumer running");
});
