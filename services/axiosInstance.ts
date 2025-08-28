import axios from 'axios';
// import Cookies from 'js-cookie';
import { getItem } from './localStorage';
// eslint-disable-next-line import/no-cycle

// eslint-disable-next-line import/no-cycle
const base_url = "https://www.onemysetu.com"
// const base_url = "https://localhost:65437"

const API_ENDPOINT = base_url+"/api/";  

const authHeader = () => ({
  Authorization: `Bearer ${getItem('token')}`,
});

const client = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    Authorization: `Bearer ${getItem('token')}`,
    'Content-Type': 'application/json',
  },
});


class DataService {
  // static get(path = '') {
  //   return client({
  //     method: 'GET',
  //     url: path,
  //     headers: { ...authHeader() },
  //   });
  // }

  static get(path = '', config: import('axios').AxiosRequestConfig = {}) {
    return client({
      method: 'GET',
      url: path,
      headers: { ...authHeader(), ...(config.headers || {}) },
      params: config.params,
    });
  }



  static post(path = '', data = {}, optionalHeader = {}) {
    return client({
      method: 'POST',
      url: path,
      data,
      headers: { ...authHeader(), ...optionalHeader },
    });
  }



  static patch(path = '', data = {}) {
    return client({
      method: 'PATCH',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() },
    });
  }

  static delete(path = '', data = {}) {
    return client({
      method: 'DELETE',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() },
    });
  }

  static put(path = '', data = {}, p0: { headers: { Authorization: string; "Content-Type": string; }; }) {
    return client({
      method: 'PUT',
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() },
    });
  }
}

/**
 * axios interceptors runs before and after a request, letting the developer modify req,req more
 * For more details on axios interceptor see https://github.com/axios/axios#interceptors
 */
client.interceptors.request.use(config => {
  // do something before executing the request
  // For example tag along the bearer access token to request header or set a cookie
  const requestConfig = config;
  const { headers } = config;
  // requestConfig.headers = { ...headers, Authorization: `Bearer ${getItem('access_token')}` };

  return requestConfig;
});

client.interceptors.response.use(
  response => response,
  error => {
    /**
     * Do something in case the response returns an error code [3**, 4**, 5**] etc
     * For example, on token expiration retrieve a new access token, retry a failed request etc
     */
    const { response } = error;
    const originalRequest = error.config;
    if (response) {
      if (response.status === 500) {
        // do something here
      } else if (response && (response.status === 401 || response.status === 0)) {
        // Unauthorized access, handle accordingly (e.g., redirect to login)
        // Clear invalid token and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // Redirect to login page
          window.location.href = "/auth/login";
        }
        return response
      } else {
        return response;
      }
    }
    return Promise.reject(error);
  },
);
export { DataService,base_url };
