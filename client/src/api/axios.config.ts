import Axios, { AxiosError } from "axios";
import { store } from "@/store/store";
import { showErrorToast } from "@/utils/toast.util";
import { NavigateFunction } from "react-router";

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
export const baseURL = `${serverUrl}`;

export const axios = Axios.create({
  baseURL,
  timeout: 120000,
  withCredentials: true,
});

const authAxios = Axios.create({
  baseURL,
  timeout: 120000,
  withCredentials: true,
});

authAxios.interceptors.request.use(
  async function (config) {
    const token = store?.getState()?.user?.token;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    config.withCredentials = true;
    config.baseURL = baseURL;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

authAxios.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    // const originalRequest = error.config;
    // const status = error?.response?.status;
    // const role = store.getState()?.user?.role;

    // if (
    //   (status === 401 || status === 403) &&
    //   !originalRequest._retry &&
    //   refreshToken
    // ) {
    //   if (isRefreshing) {
    //     return new Promise(function (resolve, reject) {
    //       failedQueue.push({ resolve, reject });
    //     })
    //       .then((token) => {
    //         originalRequest.headers["Authorization"] = "Bearer " + token;
    //         return authAxios(originalRequest);
    //       })
    //       .catch((err) => {
    //         return Promise.reject(err);
    //       });
    //   }

    //   originalRequest._retry = true;
    //   isRefreshing = true;

    //   try {
    //     const res = await Axios.post(`${baseURL}/auth/refresh-access-token`, {
    //       refresh_token: refreshToken,
    //     });
    //     const { access_token } = res.data;

    //     // Dispatch to update Redux
    //     store.dispatch(
    //       login({ accessToken: access_token, refreshToken, role })
    //     );
    //     // Retry failed requests

    //     originalRequest.headers["Authorization"] = "Bearer " + access_token;
    //     return authAxios(originalRequest);
    //   } catch (err) {
    //     store.dispatch(logout());
    //     return Promise.reject(err);
    //   } finally {
    //     isRefreshing = false;
    //   }
    // }
    return Promise.reject(error);
  }
);

export const handleActionsError = (
  error: any | AxiosError,
  navigate?: NavigateFunction
): { message: string; status: false } => {
  if (error instanceof AxiosError) {
    const { response } = error;
    if (!response) {
      showErrorToast("No Response from server");
      return { message: "No Response!", status: false };
    }

    const { status, data } = response;

    const message =
      typeof data?.message === "string"
        ? data.message
        : Array.isArray(data?.message)
        ? data.message.join(", ")
        : "Something went wrong!";

    switch (status) {
      case 400:
      case 409:
      case 412:
      case 418:
      case 429:
        showErrorToast(message);
        break;

      case 401:
        showErrorToast("Unauthorized access");
        window.location.href = "/unauthorized";
        navigate?.("/unauthorized");
        break;

      case 403:
        showErrorToast("Access forbidden");
        window.location.href = "/forbidden";
        navigate?.("/forbidden");
        break;

      case 404:
        showErrorToast("Page not found");
        window.location.href = "/not-found";
        navigate?.("/not-found");
        break;

      case 500:
      case 508:
        console.error("Server Error:", error);
        break;

      default:
        console.error("Unhandled error:", error);
        break;
    }

    return { message, status: false };
  }
  console.error("Unknown error:", error);
  return { message: "An unknown error occurred", status: false };
};

export default authAxios;

// const handleSubmit = async () => {
//   try {
//     const res = await axios.post("/api/submit", formData);
//     showSuccessToast("Form submitted successfully");
//   } catch (error) {
//     const navigate = useNavigate();
//     const result = handleActionsError(error, navigate);
//     // Optional: set error message in state
//   }
// };
