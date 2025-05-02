// src/components/ProtectedDataFetcher.tsx

import { useState } from 'react';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import { apiRequest } from '../authConfig';

function ProtectedDataFetcher() {
    const { instance, accounts, inProgress } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [apiData, setApiData] = useState<any>(null); // State to hold data from the API
    const [error, setError] = useState<string | null>(null); // State for errors

    const handleFetchData = async () => {
        setError(null); // Clear previous errors
        setApiData(null); // Clear previous data

        // Ensure user is authenticated and we have account info
        if (!isAuthenticated || accounts.length === 0) {
            setError("User not authenticated or account information is missing.");
            // Optionally trigger login here if desired, though AuthenticatedTemplate handles rendering
            // instance.loginPopup(loginRequest);
            return;
        }

        // Get the user's account (usually the first one)
        const account = accounts[0];

        // Prepare the token request
        const tokenRequest = {
            ...apiRequest,
            account: account
        };

        console.log("Attempting to acquire token silently for:", account.username);

        try {
            // 1. Acquire Token Silently
            const tokenResponse = await instance.acquireTokenSilent(tokenRequest);
            console.log("Token acquired successfully.");
            const accessToken = tokenResponse.accessToken;

            // 2. Call the Backend API with the Token
            console.log("Fetching /api/protected-data...");
            const apiResponse = await fetch('/api/protected/protected-data', { // Vite proxy handles this path
                method: 'GET', // Or POST, PUT, etc., as needed
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    // Add other headers like 'Content-Type' if sending data (e.g., for POST)
                    // 'Content-Type': 'application/json'
                },
                // Add 'body' for POST/PUT requests
                // body: JSON.stringify({ key: 'value' })
            });

            // 3. Handle API Response
            if (!apiResponse.ok) {
                // Try to get error details from response body if possible
                let errorBody = 'No details available.';
                try {
                    errorBody = await apiResponse.text(); // or .json() if backend sends structured errors
                } catch (e) { /* ignore */ }
                throw new Error(`API call failed: ${apiResponse.status} ${apiResponse.statusText}. Body: ${errorBody}`);
            }

            const data = await apiResponse.json();
            console.log("API Data received:", data);
            setApiData(data);

        } catch (error: any) {
            console.error("Error during token acquisition or API call:", error);

            // 4. Handle Token Acquisition Errors (Interaction Required)
            if (error instanceof InteractionRequiredAuthError) {
                setError("Silent token acquisition failed. User interaction is required. Trying popup...");
                console.log("Interaction required, attempting popup...");
                try {
                    // Fallback to interactive token acquisition
                    const interactiveResponse = await instance.acquireTokenPopup(tokenRequest);
                    console.log("Token acquired via popup.");
                    // --- Optional: Retry API call automatically after popup ---
                    // You could extract the fetch logic into a separate function
                    // and call it here again with interactiveResponse.accessToken
                    setError("Token acquired interactively. Please click 'Fetch Data' again.");
                    // --- End Optional Retry ---

                } catch (popupError) {
                    console.error("Interactive token acquisition failed:", popupError);
                    setError(`Failed to acquire token interactively: ${popupError.message || popupError}`);
                }
            } else {
                // Handle other errors (network issues, API errors thrown above, etc.)
                setError(`An error occurred: ${error.message || error}`);
            }
        }
    };

    // Render button only when not interacting
    const showFetchButton = inProgress === InteractionStatus.None;

    return (
        <div>
            <h2>Protected Backend Data</h2>
            <AuthenticatedTemplate>
                {/* Content shown only when the user is authenticated */}
                <p>Welcome, {accounts.length > 0 ? accounts[0].name : 'User'}!</p>
                {showFetchButton && (
                    <button className="mt-4 mb-4 shrink-0 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600" onClick={handleFetchData}>Fetch Protected Data</button>
                )}
                {inProgress !== InteractionStatus.None && (
                    <p><i>(MSAL interaction in progress...)</i></p>
                )}

                {error && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {apiData && (
                    <div style={{ marginTop: '10px', border: '1px solid #ccc', padding: '10px' }}>
                        <h3>API Response:</h3>
                        <pre>{JSON.stringify(apiData, null, 2)}</pre>
                    </div>
                )}
            </AuthenticatedTemplate>

            <UnauthenticatedTemplate>
                {/* Content shown when the user is not authenticated */}
                <p>Please sign in to fetch data from the protected API.</p>
                {/* You might add a login button here if needed */}
                {/* <button onClick={() => instance.loginPopup(loginRequest)}>Sign In</button> */}
            </UnauthenticatedTemplate>
        </div>
    );
}

export default ProtectedDataFetcher;
