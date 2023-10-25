module.exports = function generateCode(key) {
    const timeInTenSec = Math.floor(Date.now() / 10000);
    return timeInTenSec - key;
}