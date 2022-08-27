import { Secret } from "jsonwebtoken";

export interface IJwt {
    privateKey: Secret;
    publicKey: Secret;
    expiration: string;
    algorithm: string;
}