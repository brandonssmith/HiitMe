require('dotenv').config();

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'PORT',
  'NODE_ENV'
];

console.log('Testing environment variables...\n');

// Check if all required variables are present
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  process.exit(1);
}

// Test MongoDB connection string format
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri.startsWith('mongodb+srv://')) {
  console.error('❌ MONGODB_URI should be a MongoDB Atlas connection string');
  process.exit(1);
}

// Test JWT secret length (should be at least 32 characters)
const jwtSecret = process.env.JWT_SECRET;
if (jwtSecret.length < 32) {
  console.error('❌ JWT_SECRET should be at least 32 characters long');
  process.exit(1);
}

// Test Google OAuth credentials format
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId.includes('.apps.googleusercontent.com')) {
  console.error('❌ GOOGLE_CLIENT_ID appears to be invalid');
  process.exit(1);
}

if (googleClientSecret.length < 24) {
  console.error('❌ GOOGLE_CLIENT_SECRET appears to be invalid');
  process.exit(1);
}

// Test PORT is a number
const port = parseInt(process.env.PORT);
if (isNaN(port) || port < 1 || port > 65535) {
  console.error('❌ PORT should be a number between 1 and 65535');
  process.exit(1);
}

// Test NODE_ENV
const nodeEnv = process.env.NODE_ENV;
if (!['development', 'production', 'test'].includes(nodeEnv)) {
  console.error('❌ NODE_ENV should be one of: development, production, test');
  process.exit(1);
}

// If we get here, all tests passed
console.log('✅ All environment variables are properly configured!\n');

// Print current configuration (without sensitive values)
console.log('Current configuration:');
console.log('----------------------');
console.log(`MONGODB_URI: ${mongoUri.substring(0, 20)}...`);
console.log(`JWT_SECRET: ${jwtSecret.substring(0, 10)}...`);
console.log(`GOOGLE_CLIENT_ID: ${googleClientId.substring(0, 20)}...`);
console.log(`GOOGLE_CLIENT_SECRET: ${googleClientSecret.substring(0, 10)}...`);
console.log(`PORT: ${port}`);
console.log(`NODE_ENV: ${nodeEnv}`); 