import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", (req, res) => {
  const { location, crowd } = req.body;

  let risk, route, advice;

  if (crowd > 80) {
    risk = "HIGH";
    route = "Use Gate B";
    advice = "Avoid immediately";
  } else if (crowd > 60) {
    risk = "MEDIUM";
    route = "Alternate route";
    advice = "Delay expected";
  } else {
    risk = "LOW";
    route = "Normal";
    advice = "Smooth flow";
  }

  res.json({
    result: `
    Location: ${location}
    Crowd: ${crowd}%
    Risk: ${risk}
    Route: ${route}
    Advice: ${advice}
    `
  });
});

app.listen(3000, () => console.log("Server running"));