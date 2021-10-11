import axios from "axios";

const authaxios = axios.create({})

authaxios.interceptors.request.use(
    config => {
        config.headers['Authorization'] = 'Bearer ' + sessionStorage.getItem("token");
        return config;
    },
    error => {
        Promise.reject(error)
    });
export default authaxios ;