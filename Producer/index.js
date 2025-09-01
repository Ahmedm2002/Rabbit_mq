import express from "express";
import amqp from "amqplib";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

app.post("/send-message", async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === "") {
    res.status(400).json({ status: "Please enter a message to send" });
  }

  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "messageQueue";
    await channel.assertQueue("queue", {
      durable: false,
    });
    const sentMsg = channel.sendToQueue(queue, Buffer.from(message), {
      persistent: false,
    });

    console.log("sent msg res: ", sentMsg);

    console.log("✅ Sent:", message);

    res.json({ message: `${message}` });

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Error sending message" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(5000, () => {
  console.log("Server running");
});
