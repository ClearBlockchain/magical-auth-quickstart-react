# magical-auth-quickstart-react
# Secure Phone Authentication - React Quick Start

This is a minimal example demonstrating secure phone authentication using:
- `glide-sdk` for the backend
- `web-client-sdk` for the frontend

## Prerequisites

1. Node.js 16+ installed
2. Glide API credentials (get them from [Glide Documentation](https://docs.glideapi.com/))

## Setup

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

3. **Start the development server:**
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

## How It Works

1. **Backend** (`server.js`):
   - Uses `glide-sdk` to communicate with Glide's API
   - Exposes two endpoints:
      - `POST /api/phone-auth/prepare` - Creates a verification request
      - `POST /api/phone-auth/process` - Processes the verification response
   - Automatically handles response format compatibility

2. **Frontend** (`src/App.jsx`):
   - Uses `web-client-sdk/react` for the `usePhoneAuth` hook
   - Handles the Digital Credentials API browser flow
   - Shows loading states and results

The integration is designed to be seamless - the Glide SDK returns properly formatted responses that the Web Client SDK can use directly.

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