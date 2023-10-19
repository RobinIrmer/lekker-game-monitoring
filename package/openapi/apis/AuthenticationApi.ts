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


import * as runtime from '../runtime';
import type {Auth, SigninRequest, SignupRequest,} from '../models';

export interface SigninPostRequest {
    signinRequest: SigninRequest;
}

export interface SignupPostRequest {
    signupRequest: SignupRequest;
}

/**
 * AuthenticationApi - interface
 *
 * @export
 * @interface AuthenticationApiInterface
 */
export interface AuthenticationApiInterface {
    /**
     * Authenticate a user and provide a JWT token.
     * User Signin
     */
    signinPost(requestParameters: SigninPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Auth>;

    /**
     * Create a new user and assign a random score.
     * User Signup
     */
    signupPost(requestParameters: SignupPostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void>;

}
