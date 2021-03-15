const bcrypt = require("bcrypt");

module.exports.hash = async (data) => {
  const salt = await bcrypt.genSalt(10);
  const hashedData = await bcrypt.hash(data, salt);
  return hashedData;
};

module.exports.unhash = async (data, encrypted) => {
  const compared = await bcrypt.compare(data, encrypted);
  return compared;
};
