import React, { useState } from 'react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import { apiRequest } from '../authConfig';

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  additionalHeaders?: Record<string, string>;
}

export interface UseProtectedApiReturn<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  fetchData: (url: string, options?: FetchOptions) => Promise<void>;
}

export function useProtectedApi<T = any>(): UseProtectedApiReturn<T> {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Use useCallback to memoize the fetchData function to prevent it from changing on each render
  const fetchData = React.useCallback(async (url: string, options: FetchOptions = {}) => {
    console.log(`Starting API fetch for ${url}...`);
    // We'll manage loading state inside the callback rather than accessing the loading state directly
    // This avoids adding it to the dependency array which would cause issues
    let isCurrentlyLoading = false;
    
    // Function to safely check loading status
    const checkAndSetLoading = () => {
      if (isCurrentlyLoading) {
        console.log(`Skipping duplicate API fetch for ${url} - already loading`);
        return true;
      }
      isCurrentlyLoading = true;
      setLoading(true);
      return false;
    };
    
    // Check if we should skip this fetch
    if (checkAndSetLoading()) {
      return;
    }

    setError(null);
    setData(null);

    try {
      // Ensure user is authenticated and we have account info
      if (!isAuthenticated || accounts.length === 0) {
        throw new Error("User not authenticated or account information is missing.");
      }

      // Get the user's account (usually the first one)
      const account = accounts[0];

      // Prepare the token request
      const tokenRequest = {
        ...apiRequest,
        account: account
      };

      console.log("Attempting to acquire token silently for:", account.username);

      // 1. Acquire Token Silently
      let accessToken;
      try {
        const tokenResponse = await instance.acquireTokenSilent(tokenRequest);
        console.log("Token acquired successfully.");
        accessToken = tokenResponse.accessToken;
      } catch (tokenError) {
        // Handle Token Acquisition Errors (Interaction Required)
        if (tokenError instanceof InteractionRequiredAuthError) {
          console.log("Interaction required, attempting popup...");
          const interactiveResponse = await instance.acquireTokenPopup(tokenRequest);
          console.log("Token acquired via popup.");
          accessToken = interactiveResponse.accessToken;
        } else {
          throw tokenError;
        }
      }

      // 2. Call the API with the Token
      console.log(`Fetching ${url}...`);
      const { method = 'GET', body, additionalHeaders = {} } = options;
      
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${accessToken}`,
        ...additionalHeaders
      };
      
      // Add Content-Type for requests with body
      if (body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }

      const fetchOptions: RequestInit = {
        method,
        headers,
      };

      // Add body for non-GET requests if provided
      if (body && method !== 'GET') {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      const apiResponse = await fetch(url, fetchOptions);

      // 3. Handle API Response
      if (!apiResponse.ok) {
        // Try to get error details from response body if possible
        let errorBody = 'No details available.';
        try {
          errorBody = await apiResponse.text();
        } catch (e) { /* ignore */ }
        throw new Error(`API call failed: ${apiResponse.status} ${apiResponse.statusText}. Body: ${errorBody}`);
      }

      const responseData = await apiResponse.json();
      console.log("API Data received:", responseData);
      setData(responseData);

    } catch (error: any) {
      console.error("Error during token acquisition or API call:", error);
      setError(`An error occurred: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  }, [instance, accounts, isAuthenticated, setData, setError, setLoading]);

  return { data, error, loading, fetchData };
}
