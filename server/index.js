// server.js
const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "*", // Allow all origins for simplicity; adjust as needed
    methods: ["GET", "POST"], // Specify allowed methods
    allowedHeaders: ["Content-Type"], // Specify allowed headers
  })
);

app.get("/stream", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  let counter = 0;
  const interval = setInterval(() => {
    counter++;
    res.write(`data: Update #${counter} at ${new Date().toISOString()}\n\n`);
  }, 2000);

  req.on("close", () => {
    clearInterval(interval);
  });
});

app.listen(3000, () => console.log("SSE server listening on port 3000"));
