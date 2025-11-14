require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const claimRoutes = require('./routes/claims');
const verifyRoutes = require('./routes/verify');
const { initializeBlockchain } = require('./services/blockchainService');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adhikar', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  initializeBlockchain();
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

app.use('/api/auth', authRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/verify', verifyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
