function node() {
    if (process.NODE_ENV === 'production') {
        return true;
    } else {
        return false
    }
}
const ROOT_URL = node()
    ? 'https://react-shop-store.herokuapp.com/api'
    : 'http://localhost:3001/api/v1';
export default ROOT_URL;
