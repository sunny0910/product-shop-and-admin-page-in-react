const apiRequest = (url, method, data, additonalHeaders = false) => {
    let init = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            },
        mode: 'cors'
    }
    if (method !== "GET") {
        init.body = data
    }
    if (additonalHeaders) {
        init.headers.token = additonalHeaders;
    }
    return fetch(url, init)
    .then((result) => {
        return result;
    })
    .catch((result) => {
        return result;
    });
}
module.exports = apiRequest;