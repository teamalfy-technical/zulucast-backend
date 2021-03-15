const config = require("config");
const { Logger } = require("../utils/winston");

module.exports = () => {
  if (!config.get("zuluKey")) {
    Logger.error("FATAL ERROR: jwt is not defined.");
    process.exit(1);
  }
};
