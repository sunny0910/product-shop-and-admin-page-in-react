function node() {
    if (process.env.ENV === 'production') {
        return true;
    } else {
        return false
    }
}
const ROOT_URL = node()
    ? '/api'
    : 'http://localhost:3001/api/v1';
export default ROOT_URL;
