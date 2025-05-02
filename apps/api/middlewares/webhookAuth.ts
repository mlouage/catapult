import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

// Read the secret from environment variables
const expectedWebhookSecret = process.env.STRAPI_WEBHOOK_SECRET;

// Define the header name Strapi will send (case-insensitive lookup)
const STRAPI_TOKEN_HEADER = 'x-strapi-token'; // Or choose another name

if (!expectedWebhookSecret) {
    // Log an error during startup/load time if the secret is missing
    console.error("CRITICAL SECURITY WARNING: STRAPI_WEBHOOK_SECRET environment variable is not set. Strapi webhooks will fail.");
}

export const verifyWebhook = async (c: Context, next: Next) => {
    if (!expectedWebhookSecret) {
        // Prevent execution if secret isn't configured on the server
        console.error("Webhook verification skipped: Secret not configured on server.");
        throw new HTTPException(500, { message: 'Internal Server Error: Webhook secret not configured' });
    }

    // Get the token from the request header (Hono handles case-insensitivity)
    const receivedToken = c.req.header(STRAPI_TOKEN_HEADER);

    if (!receivedToken) {
        console.warn(`Webhook request denied: Missing '${STRAPI_TOKEN_HEADER}' header.`);
        throw new HTTPException(401, { message: `Unauthorized: Missing ${STRAPI_TOKEN_HEADER} header` });
    }

    // WARNING: This is potentially vulnerable to timing attacks.
    const isValid = receivedToken === expectedWebhookSecret;

    if (!isValid) {
        console.warn(`Webhook request denied: Token mismatch.`);
        // It's good practice to still return a generic message here
        // to avoid confirming whether the header was present but the token wrong.
        throw new HTTPException(401, { message: 'Unauthorized' });
    }

    console.log('Strapi webhook token verified successfully (using simple comparison).');
    // Token is valid, proceed to the route handler
    await next();
};
