import express from "express";
import amqp from "amqplib";

const app = express();
app.use(express.json());

async function receiveMsg() {
  const connection = await amqp.connect("amqp://localhost");

  const channel = await connection.createChannel();

  const queue = "messageQueue";

  channel.assertQueue(queue, { durable: false });

  console.log(" [*] Waiting for messages in:", queue);

  channel.consume(
    queue,
    function msg(msg) {
      console.log("[x] Received: ", msg.content.toString());
    },
    { noAck: true }
  );
}
receiveMsg();

app.listen(3000, () => {
  console.log("Server running");
});
