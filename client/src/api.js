// Dynamically set API base URL based on environment
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://evalai-webapp.azurewebsites.net/api"
    : "http://localhost:5000/api";

export default BASE_URL;
