package com.glideidentity.service;

import com.glideidentity.dto.AuthV2PrepDto;
import com.glideidentity.dto.PhoneAuthProcessRequest;
import com.glideapi.GlideClient;
import com.glideapi.services.dto.MagicAuthDtos.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Slf4j
@Service
public class GlideService {

    private GlideClient glideClient;
    private boolean initialized = false;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        String clientId = System.getenv("GLIDE_CLIENT_ID");
        String clientSecret = System.getenv("GLIDE_CLIENT_SECRET");

        if (clientId != null && clientSecret != null) {
            log.info("Initializing Glide client with automatic session management");
            // Using GlideClient with automatic session management (ThreadLocal strategy by default)
            this.glideClient = new GlideClient(clientId, clientSecret);
            this.initialized = true;
            log.info("Glide client initialized successfully with ThreadLocal session strategy");
        } else {
            log.warn("Missing Glide credentials. Client not initialized.");
        }
    }

    public Object prepare(AuthV2PrepDto request) throws Exception {
        if (!initialized) {
            throw new IllegalStateException("Glide client not initialized. Check your credentials.");
        }

        // Create SDK DTO
        com.glideapi.services.dto.MagicAuthDtos.AuthV2PrepDto prepDto = 
            new com.glideapi.services.dto.MagicAuthDtos.AuthV2PrepDto();
        
        // Set use case directly - expecting "GetPhoneNumber" or "VerifyPhoneNumber"
        if (request.getUseCase() != null) {
            // The SDK expects GET_PHONE_NUMBER format, but we receive GetPhoneNumber
            String enumValue = request.getUseCase()
                .replaceAll("([a-z])([A-Z])", "$1_$2")
                .toUpperCase();
            prepDto.setUseCase(UseCase.valueOf(enumValue));
        }
        
        // Set phone number if provided
        if (request.getPhoneNumber() != null) {
            prepDto.setPhoneNumber(request.getPhoneNumber());
        }
        
        // Set PLMN if provided
        if (request.getPlmn() != null && request.getPlmn().getMcc() != null && request.getPlmn().getMnc() != null) {
            PlmnDto plmn = new PlmnDto(request.getPlmn().getMcc(), request.getPlmn().getMnc());
            prepDto.setPlmn(plmn);
        } else if (request.getPhoneNumber() == null) {
            // If neither phone_number nor PLMN was provided, use default T-Mobile PLMN
            // This matches the TypeScript server behavior
            PlmnDto defaultPlmn = new PlmnDto("310", "160"); // T-Mobile USA
            prepDto.setPlmn(defaultPlmn);
        }
        
        // Set consent data if provided
        if (request.getConsentData() != null) {
            ConsentData consent = new ConsentData(
                request.getConsentData().getConsentText(),
                request.getConsentData().getPolicyLink(),
                request.getConsentData().getPolicyText()
            );
            prepDto.setConsentData(consent);
        }

        // Call SDK - session is managed automatically
        // Use the service property and pass null for ApiConfig (or omit if there's an overload)
        return glideClient.magicAuth.prepare(prepDto, null);
    }

    public Object processCredential(PhoneAuthProcessRequest request) throws Exception {
        if (!initialized) {
            throw new IllegalStateException("Glide client not initialized. Check your credentials.");
        }

        // Create SDK DTO
        AuthV2ProcessCredentialDto processDto = new AuthV2ProcessCredentialDto();
        
        // Convert the raw objects to SDK types
        DigitalCredentialResponse credentialResponse = objectMapper.convertValue(
            request.getResponse(), 
            DigitalCredentialResponse.class
        );
        processDto.setCredentialResponse(credentialResponse);
        
        SessionPayloadRaw sessionPayload = objectMapper.convertValue(
            request.getSession(), 
            SessionPayloadRaw.class
        );
        processDto.setSession(sessionPayload);
        
        if (request.getPhoneNumber() != null) {
            processDto.setPhoneNumber(request.getPhoneNumber());
        }

        // Call SDK - session is managed automatically
        // Use the service property and pass null for ApiConfig (or omit if there's an overload)
        AuthenticateResponse result = glideClient.magicAuth.processCredential(processDto, null);
        
        // Return the SDK response directly to match TypeScript server behavior
        // The SDK returns all necessary fields including 'success'
        return result;
    }

    public boolean isInitialized() {
        return initialized;
    }

    public List<String> getProperties() {
        return initialized && glideClient != null ? 
            List.of("magicAuth", "initialized") : 
            List.of();
    }
} 