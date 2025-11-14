require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function createUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing users if they exist
    await User.deleteMany({ username: { $in: ['Piyyy', 'PiyyyAdmin'] } });

    // Create regular user
    const userPassword = await bcrypt.hash('password123', 10);
    const user = new User({
      username: 'Piyyy',
      password: userPassword,
      role: 'user'
    });
    await user.save();

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      username: 'PiyyyAdmin',
      password: adminPassword,
      role: 'admin'
    });
    await admin.save();

    console.log('\n✅ Users created successfully!');
    console.log('================================');
    console.log('User Account:');
    console.log('  Username: Piyyy');
    console.log('  Password: password123');
    console.log('  Role: user');
    console.log('');
    console.log('Admin Account:');
    console.log('  Username: PiyyyAdmin');
    console.log('  Password: admin123');
    console.log('  Role: admin');
    console.log('================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
}

createUsers();
