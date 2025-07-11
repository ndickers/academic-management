import axios, { AxiosError } from "axios";

const enrollmentApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    maxContentLength: 500000,
});

export interface EnrollType {
    data: { studentId: number, courseId: number, status: "PENDING" | "APPROVED" | "REJECTED" }
    accessToken: string
}

export interface DropCourseType {
    accessToken: string;
    studentId: number;
    courseId: number
}

export interface UpdateEnrollType {
    accessToken: string;
    id: number;
    data: {
        status: "PENDING" | "APPROVED" | "REJECTED";
    }
}


export const enrollCourse = async ({ data, accessToken }: EnrollType) => {
    try {
        const response = await enrollmentApi.post(`/enroll`, data, {
            headers: {
                "authorization": `Bearer ${accessToken}`
            }
        })
        return response
    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
        return { message: 'Unknown error occurred' };
    }
}


export const confirmEnrollment = async ({ id, data, accessToken }: UpdateEnrollType) => {
    try {
        const response = await enrollmentApi.patch(`/enroll/${id}`, data, {
            headers: {
                "authorization": `Bearer ${accessToken}`
            }
        })
        return response
    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
        return { message: 'Unknown error occurred' };
    }
}


export const getEnrolledStudent = async ({ accessToken }: EnrollType) => {
    try {
        const response = await enrollmentApi.get(`/enroll`, {
            headers: {
                "authorization": `Bearer ${accessToken}`
            }
        })
        return response.data
    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
        return { message: 'Unknown error occurred' };
    }
}


export const dropCourse = async ({ accessToken }: { accessToken: string }) => {
    try {
        const response = await enrollmentApi.delete(`/enroll`, {
            headers: {
                "authorization": `Bearer ${accessToken}`
            }
        })
        return response
    } catch (error: any) {
        if (error.response) {
            return error.response;
        }
        return { message: 'Unknown error occurred' };
    }
}