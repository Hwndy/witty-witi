/**
 * Deployment script for order fixes
 * 
 * This script applies all the necessary fixes to the order system:
 * 1. Updates the order controller to handle different item formats
 * 2. Adds CORS configuration
 * 3. Updates the order model validation
 */

const fs = require('fs');
const path = require('path');

console.log('Starting deployment of order fixes...');

// Paths to files
const orderControllerPath = path.join(__dirname, 'controllers', 'orderController.js');
const orderControllerFixedPath = path.join(__dirname, 'controllers', 'orderController.fixed.js');
const corsMiddlewarePath = path.join(__dirname, 'middleware', 'cors.js');
const serverPath = path.join(__dirname, 'server.js');

// Check if files exist
if (!fs.existsSync(orderControllerFixedPath)) {
  console.error('Error: orderController.fixed.js not found. Please make sure it exists.');
  process.exit(1);
}

// Apply the fixes
try {
  // 1. Update the order controller
  console.log('Updating order controller...');
  fs.copyFileSync(orderControllerFixedPath, orderControllerPath);
  console.log('Order controller updated successfully.');

  // 2. Check if CORS middleware exists, if not create it
  if (!fs.existsSync(corsMiddlewarePath)) {
    console.log('Creating CORS middleware...');
    const corsMiddleware = `const cors = require('cors');

// CORS Configuration
const corsOptions = {
  origin: [
    'https://witty-witi.vercel.app',
    'https://witty-witi-git-main-hwndy.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Export the CORS middleware with options
module.exports = cors(corsOptions);`;

    fs.writeFileSync(corsMiddlewarePath, corsMiddleware);
    console.log('CORS middleware created successfully.');
  } else {
    console.log('CORS middleware already exists. Skipping creation.');
  }

  // 3. Update server.js to use CORS middleware if not already using it
  if (fs.existsSync(serverPath)) {
    console.log('Checking server.js for CORS middleware...');
    let serverContent = fs.readFileSync(serverPath, 'utf8');
    
    if (!serverContent.includes('require(\'./middleware/cors\')') && 
        !serverContent.includes("require('./middleware/cors')")) {
      
      // Add CORS middleware import
      let updatedContent = serverContent;
      
      // Find the express import
      const expressImportRegex = /const\s+express\s*=\s*require\s*\(\s*['"]express['"]\s*\)/;
      const corsImport = "const corsMiddleware = require('./middleware/cors');";
      
      if (expressImportRegex.test(serverContent)) {
        // Add CORS import after express import
        updatedContent = serverContent.replace(
          expressImportRegex,
          `$&\n${corsImport}`
        );
      } else {
        // If express import not found, add at the beginning
        updatedContent = `${corsImport}\n${serverContent}`;
      }
      
      // Find app.use statements to add CORS middleware
      const appUseRegex = /app\.use\s*\(/;
      if (appUseRegex.test(updatedContent)) {
        // Add CORS middleware before the first app.use
        updatedContent = updatedContent.replace(
          appUseRegex,
          `app.use(corsMiddleware);\n\n$&`
        );
      }
      
      // Write the updated content back to server.js
      fs.writeFileSync(serverPath, updatedContent);
      console.log('Added CORS middleware to server.js');
    } else {
      console.log('CORS middleware already in server.js. Skipping update.');
    }
  } else {
    console.log('server.js not found. Please manually add CORS middleware to your server file.');
  }

  console.log('\nDeployment completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Restart your server to apply the changes');
  console.log('2. Test order creation from the frontend');
  console.log('3. Check server logs for any errors');
  
} catch (error) {
  console.error('Error during deployment:', error);
  process.exit(1);
}
