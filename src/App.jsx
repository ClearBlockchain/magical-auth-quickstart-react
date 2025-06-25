import React, { useState } from 'react';
import { useClient } from 'glide-web-client-sdk/react';
import glideLogo from './assets/Glide-Logomark.svg';

function App() {
  const [phoneInput, setPhoneInput] = useState('');
  const [selectedFlow, setSelectedFlow] = useState('verify');
  const [phoneError, setPhoneError] = useState('');
  const [resultFlow, setResultFlow] = useState(null); // Track which flow generated the result
  
  // URL Configuration:
  // Option 1: Local server routes (requires running the local Express server with your own Glide credentials)
  // const prepareRequest = '/api/phone-auth/prepare';
  // const processResponse = '/api/phone-auth/process';

  // Option 2: Pre-made external server (for quick testing with hosted credentials)
  const prepareRequest = 'https://checkout-demo-server.glideidentity.dev/generate-get-request';
  const processResponse = 'https://checkout-demo-server.glideidentity.dev/processCredential';

  // Initialize the client first
  const { usePhoneAuth } = useClient({
    phoneAuthEndpoints: {
      prepareRequest,
      processResponse
    },
    debug: true,
  });
  
  const {
    getPhoneNumber,
    verifyPhoneNumber,
    isLoading,
    error,
    result,
    currentStep,
    isSupported
  } = usePhoneAuth();

  const handleGetNumber = async () => {
    try {
      // When calling getPhoneNumber without parameters, the server will use default T-Mobile PLMN
      const result = await getPhoneNumber({
        consentData: {
          consentText: 'I consent to the terms and conditions',
          policyLink: 'https://www.example.com/privacy',
          policyText: 'Privacy policy'
        }
      });
      console.log('Phone number retrieved:', result);
      setResultFlow('get'); // Mark that this result came from 'get' flow
    } catch (error) {
      console.error('Failed to get phone number:', error);
      setResultFlow('get'); // Mark even for errors
    }
  };

  const handleVerifyNumber = async () => {
    const validationError = validatePhoneNumber(phoneInput);
    
    if (validationError) {
      setPhoneError(validationError);
      return;
    }
    
    try {
      const result = await verifyPhoneNumber(phoneInput);
      console.log('Verification result:', result);
      setResultFlow('verify'); // Mark that this result came from 'verify' flow
    } catch (error) {
      console.error('Failed to verify phone number:', error);
      setResultFlow('verify'); // Mark even for errors
    }
  };

  const getLoadingText = () => {
    if (currentStep === 'requesting') return 'Preparing request...';
    if (currentStep === 'authenticating') return 'Waiting for carrier approval...';
    if (currentStep === 'processing') return 'Processing response...';
    return 'Loading...';
  };

  const validatePhoneNumber = (phone) => {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // E.164 format: + followed by up to 15 digits total
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    
    if (!phone.trim()) {
      return 'Phone number is required';
    }
    
    if (!cleaned.startsWith('+')) {
      return 'Phone number must be in E.164 format (start with +)';
    }
    
    if (cleaned.length < 8) {
      return 'Phone number too short for E.164 format';
    }
    
    if (cleaned.length > 16) {
      return 'Phone number too long for E.164 format (max 15 digits)';
    }
    
    if (!e164Regex.test(cleaned)) {
      return 'Please enter a valid E.164 format phone number';
    }
    
    return '';
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneInput(value);
    
    // Clear error when user starts typing
    if (phoneError) {
      setPhoneError('');
    }
  };

  if (!isSupported) {
    return (
      <>
        <header className="header">
          <div className="header-brand">
            <img src={glideLogo} alt="Glide Identity" className="header-logo" />
            <span className="header-company">Glide Identity</span>
          </div>
          <h1>Magical Auth Quick Start</h1>
          <p>Test carrier-grade phone verification in minutes. No SMS, no delays, no fraud.</p>
        </header>
        <div className="container">
          <div className="message message-error">
            <span className="message-icon">⚠️</span>
            <div className="message-content">
              <h4>Browser Not Supported</h4>
              <p>Your browser doesn't support secure phone authentication. Please use a compatible browser.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="header">
        <div className="header-brand">
          <img src={glideLogo} alt="Glide Identity" className="header-logo" />
          <span className="header-company">Glide Identity</span>
        </div>
        <h1>Magical Auth Quick Start</h1>
        <p>Test carrier-grade phone verification in minutes. No SMS, no delays, no fraud.</p>
      </header>

      <div className="container">
        {/* Flow Type Section */}
        <section className="section">
          <div className="section-header">
            <div className="section-icon">📱</div>
            <div className="section-title">
              <h2>Flow Type</h2>
              <p>Choose what you want to do with the phone verification</p>
            </div>
          </div>

          <div className="card-grid two-columns">
            <div 
              className={`card ${selectedFlow === 'verify' ? 'selected' : ''}`}
              onClick={() => {
                setSelectedFlow('verify');
                setPhoneError('');
              }}
            >
              <div className="card-icon">✓</div>
              <h3>Verify Phone Number</h3>
              <p>Verify if phone matches SIM card through carrier network</p>
            </div>

            <div 
              className={`card ${selectedFlow === 'get' ? 'selected' : ''}`}
              onClick={() => {
                setSelectedFlow('get');
                setPhoneError('');
              }}
            >
              <div className="card-icon">📲</div>
              <h3>Get Phone Number</h3>
              <p>Retrieve phone number from SIM card with carrier verification</p>
            </div>
          </div>
        </section>

        {/* Action Section */}
        <section className="section">
          <div className="section-header">
            <div className="section-icon">⚡</div>
            <div className="section-title">
              <h2>{selectedFlow === 'get' ? 'Get Your Number' : 'Verify Number'}</h2>
              <p>{selectedFlow === 'get' ? 
                'Click below to retrieve your phone number securely' : 
                'Enter a phone number in E.164 format to verify ownership'}</p>
            </div>
          </div>

          {selectedFlow === 'verify' && (
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="tel"
                  placeholder="Enter phone number in E.164 format (e.g., +16287892016)"
                  value={phoneInput}
                  onChange={handlePhoneChange}
                  disabled={isLoading}
                  className={phoneError ? 'input-error' : ''}
                />
                {phoneError && (
                  <div className="phone-error">
                    {phoneError}
                  </div>
                )}
                <div className="format-hint">
                  E.164 format: +[country code][phone number] (no spaces or dashes)
                </div>
              </div>
            </div>
          )}

          <div className="button-group">
            {selectedFlow === 'get' ? (
              <button 
                className="button-primary" 
                onClick={handleGetNumber} 
                disabled={isLoading}
              >
                {isLoading && <span className="loading-spinner"></span>}
                {isLoading ? getLoadingText() : 'Get My Phone Number'}
              </button>
            ) : (
              <button 
                className="button-primary" 
                onClick={handleVerifyNumber} 
                disabled={isLoading || !phoneInput || phoneError}
              >
                {isLoading && <span className="loading-spinner"></span>}
                {isLoading ? getLoadingText() : 'Verify Phone Number'}
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {isLoading && (
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-line">
                  <div 
                    className={`progress-line-fill ${error ? 'error' : ''}`}
                    style={{ 
                      width: currentStep === 'requesting' ? '33%' : 
                             currentStep === 'authenticating' ? '66%' : 
                             currentStep === 'processing' ? '100%' : '0%'
                    }}
                  />
                </div>
                
                <div className="progress-step">
                  <div className={`progress-dot ${
                    currentStep === 'requesting' ? 'active' : 
                    (currentStep === 'authenticating' || currentStep === 'processing') ? 'completed' : ''
                  } ${error && currentStep === 'requesting' ? 'error' : ''}`}>
                    {(currentStep === 'authenticating' || currentStep === 'processing') && !error ? '✓' : '1'}
                  </div>
                  <span className={`progress-label ${
                    currentStep === 'requesting' ? 'active' : 
                    (currentStep === 'authenticating' || currentStep === 'processing') ? 'completed' : ''
                  } ${error && currentStep === 'requesting' ? 'error' : ''}`}>
                    Preparing Request
                  </span>
                </div>

                <div className="progress-step">
                  <div className={`progress-dot ${
                    currentStep === 'authenticating' ? 'active' : 
                    currentStep === 'processing' ? 'completed' : ''
                  } ${error && currentStep === 'authenticating' ? 'error' : ''}`}>
                    {currentStep === 'processing' && !error ? '✓' : '2'}
                  </div>
                  <span className={`progress-label ${
                    currentStep === 'authenticating' ? 'active' : 
                    currentStep === 'processing' ? 'completed' : ''
                  } ${error && currentStep === 'authenticating' ? 'error' : ''}`}>
                    Carrier Approval
                  </span>
                </div>

                <div className="progress-step">
                  <div className={`progress-dot ${
                    currentStep === 'processing' ? 'active' : ''
                  } ${error && currentStep === 'processing' ? 'error' : ''}`}>
                    {error && currentStep === 'processing' ? '✕' : '3'}
                  </div>
                  <span className={`progress-label ${
                    currentStep === 'processing' ? 'active' : ''
                  } ${error && currentStep === 'processing' ? 'error' : ''}`}>
                    Processing
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Results Section */}
        {error && resultFlow === selectedFlow && (
          <div className={`message ${error.error === 'CARRIER_NOT_SUPPORTED' ? 'message-warning' : 'message-error'}`}>
            <span className="message-icon">{error.error === 'CARRIER_NOT_SUPPORTED' ? '⚠️' : '✕'}</span>
            <div className="message-content">
              <h4>{error.error === 'CARRIER_NOT_SUPPORTED' ? 'Carrier Not Supported' : 'Error'}</h4>
              <p>{error.message || 'An error occurred'}</p>
              {error.details?.carrier_name && (
                <div className="carrier-info">
                  <strong>Carrier:</strong> {error.details.carrier_name}<br />
                  <strong>Reason:</strong> {error.details.reason}
                </div>
              )}
              {error.code && error.error !== 'CARRIER_NOT_SUPPORTED' && <p><code>{error.code}</code></p>}
            </div>
          </div>
        )}

        {result && resultFlow === selectedFlow && (
          <div className="message message-success">
            <span className="message-icon">✓</span>
            <div className="message-content">
              <h4>Success</h4>
              <p><strong>Phone Number:</strong> {result.phoneNumber || result.phone_number}</p>
              <p><strong>Verified:</strong> {selectedFlow === 'verify' ? (result.verified ? 'Yes' : 'No') : 'Yes'}</p>
              {result.session && (
                <div className="session-info">
                  <p><strong>Session Details:</strong></p>
                  <pre className="session-data">
                    {typeof result.session === 'object' 
                      ? JSON.stringify(result.session, null, 2) 
                      : result.session}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Section */}
        <section className="section">
          <div className="section-header">
            <div className="section-icon">ℹ️</div>
            <div className="section-title">
              <h2>How It Works</h2>
              <p>Secure authentication powered by carrier networks</p>
            </div>
          </div>

          <div className="card-grid">
            <div className="card">
              <div className="card-icon">🔐</div>
              <h3>No SMS Required</h3>
              <p>Direct carrier verification without sending any text messages</p>
            </div>

            <div className="card">
              <div className="card-icon">⚡</div>
              <h3>Instant Verification</h3>
              <p>Get results in seconds, not minutes</p>
            </div>

            <div className="card">
              <div className="card-icon">🛡️</div>
              <h3>Fraud Resistant</h3>
              <p>Can't be intercepted or spoofed like SMS codes</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="powered-by">
          <span>Powered by</span>
          <img src={glideLogo} alt="Glide" className="powered-by-logo" />
          <span>Glide Identity</span>
        </div>
      </div>
    </>
  );
}

export default App; 