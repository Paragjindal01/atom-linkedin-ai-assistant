const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure CORS
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.CLIENT_URL] 
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/business-profile", require("./routes/businessProfile"));
app.use("/api/campaigns", require("./routes/campaigns"));
app.use("/api/content", require("./routes/content"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/linkedin", require("./routes/linkedin"));

// Basic route
app.get('/', (req, res) => {
  res.send('AI Marketing API running');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server starting up...`);
  console.log(`- Port: ${PORT}`);
  console.log(`- Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`- CORS allowed for: ${process.env.CLIENT_URL}`);
  } else {
    console.log(`- CORS allowed for: local development URLs`);
  }
  console.log(`✅ Server successfully running and ready to accept requests.`);
});
