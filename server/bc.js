const bc = require('bcryptjs');
let { genSalt, hash, compare } = bc;
const { promisify } = require('util');

genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

exports.compare = compare;
exports.hash = (plainTextPw) => genSalt().then((salt) => hash(plainTextPw, salt));



