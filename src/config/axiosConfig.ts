import axios, {AxiosError} from "axios";
import {message} from "antd";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    timeout: 10000,
})


export const configAxios = () => {
    axiosInstance.interceptors.response.use(
        (resp) => {
        return resp
    },
        (error: AxiosError<{message: string}>) => {
            const {response} = error
            if(response!!.status >= 400) {
                message.config({
                    top: 65
                })
                message.error(response?.data.message);
            }
        return Promise.reject(error)
    })
}

configAxios()



export default axiosInstance
