# magical-auth-quickstart-react
# Secure Phone Authentication - React Quick Start

This is a minimal example demonstrating secure phone authentication using:
- `glide-sdk` for the backend
- `web-client-sdk` for the frontend

## Prerequisites

1. Node.js 16+ installed
2. Glide API credentials (get them from [Glide Documentation](https://docs.glideapi.com/))

## Setup

### Quick Start (External Server)

For immediate testing without backend setup:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the React app:**
   ```bash
   npm run client
   ```

   This uses a pre-configured external server with hosted Glide credentials for quick testing.

### Full Setup (Local Server)

For production use with your own credentials:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Create a `.env` file in the project root:
   ```env
   GLIDE_CLIENT_ID=your_client_id_here
   GLIDE_CLIENT_SECRET=your_client_secret_here
   ```

3. **Local server is ready:**
   
   The `server.ts` file is already provided with complete Glide SDK integration and TypeScript types.

4. **Update client configuration:**
   
   In `src/App.jsx`, uncomment the local server URLs:
   ```javascript
   // Change from external server:
   // const prepareRequest = 'https://checkout-demo-server.glideidentity.dev/generate-get-request';
   // const processResponse = 'https://checkout-demo-server.glideidentity.dev/processCredential';
   
   // To local server:
   const prepareRequest = '/api/phone-auth/prepare';
   const processResponse = '/api/phone-auth/process';
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:3001
   - React app on http://localhost:3000

## Usage

The app demonstrates two main features:

### 1. Get Phone Number
Click "Get My Phone Number" to retrieve the phone number associated with your device.

### 2. Verify Phone Number
Enter a phone number and click "Verify Phone Number" to verify ownership.

## Server Configuration

The app supports two server configurations:

### Option 1: External Server (Default)
```javascript
const prepareRequest = 'https://checkout-demo-server.glideidentity.dev/generate-get-request';
const processResponse = 'https://checkout-demo-server.glideidentity.dev/processCredential';
```
- **Pros**: No backend setup required, instant testing
- **Cons**: Uses shared demo credentials, not for production

### Option 2: Local Server
```javascript
const prepareRequest = '/api/phone-auth/prepare';
const processResponse = '/api/phone-auth/process';
```
- **Pros**: Your own credentials, full control, production-ready
- **Cons**: Requires backend setup and .env configuration

## How It Works

### With Local Server (`server.ts`):
1. **Backend** (already provided):
   - Complete TypeScript implementation with proper type definitions
   - Uses `glide-sdk` to communicate with Glide's API
   - Exposes three endpoints:
      - `POST /api/phone-auth/prepare` - Creates a verification request
      - `POST /api/phone-auth/process` - Processes the verification response
      - `GET /api/health` - Health check with credentials validation
   - Automatically handles response format compatibility and eligibility checks

### With External Server:
1. **Backend**:
   - Pre-configured Glide SDK integration with demo credentials
   - Hosted endpoints handle all authentication logic
   - Same response format as local server

### Frontend (`src/App.jsx`):
- Uses `glide-web-client-sdk/react` for the `usePhoneAuth` hook
- Handles the Digital Credentials API browser flow
- Shows loading states, progress bars, and results
- Supports both "Get Phone Number" and "Verify Phone Number" flows

The integration is designed to be seamless - both server options return properly formatted responses that the Web Client SDK can use directly.

## Browser Support

The Digital Credentials API is currently experimental and requires:
- Chrome/Edge 128+ on Android
- Experimental features may need to be enabled

## Next Steps

- Add error handling for production use
- Implement proper authentication
- Add rate limiting
- Style the UI to match your brand
- Deploy to production

## Troubleshooting

- **"Browser not supported"**: Use a compatible browser with Digital Credentials API support
- **API errors**: Check your Glide credentials in the `.env` file
- **Network errors**: Ensure both servers are running (`npm run dev`) 