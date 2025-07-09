import axios, { AxiosError } from "axios";

const assignmentApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    maxContentLength: 500000,
});


interface AssignmentType {
    data: FormData;
    accessToken: string | null;
}

export const createAssignment = async ({ data, accessToken }: AssignmentType) => {
    try {
        const response = await assignmentApi.post(`/assignment`, data, {
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