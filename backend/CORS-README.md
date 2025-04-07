# CORS Configuration for Witty-Witi Backend

This file provides instructions for fixing CORS issues in the backend.

## Problem

The frontend deployed on Vercel (https://witty-witi.vercel.app) is experiencing CORS errors when trying to access the backend API (https://witty-witti-backend.onrender.com/api).

## Solution

1. Install the CORS middleware if not already installed:

```bash
npm install cors
```

2. Add the CORS configuration to your main server file (app.js or server.js):

```javascript
const express = require('express');
const cors = require('cors');
const corsOptions = require('./cors-config');

const app = express();

// Apply CORS middleware with the configuration
app.use(cors(corsOptions));

// Rest of your server code...
```

3. Make sure the `cors-config.js` file is in the root directory of your backend project.

## Testing

After implementing these changes, you can test the CORS configuration by:

1. Deploying the updated backend to Render
2. Making a request from the frontend to the backend
3. Checking the browser console for CORS errors

## Additional Notes

- The CORS configuration allows requests from the Vercel deployment and local development environments.
- If you deploy to other environments, add their origins to the `corsOptions.origin` array.
- The configuration allows all common HTTP methods and headers needed for the application.
- Credentials are allowed to support authentication.
