const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

module.exports = async function generateCode() {
    const secret = speakeasy.generateSecret();
    const qrcode = await QRCode.toDataURL(secret.otpauth_url);
    const keys = { secret, qrcode };
    return keys;
}