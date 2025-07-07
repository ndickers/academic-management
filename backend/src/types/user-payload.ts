/* eslint-disable prettier/prettier */
// types/user-payload.ts
export interface UserPayload {
    id: string;
    email: string;
    role: 'admin' | 'student' | 'lecturer';
}
