import axios, { AxiosError } from "axios";

const courseApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    maxContentLength: 500000,
});

interface CourseType {
    data: FormData;
    accessToken: string | null;
}

interface CourseUpdateType {
    data: FormData;
    accessToken: string | null;
    id: number;
}

export const createCourse = async ({ data, accessToken }: CourseType) => {
    try {
        const response = await courseApi.post(`/course`, data, {
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


export const updateCourse = async ({ data, accessToken, id }: CourseUpdateType) => {
    try {
        const response = await courseApi.patch(`/course/${id}`, data, {
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



export const getLecCourses = async ([_, id, accessToken]: [string, string, string]) => {
    try {
        const response = await courseApi.get(`/course/lecturer/${id}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (error) {
        if (error) {
            throw error
        }
    }
}

export const getAllCourses = async ([_, accessToken]: [string, string, string]) => {
    try {
        const response = await courseApi.get(`/course`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (error) {
        if (error) {
            throw error
        }
    }
}


export const getViewStudentCourse = async ([_, id, accessToken]: [string, string, string]) => {
    try {
        const response = await courseApi.get(`/course/student/${id}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (error) {
        if (error) {
            throw error
        }
    }
}


export const getEnrolledStudentCourse = async ([_, id, accessToken]: [string, string, string]) => {
    try {
        const response = await courseApi.get(`/course/enrolled/student/${id}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (error) {
        if (error) {
            throw error
        }
    }
}