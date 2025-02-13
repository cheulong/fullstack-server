const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 5001;

app.get("/hostname", (req, res) => {
  res.json({ hostname: os.hostname() });
});

app.listen(PORT, () => {
  console.log(process.env.NODE_NAME);
  
  console.log(`Server running on port ${PORT}`);
});
