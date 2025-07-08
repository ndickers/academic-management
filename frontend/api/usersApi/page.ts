import axios, { AxiosError } from "axios";

const usersApi = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
    maxContentLength: 500000,
});

interface AssignLecType {
    data: { lecturerId: number };
    accessToken: string | null;
    id: number;
}

export const getAllLecturer = async ([_, id, accessToken]: [string, string, string]) => {
    try {
        const response = await usersApi.get(`/users/lecturer/${id}`, {
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



export const assignLec = async ({ data, accessToken, id }: AssignLecType) => {
    try {
        const response = await usersApi.patch(`/course/lecturer/assign/${id}`, data, {
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


