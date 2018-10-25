const getDataFromCookie = (key) => {
    let a = document.cookie.split("; ");
    a = a.map((row) => row.split("="));
    let x;
    if (key === "token") {
        x = a.filter((row) => row[0] === "token");
    } else if(key === "userId") {
        x = a.filter((row) => row[0] === "userId");
    } if (key === "userRoleId") {
        x = a.filter((row) => row[0] === "userRoleId");
        return (x.length === 0) ? 0 : Number(x[0][1]);
    }
    return (x.length === 0) ? "": x[0][1];
}

export default getDataFromCookie;