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
 * @interface PostTeamRequest
 */
export interface PostTeamRequest {
    /**
     * Team name
     * @type {string}
     * @memberof PostTeamRequest
     */
    teamName: string;
    /**
     * Maximum number of team members (greater than 10)
     * @type {number}
     * @memberof PostTeamRequest
     */
    maxMemberNumber: number;
}

/**
 * Check if a given object implements the PostTeamRequest interface.
 */
export function instanceOfPostTeamRequest(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "teamName" in value;
    isInstance = isInstance && "maxMemberNumber" in value;

    return isInstance;
}

export function PostTeamRequestFromJSON(json: any): PostTeamRequest {
    return PostTeamRequestFromJSONTyped(json, false);
}

export function PostTeamRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PostTeamRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'teamName': json['teamName'],
        'maxMemberNumber': json['maxMemberNumber'],
    };
}

export function PostTeamRequestToJSON(value?: PostTeamRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'teamName': value.teamName,
        'maxMemberNumber': value.maxMemberNumber,
    };
}
