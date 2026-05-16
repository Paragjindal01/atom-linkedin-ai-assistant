const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/business-profile", require("./routes/businessProfile"));
app.use("/api/campaigns", require("./routes/campaigns"));
app.use("/api/content", require("./routes/content"));
app.use("/api/dashboard", require("./routes/dashboard"));

// Basic route
app.get('/', (req, res) => {
  res.send('AI Marketing API running');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
