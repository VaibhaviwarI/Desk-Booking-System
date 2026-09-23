require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/desk_booking",
  JWT_SECRET: process.env.JWT_SECRET || "default_jwt_secret_key_12345",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};
