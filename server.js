const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRE = '7d';

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000', 
    'http://localhost:5500', 
    'http://127.0.0.1:5500',
    'https://hotelweb-1990.onrender.com',
    'https://hotelweb-frontend.onrender.com'
  ],
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.static('.'));

// Data directories
const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');
const ownersFile = path.join(dataDir, 'owners.json');
const adminFile = path.join(dataDir, 'admin.json');
const bookingsFile = path.join(dataDir, 'bookings.json');
const paymentsFile = path.join(dataDir, 'payments.json');
const tokensFile = path.join(dataDir, 'tokens.json');

// In-memory OTP storage (use database in production)
const otpStore = {};

// Validation functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\+\(\)]/g, ''));
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendOTP(email, phone, otp) {
  console.log(`\n📧 OTP for ${email}: ${otp}`);
  console.log(`📱 OTP for ${phone}: ${otp}\n`);
  return otp;
}

// Hash password
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Password hashing failed');
  }
}

// Compare password
async function comparePassword(password, storedPassword) {
  try {
    // First try bcrypt comparison (for hashed passwords)
    try {
      const match = await bcrypt.compare(password, storedPassword);
      if (match) return true;
    } catch (bcryptError) {
      // If bcrypt fails, try plain text comparison (for testing/backwards compatibility)
      if (password === storedPassword) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
}

// Generate JWT Token
function generateToken(userId, userType) {
  return jwt.sign(
    { userId, userType, timestamp: Date.now() },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
}

// Verify JWT Token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
}

// Admin Auth Middleware
function authenticateAdmin(req, res, next) {
  authenticateToken(req, res, () => {
    const owners = readData(ownersFile);
    const owner = owners.find(o => o.id === req.user.userId && o.isAdmin);

    if (!owner || !owner.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    req.adminUser = owner;
    next();
  });
}

// Ensure data directory and files exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

function ensureFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  }
}

ensureFile(usersFile);
ensureFile(ownersFile);
ensureFile(bookingsFile);
ensureFile(paymentsFile);
ensureFile(tokensFile);

// Helper functions
function readData(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) || [];
  } catch (error) {
    return [];
  }
}

function writeData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    return false;
  }
}

// ============= CUSTOMER ROUTES =============

app.post('/api/customer/register', async (req, res) => {
  const { fullName, email, phone, password, confirmPassword } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  if (!isValidPhone(phone)) {
    return res.status(400).json({ success: false, message: 'Invalid phone number (10-15 digits required)' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const users = readData(usersFile);
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const otp = generateOTP();
  const tempId = Date.now();

  otpStore[tempId] = {
    fullName,
    email,
    phone,
    password,
    otp,
    type: 'customer',
    createdAt: Date.now(),
    attempts: 0
  };

  sendOTP(email, phone, otp);

  return res.status(200).json({
    success: true,
    message: 'OTP sent to email and phone',
    tempId,
    requiresOTP: true
  });
});

app.post('/api/customer/verify-otp', async (req, res) => {
  const { tempId, otp } = req.body;

  if (!tempId || !otp) {
    return res.status(400).json({ success: false, message: 'OTP and tempId required' });
  }

  const tempData = otpStore[tempId];

  if (!tempData) {
    return res.status(400).json({ success: false, message: 'Invalid OTP request. Please register again.' });
  }

  if (Date.now() - tempData.createdAt > 5 * 60 * 1000) {
    delete otpStore[tempId];
    return res.status(400).json({ success: false, message: 'OTP expired. Please register again.' });
  }

  if (tempData.attempts >= 3) {
    delete otpStore[tempId];
    return res.status(400).json({ success: false, message: 'Too many attempts. Please register again.' });
  }

  if (tempData.otp !== otp.toString()) {
    tempData.attempts++;
    return res.status(400).json({ success: false, message: `Invalid OTP. ${3 - tempData.attempts} attempts remaining.` });
  }

  try {
    const hashedPassword = await hashPassword(tempData.password);
    const users = readData(usersFile);
    const newUser = {
      id: Date.now(),
      fullName: tempData.fullName,
      email: tempData.email,
      phone: tempData.phone,
      password: hashedPassword,
      registeredAt: new Date().toISOString(),
      verified: true,
      lastLogin: new Date().toISOString()
    };

    users.push(newUser);
    writeData(usersFile, users);
    delete otpStore[tempId];

    const token = generateToken(newUser.id, 'customer');

    return res.status(201).json({
      success: true,
      message: 'Account verified successfully',
      token,
      user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email }
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.post('/api/customer/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  try {
    const users = readData(usersFile);
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const userIndex = users.findIndex(u => u.email === email);
    users[userIndex].lastLogin = new Date().toISOString();
    writeData(usersFile, users);

    const token = generateToken(user.id, 'customer');

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Get customer profile
app.get('/api/customer/profile', authenticateToken, (req, res) => {
  const users = readData(usersFile);
  const user = users.find(u => u.id === req.user.userId);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({
    success: true,
    user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, registeredAt: user.registeredAt }
  });
});

// ============= OWNER ROUTES =============

app.post('/api/owner/register', async (req, res) => {
  console.log('\n🔵 [OWNER REGISTER] Request received');
  console.log('📦 Body:', req.body);
  
  const { hostelName, ownerEmail, phone, location, password, confirmPassword } = req.body;

  if (!hostelName || !ownerEmail || !phone || !location || !password) {
    console.log('❌ Missing fields');
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  if (!isValidEmail(ownerEmail)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  if (!isValidPhone(phone)) {
    return res.status(400).json({ success: false, message: 'Invalid phone number (10-15 digits required)' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const owners = readData(ownersFile);
  if (owners.find(o => o.ownerEmail === ownerEmail)) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const otp = generateOTP();
  const tempId = Date.now();

  otpStore[tempId] = {
    hostelName,
    ownerEmail,
    phone,
    location,
    password,
    otp,
    type: 'owner',
    createdAt: Date.now(),
    attempts: 0
  };

  sendOTP(ownerEmail, phone, otp);

  return res.status(200).json({
    success: true,
    message: 'OTP sent to email and phone',
    tempId,
    requiresOTP: true
  });
});

app.post('/api/owner/verify-otp', async (req, res) => {
  const { tempId, otp } = req.body;

  if (!tempId || !otp) {
    return res.status(400).json({ success: false, message: 'OTP and tempId required' });
  }

  const tempData = otpStore[tempId];

  if (!tempData) {
    return res.status(400).json({ success: false, message: 'Invalid OTP request. Please register again.' });
  }

  if (Date.now() - tempData.createdAt > 5 * 60 * 1000) {
    delete otpStore[tempId];
    return res.status(400).json({ success: false, message: 'OTP expired. Please register again.' });
  }

  if (tempData.attempts >= 3) {
    delete otpStore[tempId];
    return res.status(400).json({ success: false, message: 'Too many attempts. Please register again.' });
  }

  if (tempData.otp !== otp.toString()) {
    tempData.attempts++;
    return res.status(400).json({ success: false, message: `Invalid OTP. ${3 - tempData.attempts} attempts remaining.` });
  }

  try {
    const hashedPassword = await hashPassword(tempData.password);
    const owners = readData(ownersFile);
    const newOwner = {
      id: Date.now(),
      hostelName: tempData.hostelName,
      ownerEmail: tempData.ownerEmail,
      phone: tempData.phone,
      location: tempData.location,
      password: hashedPassword,
      registeredAt: new Date().toISOString(),
      isApproved: false,
      isAdmin: false,
      verified: true,
      lastLogin: new Date().toISOString()
    };

    owners.push(newOwner);
    writeData(ownersFile, owners);
    delete otpStore[tempId];

    const token = generateToken(newOwner.id, 'owner');

    return res.status(201).json({
      success: true,
      message: 'Registration verified. Awaiting admin approval.',
      token,
      owner: { id: newOwner.id, hostelName: newOwner.hostelName, ownerEmail: newOwner.ownerEmail, location: newOwner.location }
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.post('/api/owner/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  try {
    const owners = readData(ownersFile);
    const owner = owners.find(o => o.ownerEmail === email);

    if (!owner) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordValid = await comparePassword(password, owner.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const ownerIndex = owners.findIndex(o => o.ownerEmail === email);
    owners[ownerIndex].lastLogin = new Date().toISOString();
    writeData(ownersFile, owners);

    const token = generateToken(owner.id, 'owner');

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      owner: { id: owner.id, hostelName: owner.hostelName, ownerEmail: owner.ownerEmail, location: owner.location, isApproved: owner.isApproved }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Admin Login Endpoint
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  try {
    const admins = readData(adminFile);
    const admin = admins.find(a => a.email === email);

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const adminIndex = admins.findIndex(a => a.email === email);
    admins[adminIndex].lastLogin = new Date().toISOString();
    writeData(adminFile, admins);

    const token = generateToken(admin.id, 'admin');

    return res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Get owner profile
app.get('/api/owner/profile', authenticateToken, (req, res) => {
  const owners = readData(ownersFile);
  const owner = owners.find(o => o.id === req.user.userId);

  if (!owner) {
    return res.status(404).json({ success: false, message: 'Owner not found' });
  }

  res.json({
    success: true,
    owner: { id: owner.id, hostelName: owner.hostelName, ownerEmail: owner.ownerEmail, phone: owner.phone, location: owner.location, isApproved: owner.isApproved }
  });
});

// ============= BOOKING ROUTES =============

app.post('/api/booking/create', authenticateToken, (req, res) => {
  const { roomType, checkIn, checkOut, nights, totalAmount } = req.body;

  if (!roomType || !checkIn || !checkOut || !nights || !totalAmount) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  const booking = {
    id: 'BK' + Date.now(),
    userId: req.user.userId,
    roomType,
    checkIn,
    checkOut,
    nights,
    totalAmount,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const bookings = readData(bookingsFile);
  bookings.push(booking);
  writeData(bookingsFile, bookings);

  return res.status(201).json({ success: true, booking });
});

app.get('/api/booking/list', authenticateToken, (req, res) => {
  const bookings = readData(bookingsFile);
  const userBookings = bookings.filter(b => b.userId === req.user.userId);
  res.json({ success: true, bookings: userBookings });
});

// ============= PAYMENT ROUTES =============

app.post('/api/payment/process', (req, res) => {
  const { paymentMethod, amount, bookingId, cardName, cardEmail, upiId, upiName } = req.body;

  if (!paymentMethod || !amount) {
    return res.status(400).json({ success: false, message: 'Payment method and amount required' });
  }

  const paymentRecord = {
    id: Date.now().toString(),
    bookingId: bookingId || 'BK' + Date.now(),
    paymentMethod,
    amount,
    status: 'completed',
    timestamp: new Date().toISOString(),
    customerInfo: paymentMethod === 'card'
      ? { name: cardName, email: cardEmail, cardLast4: '****' }
      : { name: upiName, email: cardEmail, upiId: upiId }
  };

  const payments = readData(paymentsFile);
  payments.push(paymentRecord);
  writeData(paymentsFile, payments);

  console.log(`\n💳 Payment Received:`);
  console.log(`   Booking ID: ${paymentRecord.bookingId}`);
  console.log(`   Method: ${paymentMethod.toUpperCase()}`);
  console.log(`   Amount: ₹${amount}`);
  console.log(`   Status: Completed ✅\n`);

  return res.status(200).json({
    success: true,
    message: 'Payment processed successfully',
    bookingId: paymentRecord.bookingId,
    paymentId: paymentRecord.id
  });
});

// ============= ADMIN ROUTES =============

app.get('/api/admin/dashboard', authenticateAdmin, (req, res) => {
  const users = readData(usersFile);
  const owners = readData(ownersFile);
  const bookings = readData(bookingsFile);
  const payments = readData(paymentsFile);

  const stats = {
    totalUsers: users.length,
    totalOwners: owners.length,
    approvedOwners: owners.filter(o => o.isApproved).length,
    pendingOwners: owners.filter(o => !o.isApproved).length,
    totalBookings: bookings.length,
    totalRevenue: payments.reduce((sum, p) => sum + p.amount, 0),
    totalPayments: payments.length
  };

  res.json({ success: true, stats });
});

app.get('/api/admin/users', authenticateAdmin, (req, res) => {
  const users = readData(usersFile).map(u => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    phone: u.phone,
    registeredAt: u.registeredAt,
    lastLogin: u.lastLogin
  }));
  res.json(users);
});

app.get('/api/admin/owners', authenticateAdmin, (req, res) => {
  const owners = readData(ownersFile);
  res.json(owners);
});

app.post('/api/admin/approve-owner/:ownerId', authenticateAdmin, (req, res) => {
  const { ownerId } = req.params;
  const owners = readData(ownersFile);
  const ownerIndex = owners.findIndex(o => o.id == ownerId);

  if (ownerIndex === -1) {
    return res.status(404).json({ success: false, message: 'Owner not found' });
  }

  owners[ownerIndex].isApproved = true;
  writeData(ownersFile, owners);

  console.log(`✅ Owner ${owners[ownerIndex].hostelName} approved!`);
  res.json({ success: true, message: 'Owner approved successfully' });
});

app.get('/api/admin/payments', authenticateAdmin, (req, res) => {
  const payments = readData(paymentsFile);
  res.json(payments);
});

app.get('/api/admin/bookings', authenticateAdmin, (req, res) => {
  const bookings = readData(bookingsFile);
  res.json(bookings);
});

// ============= CHATBOT ENDPOINT =============

app.post('/api/chatbot/message', (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, message: 'Message required' });
  }

  const chatbotKnowledge = {
    booking: ['📅 **Booking Information:**\n\n• Visit our website and click \'Login\' to create an account\n• Browse available rooms and select your dates\n• Complete the booking process with your payment details\n• You\'ll receive a confirmation email immediately\n• Check-in: 2:00 PM | Check-out: 11:00 AM'],
    pricing: ['💰 **Room Pricing:**\n\n• **Standard Room**: $80-100/night\n• **Deluxe Room**: $120-150/night\n• **Suite**: $200-250/night\n• **Private Cabin**: $300-400/night'],
    contact: ['📞 **Contact GoCabn Go:**\n\n📍 Address: 3015 Grand Ave, Coconut Grove, FL 123456\n📧 Email: support@gocabingo.com\n📱 Phone: +1 234-567-8900'],
    facilities: ['✨ **GoCabn Go Premium Services:**\n\n🏊 Swimming Pool & Spa\n🍽️ Multi-cuisine Restaurant\n🎵 Live Music Entertainment\n🚴 Curated Experiences & Activities'],
    default: ['I\'m here to help! Feel free to ask about:\n• Booking\n• Pricing\n• Contact info\n• Facilities\n\nWhat can I assist with?']
  };

  const keywords = {
    booking: ['book', 'reserve', 'reservation', 'check-in'],
    pricing: ['price', 'cost', 'rate', 'fee'],
    contact: ['contact', 'phone', 'email', 'address'],
    facilities: ['facility', 'facilities', 'amenity', 'amenities', 'offer']
  };

  let intent = 'default';
  const lowerMessage = message.toLowerCase();

  for (const [key, keywordList] of Object.entries(keywords)) {
    if (keywordList.some(kw => lowerMessage.includes(kw))) {
      intent = key;
      break;
    }
  }

  const responses = chatbotKnowledge[intent];
  const botResponse = responses[Math.floor(Math.random() * responses.length)];

  res.status(200).json({
    success: true,
    message: botResponse,
    intent
  });
});

// ========== USER DASHBOARD ENDPOINTS ==========

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

// Search hotels by location (latitude, longitude, radius in km)
app.get('/api/hotels/search-by-location', (req, res) => {
  try {
    const { lat, lon, radius = 50 } = req.query;

    console.log(`\n🔍 [LOCATION SEARCH] Received: lat=${lat}, lon=${lon}, radius=${radius}`);

    if (!lat || !lon) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude required' 
      });
    }

    const userLat = parseFloat(lat);
    const userLon = parseFloat(lon);
    const searchRadius = parseFloat(radius);

    const owners = readData(ownersFile);
    console.log(`📊 Total owners in database: ${owners.length}`);
    
    const approvedOwners = owners.filter(o => o.isApproved && o.latitude && o.longitude);
    console.log(`✅ Approved owners with coordinates: ${approvedOwners.length}`);

    const nearbyHotels = approvedOwners
      .map(owner => {
        const distance = calculateDistance(
          userLat, 
          userLon, 
          parseFloat(owner.latitude), 
          parseFloat(owner.longitude)
        );
        return {
          ...owner,
          distance: Math.round(distance * 10) / 10
        };
      })
      .filter(hotel => hotel.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance);

    console.log(`📍 Found ${nearbyHotels.length} hotels within ${searchRadius}km\n`);

    return res.status(200).json({
      success: true,
      hotels: nearbyHotels,
      total: nearbyHotels.length,
      searchRadius: searchRadius,
      userLocation: { lat: userLat, lon: userLon }
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Search failed' 
    });
  }
});

// Search by location name (city, area)
app.get('/api/hotels/search-by-name', (req, res) => {
  try {
    const { location, limit = 20 } = req.query;

    if (!location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Location name required' 
      });
    }

    const owners = readData(ownersFile);
    const searchTerm = location.toLowerCase();
    const results = owners
      .filter(owner => 
        owner.isApproved && 
        owner.location && 
        owner.location.toLowerCase().includes(searchTerm)
      )
      .slice(0, parseInt(limit));

    return res.status(200).json({
      success: true,
      hotels: results,
      total: results.length,
      searchTerm: location
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Search failed' 
    });
  }
});

// Get all registered hotels
app.get('/api/hotels/list', (req, res) => {
  try {
    const owners = readData(ownersFile);
    const hotels = owners.filter(owner => owner.isApproved).map(owner => ({
      id: owner.id,
      hostelName: owner.hostelName,
      ownerEmail: owner.ownerEmail,
      phone: owner.phone,
      location: owner.location,
      registeredAt: owner.registeredAt
    }));
    
    return res.status(200).json({
      success: true,
      hotels: hotels,
      total: hotels.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch hotels' });
  }
});

// Get user bookings by email
app.get('/api/booking/list', (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const bookings = readData(bookingsFile);
    const userBookings = bookings.filter(b => b.customerEmail === email);
    
    return res.status(200).json({
      success: true,
      bookings: userBookings,
      total: userBookings.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});

// Get user payments by email
app.get('/api/payment/list', (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const payments = readData(paymentsFile);
    const userPayments = payments.filter(p => p.customerInfo?.email === email);
    
    return res.status(200).json({
      success: true,
      payments: userPayments,
      total: userPayments.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
});

// Get reviews for a specific hotel
app.get('/api/hotels/:hotelId/reviews', (req, res) => {
  try {
    const { hotelId } = req.params;
    const reviews = readData(path.join(dataDir, 'reviews.json'));
    const hotelReviews = reviews.filter(r => r.hotelId == hotelId);
    
    // Sort by newest first
    hotelReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).json({
      success: true,
      reviews: hotelReviews,
      total: hotelReviews.length
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

// Get photos for a specific hotel
app.get('/api/hotels/:hotelId/photos', (req, res) => {
  try {
    const { hotelId } = req.params;
    const photos = readData(path.join(dataDir, 'photos.json'));
    const hotelPhotos = photos.filter(p => p.hotelId == hotelId);
    
    res.status(200).json({
      success: true,
      photos: hotelPhotos,
      total: hotelPhotos.length
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch photos' });
  }
});

// Get average rating for a hotel
app.get('/api/hotels/:hotelId/average-rating', (req, res) => {
  try {
    const { hotelId } = req.params;
    const reviews = readData(path.join(dataDir, 'reviews.json'));
    const hotelReviews = reviews.filter(r => r.hotelId == hotelId);
    
    if (hotelReviews.length === 0) {
      return res.status(200).json({
        success: true,
        averageRating: 0,
        totalReviews: 0
      });
    }
    
    const averageRating = (hotelReviews.reduce((sum, r) => sum + r.rating, 0) / hotelReviews.length).toFixed(1);
    
    res.status(200).json({
      success: true,
      averageRating: parseFloat(averageRating),
      totalReviews: hotelReviews.length
    });
  } catch (error) {
    console.error('Error calculating average rating:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate rating' });
  }
});

// Post a new review (authenticated)
app.post('/api/hotels/:hotelId/reviews', authenticateToken, (req, res) => {
  try {
    const { hotelId } = req.params;
    const { rating, title, review: reviewText } = req.body;
    
    // Validation
    if (!rating || !title || !reviewText) {
      return res.status(400).json({
        success: false,
        message: 'Rating, title, and review text are required'
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    // Check if hotel exists
    const owners = readData(ownersFile);
    const hotel = owners.find(o => o.id == hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }
    
    // Create new review
    const reviews = readData(path.join(dataDir, 'reviews.json'));
    const newReview = {
      id: Date.now(),
      hotelId: parseInt(hotelId),
      hotelName: hotel.hostelName,
      reviewerName: req.user.email.split('@')[0],
      reviewerEmail: req.user.email,
      rating: parseInt(rating),
      title: title,
      review: reviewText,
      createdAt: new Date().toISOString()
    };
    
    reviews.push(newReview);
    fs.writeFileSync(path.join(dataDir, 'reviews.json'), JSON.stringify(reviews, null, 2));
    
    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      review: newReview
    });
  } catch (error) {
    console.error('Error posting review:', error);
    res.status(500).json({ success: false, message: 'Failed to post review' });
  }
});

// Centralized error handlers (placed before server start)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`� GoCabn Go API Server running on http://localhost:${PORT}`);
  console.log(`📁 Data stored in: ${dataDir}`);
});
