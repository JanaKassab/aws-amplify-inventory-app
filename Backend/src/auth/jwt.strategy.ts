// backend/src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            audience: process.env.COGNITO_CLIENT_ID,
            issuer: process.env.COGNITO_ISSUER_URL,
            algorithms: ['RS256'],
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${process.env.COGNITO_ISSUER_URL}/.well-known/jwks.json`,
            }),
        });
    }

    async validate(payload: any) {
        // The payload is the decoded JWT. You can attach it to the request.
        // The 'sub' claim is the unique user ID from Cognito.
        return { userId: payload.sub, username: payload.username };
    }
}
