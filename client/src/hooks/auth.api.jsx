import { axiosClient } from "../config/api.config";
const AUTH_API_ENDPOINT = "/auth";
const authApi = {
  postLoginWithGoogle: () => {
    window.location.assign(
      axiosClient.defaults.baseURL + AUTH_API_ENDPOINT + "/google"
    );
  },
  postLoginLocal: (data) => {
    const url = `${AUTH_API_ENDPOINT}/login`;
    return axiosClient.post(url, data);
  },
  getUser:()=>{
    const url = `${AUTH_API_ENDPOINT}/me`;
    return axiosClient.get(url);
  }
};
export default authApi;
