const apiRequest = (url, method, data) => {
    let init = {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            },
        body: data,
        mode: 'cors'
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