const prod = true;
export const getApiUrl = (endpoint) => {
    return (prod ? "https://5vsxuqquui3olnbr8thvf3gw.dev20.woogma.com/" : "http://localhost:8080") + endpoint;
}