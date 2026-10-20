const prod = false;
export const getApiUrl = (endpoint) => {
    return (prod ? "https://dikkenek-backend.dev20.woogma.com/" : "http://localhost:8080") + endpoint;
}