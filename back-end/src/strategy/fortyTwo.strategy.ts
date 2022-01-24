import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2'
import { lastValueFrom } from "rxjs";

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
    constructor(private http: HttpService) {
        super({
            authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
            tokenURL: 'https://api.intra.42.fr/oauth/token',
            clientID: '4990ddea6385beb263238537bd3b174b59d74dbf315832a2d6338e198c5b7909',
            clientSecret: '6383f3f44383eb0dca8cdc42a764ea86bf6cae370a4bd45d5970f36db2f619ae',
            callbackURL: 'http://localhost:3000/auth/redirect',
            scope: ['public']
        });
    }

    async validate(accessToken: string) {
        console.log("Validate", accessToken);
        
        const result = lastValueFrom(this.http.get("https://api.intra.42.fr/v2/me", {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        }));

        return (await result).data;
    }
}