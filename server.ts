import express, { Request, Response } from 'express';
import cors from 'cors';
import { GlideClient } from '@stavbl/glide-sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Type definitions
interface PhoneAuthPrepareRequest {
  use_case: string;
  phone_number?: string;
  plmn?: {
    mcc: string;
    mnc: string;
  };
  consent_data?: {
    consentText: string;
    policyLink: string;
    policyText: string;
  };
}

interface PhoneAuthProcessRequest {
  response: any; // The credential response object from the client
  session: string;
  phoneNumber?: string;
}

interface EligibilityErrorResponse {
  error: string;
  message: string;
  details: {
    eligible: boolean;
    carrier_name?: string;
    reason?: string;
  };
}

interface AuthPrepareResponse {
  protocol: string;
  data: any;
  session?: string;
}

interface AuthProcessResponse {
  phone_number?: string;
  phoneNumber?: string;
  verified?: boolean;
  [key: string]: any;
}

interface HealthCheckResponse {
  status: string;
  glideInitialized: boolean;
  glideProperties: string[];
  env: {
    hasClientId: boolean;
    hasClientSecret: boolean;
  };
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Glide client
const glide = new GlideClient({
  clientId: process.env.GLIDE_CLIENT_ID!,
  clientSecret: process.env.GLIDE_CLIENT_SECRET!,
  // @ts-ignore - environment is a valid option but not in the type definition
  environment: 'sandbox' // Change to 'production' when ready
});

// Phone Auth Request endpoint
app.post('/api/phone-auth/prepare', async (req: Request<{}, {}, PhoneAuthPrepareRequest>, res: Response) => {
  try {
    console.log('/api/phone-auth/prepare', req.body);
    const { use_case, phone_number, plmn, consent_data } = req.body;

    // Pre-process the request parameters
    const prepareParams: any = {
      use_case
    };

    // Always include phone_number if provided
    if (phone_number) {
      console.log('Including phone number:', phone_number);
      prepareParams.phone_number = phone_number;
    }

    // Include PLMN if provided with both mcc and mnc
    if (plmn && plmn.mcc && plmn.mnc) {
      console.log('Including PLMN:', plmn);
      prepareParams.plmn = plmn;
    }

    // If neither phone_number nor PLMN was provided, use default T-Mobile PLMN
    if (!phone_number && (!plmn || !plmn.mcc || !plmn.mnc)) {
      console.log('No phone_number or PLMN provided, using default T-Mobile PLMN');
      prepareParams.plmn = {
        mcc: '310',
        mnc: '160'  // T-Mobile USA
      };
    }

    // Add consent data if provided
    if (consent_data) {
      prepareParams.consent_data = {
        consent_text: consent_data.consentText,
        policy_link: consent_data.policyLink,
        policy_text: consent_data.policyText
      };
    }

    console.log('Calling glide.magicAuth.prepare with:', prepareParams);
    const response = await glide.magicAuth.prepare(prepareParams);
    console.log('Response:', response);
    
    // Check if this is an eligibility response (carrier not supported)
    if (response?.eligible === false) {
      const eligibilityResponse: EligibilityErrorResponse = {
        error: 'CARRIER_NOT_SUPPORTED',
        message: response.reason || 'This carrier is not supported',
        details: {
          eligible: false,
          carrier_name: response.carrier_name,
          reason: response.reason
        }
      };
      res.status(400).json(eligibilityResponse);
      return;
    }
    
    // Check if response already has the expected format
    if (response.protocol && response.data) {
      // New format - response is already properly formatted
      console.log('Using direct format from Glide SDK');
      res.json(response as AuthPrepareResponse);
    } else if (response.auth_request) {
      // Legacy format - need to transform
      console.log('Transforming legacy format');
      const transformedResponse: AuthPrepareResponse = {
        protocol: response.auth_request.protocol || 'secure-auth-v1',
        data: response.auth_request.request,
        session: response.auth_request.session
      };
      res.json(transformedResponse);
    } else {
      throw new Error('Unexpected response format from Glide SDK');
    }
  } catch (error) {
    console.error('Phone auth request error:', (error as Error).message);
    res.status(500).json({ 
      error: (error as Error).message,
      details: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    });
  }
});

// Phone Auth Process endpoint
app.post('/api/phone-auth/process', async (req: Request<{}, {}, PhoneAuthProcessRequest>, res: Response) => {
  try {
    console.log('/api/phone-auth/process', req.body);
    const { response, session, phoneNumber } = req.body;
    const processParams: any = {
      credentialResponse: response,
      session: session,
      phoneNumber: phoneNumber,
    };
    console.log('Calling glide.magicAuth.processCredential with:', processParams);    
    const result = await glide.magicAuth.processCredential(processParams) as AuthProcessResponse;

    console.log('Response:', result);
    // Return the result directly if it already has the expected format
    if (result.phone_number || result.phoneNumber) {
      res.json(result);
    } else {
      // Fallback for unexpected format
      res.json({
        phone_number: result.phoneNumber || result.phone_number,
        verified: result.verified !== undefined ? result.verified : true,
        ...result
      });
    }
  } catch (error) {
    console.error('Phone auth process error:', (error as Error).message);
    res.status(500).json({ 
      error: (error as Error).message,
      details: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response<HealthCheckResponse>) => {
  res.json({ 
    status: 'ok',
    glideInitialized: !!glide,
    glideProperties: glide ? Object.keys(glide) : [],
    env: {
      hasClientId: !!process.env.GLIDE_CLIENT_ID,
      hasClientSecret: !!process.env.GLIDE_CLIENT_SECRET
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!process.env.GLIDE_CLIENT_ID || !process.env.GLIDE_CLIENT_SECRET) {
    console.warn('⚠️  Missing Glide credentials. Please check your .env file.');
  }
}); 