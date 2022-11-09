const path = require("path");

module.exports = {
  devServer: {
    static: "./",
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  mode: "development"
};
