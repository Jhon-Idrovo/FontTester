import axios from "axios";

let baseURL = `${
  process.env.NODE_ENV !== "test"
    ? "https://font-tester-api.herokuapp.com"
    : "http://localhost:8000"
}/api/v3`;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.response.use(
  //on fulfill
  (res) => res,
  //on reject
  async (error) => {
    console.log("Failed request intercepted", error.response);
    const originalRequest = error.config;
    //IF THE SERVER ISN'T WORKING
    if (typeof error.response === "undefined") {
      alert(
        "A server/network error occurred. " +
          "Looks like CORS might be the problem. " +
          "Sorry about this - we will get it fixed shortly."
      );
      return Promise.reject(error);
    }
    //if the refresh token has expired or is invalid redirect to login
    if (
      error.response.status === 401 &&
      originalRequest.url === baseURL + "/tokens/new-access-token"
    ) {
      window.location.href = "/signin";
      alert("Plase signin");
      return Promise.reject(error);
    }
    //if the access token has expired
    if (
      error.response.status === 401 &&
      error.response.data.error.message === "Authorization failed"
    ) {
      //randon name for security
      const refreshToken = localStorage.getItem("rr");

      if (refreshToken) {
        const tokenParts = JSON.parse(
          Buffer.from(refreshToken.split(".")[1], "base64").toString()
        );

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);

        if (tokenParts.exp > now) {
          return axiosInstance
            .post("/tokens/new-access-token", { refreshToken })
            .then((response) => {
              console.log("New atkn response", response);

              typeof window !== "undefined" &&
                localStorage.setItem("ss", response.data.accessToken);
              // localStorage.setItem("refresh_token", response.data.refresh);

              axiosInstance.defaults.headers.Authorization =
                "JWT " + response.data.accessToken;
              originalRequest.headers.Authorization =
                "JWT " + response.data.accessToken;

              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("Refresh token is expired", tokenParts.exp, now);
          window.location.href = "/";
        }
      } else {
        console.log("Refresh token not available.");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
