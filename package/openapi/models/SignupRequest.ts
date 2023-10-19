/* tslint:disable */
/* eslint-disable */
/**
 * User and Team Management API
 * API for user and team management with JWT internal
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface SignupRequest
 */
export interface SignupRequest {
    /**
     * User's username
     * @type {string}
     * @memberof SignupRequest
     */
    email: string;
    /**
     * User's password
     * @type {string}
     * @memberof SignupRequest
     */
    password: string;
    /**
     * User's name
     * @type {string}
     * @memberof SignupRequest
     */
    name: string;
}

/**
 * Check if a given object implements the SignupRequest interface.
 */
export function instanceOfSignupRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "email" in value;
    isInstance = isInstance && "password" in value;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function SignupRequestFromJSON(json: any): SignupRequest {
    return SignupRequestFromJSONTyped(json, false);
}

export function SignupRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): SignupRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'email': json['email'],
        'password': json['password'],
        'name': json['name'],
    };
}

export function SignupRequestToJSON(value?: SignupRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'email': value.email,
        'password': value.password,
        'name': value.name,
    };
}

