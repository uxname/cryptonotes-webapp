import JSSHA from "jssha";
import CryptoJS from "crypto-js";

export default class Utils {
    static hash(str) {
        const shaObj = new JSSHA("SHA-512", "TEXT");
        shaObj.update(str);
        return shaObj.getHash("HEX");
    }

    static encryptString(str, password, salt) {
        return CryptoJS.AES.encrypt(str, salt + password + salt).toString();
    }

    static decryptString(str, password, salt) {
        return CryptoJS.AES.decrypt(str, salt + password + salt).toString(CryptoJS.enc.Utf8);
    }
}
