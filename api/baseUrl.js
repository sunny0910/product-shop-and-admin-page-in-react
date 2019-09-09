function env() {
    if (process.NODE_ENV === 'production') {
        return true;
    } else {
        return false
    }
}
const ROOT_URL = env()
    ? 'https://react-shop-store.herokuapp.com/api'
    : 'http://localhost:3001';
module.exports = ROOT_URL;
