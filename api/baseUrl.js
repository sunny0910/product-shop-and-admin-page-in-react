function env() {
    if (process.env.ENV === 'production') {
        return true;
    } else {
        return false
    }
}
const ROOT_URL = env()
    ? '/api'
    : 'http://localhost:3001';
module.exports = ROOT_URL;
