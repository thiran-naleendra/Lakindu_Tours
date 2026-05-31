
import { SignJWT, importPKCS8 } from 'jose';

// Helper to get Google OAuth2 Token using Service Account
// We need to sign a JWT with RS256 using the Private Key
export async function getAccessToken(env) {
    if (!env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        console.error("Missing FIREBASE_SERVICE_ACCOUNT_JSON secret");
        throw new Error("Service Account invalid");
    }

    try {
        const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
        const privateKeyPEM = serviceAccount.private_key;
        const clientEmail = serviceAccount.client_email;

        // Import the private key
        const alg = 'RS256';
        const privateKey = await importPKCS8(privateKeyPEM, alg);

        // Create JWT
        // Audience for Firestore: "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit"
        // OR better standard scope for Google APIs: https://www.googleapis.com/oauth2/v4/token with scope 
        // Actually, for Firestore REST API, we need an OAuth2 access token, which we get by exchanging a signed JWT.

        // Wait, standard Service Account flow for Cloudflare Workers:
        // 1. Create a JWT signed with private key.
        // 2. Exchange JWT for Access Token via https://oauth2.googleapis.com/token

        const now = Math.floor(Date.now() / 1000);

        const jwt = await new SignJWT({
            scope: 'https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/cloud-platform'
        })
            .setProtectedHeader({ alg, typ: 'JWT' })
            .setIssuer(clientEmail)
            .setSubject(clientEmail)
            .setAudience('https://oauth2.googleapis.com/token')
            .setIssuedAt(now)
            .setExpirationTime(now + 3600) // 1 hour
            .sign(privateKey);

        // Exchange for Access Token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt
            })
        });

        if (!tokenResponse.ok) {
            const err = await tokenResponse.text();
            throw new Error(`Token exchange failed: ${err}`);
        }

        const data = await tokenResponse.json();
        return data.access_token;

    } catch (e) {
        console.error("Auth Error:", e);
        throw e;
    }
}
