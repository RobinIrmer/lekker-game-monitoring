export interface Authentication {
    sign(userId: string): string;

    validate(token: string): string;
}