import express from "express";
import amqp from "amqplib";

const app = express();
app.use(express.json());

app.use(express.static("public"));

const connection = await amqp.connect("amqp://localhost");
const channel = await connection.createChannel();
const queue = "messageQueue";

await channel.assertQueue(queue, {
  durable: false,
});

app.post("/send-message", async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === "") {
    res.status(400).json({ status: "Please enter a message to send" });
  }

  try {
    channel.sendToQueue(queue, Buffer.from(message.trim()));

    console.log("[x] Sent:", message);

    res.status(200).json({
      success: true,
      message: `${message}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      status: "Error sending message",
      err,
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.listen(5000, () => {
  console.log("Producer running");
});
