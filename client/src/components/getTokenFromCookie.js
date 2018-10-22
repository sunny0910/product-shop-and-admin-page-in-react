const getToken = () => {
    let a = document.cookie.split("; ");
    a = a.map((row) => row.split("="));
    let x = a.filter((row) => row[0] === "token");
    return (x.length === 0) ? "": x[0][1];
}

export default getToken;