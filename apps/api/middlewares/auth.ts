// packages/api/src/middleware/auth.ts (or similar)
import type { Context, Next } from 'hono';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { HTTPException } from 'hono/http-exception';

// Load config (using process.env or a config loader)
const tenantId = process.env.AZURE_AD_TENANT_ID;
const audience = process.env.AZURE_AD_BACKEND_AUDIENCE; // Audience expected in the token

if (!tenantId || !audience) {
  throw new Error("Missing required Entra AD environment variables for backend authentication.");
}

// Construct the issuer URL (v2.0 endpoint)
const issuer = `https://login.microsoftonline.com/${tenantId}/v2.0`;

// Construct the JWKS URI (where Entra ID publishes public keys)
const JWKS = createRemoteJWKSet(
  new URL(`https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`)
);

export const protect = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('Missing or invalid Authorization header');
    throw new HTTPException(401, { message: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    const { payload, protectedHeader } = await jwtVerify(token, JWKS, {
      issuer: issuer,
      audience: audience,
      // You can add algorithms: ['RS256'] if needed, but jose usually infers
    });

    // Token is valid!
    // Optional: Add user info from the token payload to the context
    // Common claims: oid (object id), sub (subject id), name, preferred_username, roles, scp (scope)
    c.set('user', payload);
    c.set('token', token); // Maybe useful downstream

    // Check for required scopes if necessary
    const scopes = payload.scp as string | string[];
    const hasRequiredScope = Array.isArray(scopes)
      ? scopes.includes('access_as_user') // The scope you defined
      : typeof scopes === 'string' && scopes.split(' ').includes('access_as_user');

    if (!hasRequiredScope) {
        console.warn(`Token valid but missing required scope. User: ${payload.oid}, Scopes: ${payload.scp}`);
        throw new HTTPException(403, { message: 'Forbidden: Insufficient scope' });
    }


    console.log(`Token validated successfully for user OID: ${payload.oid}`);
    await next(); // Proceed to the next middleware or route handler

  } catch (error: any) {
    console.error('Token validation failed:', error.message || error);
    // Specific error handling based on jose error codes (e.g., 'ERR_JWT_EXPIRED')
    if (error.code === 'ERR_JWT_EXPIRED') {
         throw new HTTPException(401, { message: 'Unauthorized: Token expired' });
    }
     if (error.code === 'ERR_JWKS_NO_MATCHING_KEY' || error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
         throw new HTTPException(401, { message: 'Unauthorized: Invalid signature' });
     }
     if (error.code === 'ERR_JWT_INVALID') {
         throw new HTTPException(401, { message: `Unauthorized: Invalid token (${error.message})` });
     }
     if (error.code === 'ERR_JWT_CLAIM_VALIDATION_FAILED') {
         // This often means issuer or audience mismatch
         throw new HTTPException(401, { message: `Unauthorized: Token claim validation failed (${error.reason})` });
     }
    // Generic fallback
    throw new HTTPException(401, { message: 'Unauthorized: Invalid token' });
  }
};
