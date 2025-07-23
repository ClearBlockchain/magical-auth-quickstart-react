package com.glideidentity.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PhoneAuthProcessRequest {
    private Object response;
    private Object session;
    
    @JsonProperty("phoneNumber")  // Accept camelCase from frontend
    private String phoneNumber;
} 