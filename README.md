# Secure Phone Authentication - React Quick Start

This is a minimal example demonstrating secure phone authentication using:
- `glide-sdk` for the backend
- `glide-web-client-sdk/react` for the frontend

## Prerequisites

1. Node.js 16+ installed
2. Glide API credentials (get them from [Glide Documentation](https://docs.glideapi.com/))
3. For Java server option: Java 21+

## Setup

### Quick Start (Local Server - Default)

For development with your own Glide credentials:

**Option A: Local Installation**
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
   npm run dev      # TypeScript server (default)
   # or
   npm run dev:java # Java server
   ```

**Option B: Docker (Recommended)**
See the [Docker Development](#docker-development) section below for containerized setup.

This will start:
- Backend server on http://localhost:3001
- React app on http://localhost:3000

### Quick Testing (External Server)

For immediate testing without backend setup:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Update client configuration:**
   
   In `src/App.jsx`, comment out the local server URLs and uncomment the external ones:
   ```javascript
   // const prepareRequest = '/api/phone-auth/prepare';
   // const processResponse = '/api/phone-auth/process';
   
   const prepareRequest = 'https://checkout-demo-server.glideidentity.dev/generate-get-request';
   const processResponse = 'https://checkout-demo-server.glideidentity.dev/processCredential';
   ```

3. **Start the React app:**
   ```bash
   npm run client
   ```

   This uses a pre-configured external server with hosted Glide credentials for quick testing.

## Docker Development

For containerized development with consistent environments:

**Prerequisites:**
- Docker and Docker Compose installed
- Glide API credentials (get them from [Glide Documentation](https://docs.glideapi.com/))

**Setup:**
1. **Configure environment variables:**
   
   Create a `.env` file in the project root:
   ```env
   GLIDE_CLIENT_ID=your_client_id_here
   GLIDE_CLIENT_SECRET=your_client_secret_here
   ```

2. **Start with Docker Compose:**
   ```bash
   # Full development mode (TypeScript server + client) - DEFAULT
   docker compose up -d
   
   # TypeScript server only
   COMPONENT=server docker compose up -d
   
   # Java server only  
   COMPONENT=server:java docker compose up -d
   
   # Client only
   COMPONENT=client docker compose up -d
   
   # Java server + client
   COMPONENT=dev:java docker compose up -d
   
   # Build mode
   COMPONENT=build docker compose up -d
   
   # Preview mode (production build)
   COMPONENT=preview docker compose up -d
   ```

   This will start:
   - Backend server on http://localhost:3001
   - React app on http://localhost:3000

**Available Components:**
- `server` - TypeScript server only (port 3001)
- `server:java` - Java server only (port 3001)
- `client` - React client only (port 3000)
- `dev:java` - Java server + React client
- `build` - Build both client and server
- `preview` - Serve production build

**Stop the containers:**
```bash
docker compose down
```

## Server Options

You can choose between TypeScript or Java backend:

### Option A: TypeScript Server (Default)

The TypeScript server is the default option and starts automatically with `npm run dev`.

**Features:**
- Complete TypeScript implementation with proper type definitions
- Uses `glide-sdk` npm package
- Express.js server with CORS support
- Same language as frontend

### Option B: Java Server (Spring Boot)

**Prerequisites:**
- Java 21 or higher
- Gradle (will use wrapper scripts if not installed globally)

**Local Installation:**
```bash
# Build the Java server
npm run server:java:build

# Start with Java backend
npm run dev:java
```

**Docker (Recommended):**
```bash
# Start Java server + client
COMPONENT=dev:java docker compose up -d

# Start Java server only
COMPONENT=server:java docker compose up -d
```

**Features:**
- Spring Boot framework with auto-configuration
- Uses `glide-sdk-java` with automatic session management (ThreadLocal strategy)
- Enterprise-grade architecture
- Thread-safe with optimal performance

### Java Server Commands

**Local Installation:**
- `npm run dev:java` - Start both Java server and React client
- `npm run server:java` - Start only the Java server
- `npm run server:java:build` - Build the Java server
- `npm run server:java:clean` - Clean Java build files

**Docker:**
- `COMPONENT=dev:java docker compose up -d` - Start both Java server and React client
- `COMPONENT=server:java docker compose up -d` - Start only the Java server
- `COMPONENT=build docker compose up -d` - Build both client and server

## Usage

The app demonstrates two main features:

### 1. Get Phone Number
Click "Get My Phone Number" to retrieve the phone number associated with your device.

### 2. Verify Phone Number
Enter a phone number and click "Verify Phone Number" to verify ownership.

## UI Features

### Visual Progress Tracking

The app includes a visual progress bar that shows the authentication flow in real-time:

1. **Preparing Request** - Initial request setup
2. **Carrier Approval** - Waiting for carrier authentication
3. **Processing** - Final verification processing

The progress bar provides:
- ✅ Step-by-step visual feedback
- ✅ Active, completed, and error states
- ✅ Clear indication of current authentication phase
- ✅ Error handling at each step

### Phone Number Validation

- Real-time E.164 format validation
- Clear error messages for invalid formats
- Supports international phone numbers
- Format hint: `+[country code][phone number]`

## Choosing a Backend Server

### TypeScript vs Java Server

Both servers provide identical functionality. Choose based on your team's expertise:

**TypeScript Server:**
- ✅ Same language as frontend
- ✅ Faster startup time
- ✅ Simpler deployment
- ✅ Better for Node.js teams

**Java Server:**
- ✅ Enterprise-grade Spring Boot
- ✅ Better for Java teams
- ✅ More mature ecosystem
- ✅ Better IDE support

## Development Modes

This project supports multiple development modes for different scenarios:

### Local Development
- **Full Stack**: `npm run dev` - TypeScript server + React client
- **Java Full Stack**: `npm run dev:java` - Java server + React client
- **Server Only**: `npm run server` - TypeScript server only
- **Java Server Only**: `npm run server:java` - Java server only
- **Client Only**: `npm run client` - React client only

### Docker Development
- **Full Stack**: `docker compose up -d` - TypeScript server + React client
- **Java Full Stack**: `COMPONENT=dev:java docker compose up -d` - Java server + React client
- **Server Only**: `COMPONENT=server docker compose up -d` - TypeScript server only
- **Java Server Only**: `COMPONENT=server:java docker compose up -d` - Java server only
- **Client Only**: `COMPONENT=client docker compose up -d` - React client only
- **Build Mode**: `COMPONENT=build docker compose up -d` - Build both client and server
- **Preview Mode**: `COMPONENT=preview docker compose up -d` - Serve production build

### Use Cases
- **Full Development**: Use full stack modes for complete development
- **Backend Testing**: Use server-only modes to test API endpoints
- **Frontend Testing**: Use client-only mode with external server
- **Production Testing**: Use preview mode to test production builds

## Server Configuration

The app supports multiple server configurations:

### Option 1: Local Server (Default)
```javascript
const prepareRequest = '/api/phone-auth/prepare';
const processResponse = '/api/phone-auth/process';
```
- **Pros**: Your own credentials, full control, production-ready
- **Cons**: Requires backend setup and .env configuration

### Option 2: External Server
```javascript
const prepareRequest = 'https://checkout-demo-server.glideidentity.dev/generate-get-request';
const processResponse = 'https://checkout-demo-server.glideidentity.dev/processCredential';
```
- **Pros**: No backend setup required, instant testing
- **Cons**: Uses shared demo credentials, not for production

## New: Comprehensive Error Handling

The SDK now includes improved error handling with:
- **Structured error codes** - Consistent error identification across all platforms
- **User-friendly messages** - Clear explanations for end users
- **Request tracking** - Request IDs for debugging
- **Detailed error information** - Additional context for specific errors

### Error Types:
- `CARRIER_NOT_ELIGIBLE` - Carrier doesn't support this feature
- `USER_CANCELLED` - User cancelled the authentication
- `BROWSER_NOT_SUPPORTED` - Browser doesn't support Digital Credentials API
- And more structured error codes for different scenarios

## How It Works

### With Local Server:

#### TypeScript Server (`server.ts`):
1. **Backend** (already provided):
   - Complete TypeScript implementation with proper type definitions
   - Uses `glide-sdk` npm package to communicate with Glide's API
   - Express.js server with CORS support
   - Exposes three endpoints:
      - `POST /api/phone-auth/prepare` - Creates a verification request
      - `POST /api/phone-auth/process` - Processes the verification response
      - `GET /api/health` - Health check with credentials validation
   - Automatically handles response format compatibility and eligibility checks

#### Java Server (Spring Boot):
1. **Backend** (already provided):
   - Complete Java implementation using Spring Boot framework
   - Uses `glide-sdk-java` with automatic session management (ThreadLocal strategy)
   - Modern Java 21 with Lombok for cleaner code
   - Same three endpoints as TypeScript version
   - Gradle build system for dependency management
   - Identical API interface - frontend works with both servers
   - Thread-safe with optimal performance for concurrent requests

### With External Server:
1. **Backend**:
   - Pre-configured Glide SDK integration with demo credentials
   - Hosted endpoints handle all authentication logic
   - Same response format as local servers

### Frontend (`src/App.jsx`):
- Uses `glide-web-client-sdk/react` with direct `usePhoneAuth` hook import
- Handles the Digital Credentials API browser flow automatically
- Shows loading states with visual progress tracking
- Supports both "Get Phone Number" and "Verify Phone Number" flows
- Real-time phone number validation with E.164 format
- Comprehensive error handling with user-friendly messages

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
- **Network errors**: Ensure both servers are running (`npm run dev` or `docker compose up -d`)
- **Docker issues**: 
  - Ensure Docker and Docker Compose are installed
  - Check that ports 3000 and 3001 are available
  - Verify `.env` file exists and contains valid credentials
  - Use `docker compose logs` to view container logs 