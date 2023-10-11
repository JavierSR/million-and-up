import axios from 'axios'
import Request from '@/models/request.model'

export const httpGetRequest = async (request: Request) => {
    try {
        const response = await axios.get(request.url)
        return response.data
    }
    catch (error) {
        console.error(error);
    }
}