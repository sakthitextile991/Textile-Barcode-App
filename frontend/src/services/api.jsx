import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/`,
});

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("access");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;
  }
);

api.interceptors.response.use(
  response => response,

  async error => {

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/accounts/refresh/")
    ) {

      originalRequest._retry = true;

      try{
        const refresh =
          localStorage.getItem(
            "refresh"
          );


        console.log("401 detected");
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/accounts/refresh/`,
          {
            refresh,
          }
        );

        console.log("Refresh success");
        console.log(res.data);

        localStorage.setItem(
          "access",
          res.data.access
        );

        if (res.data.refresh) {
          localStorage.setItem(
            "refresh",
            res.data.refresh
          );
        }

        originalRequest.headers.Authorization =
          `Bearer ${res.data.access}`;

        return api(originalRequest);

      } catch (refreshError) {

        console.error(
          "Refresh failed:",
          refreshError.response?.data
        );

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return Promise.reject(refreshError);

      }
    }

    return Promise.reject(error);
  }
);

export default api;