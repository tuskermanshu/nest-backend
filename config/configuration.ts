export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  email: {
    name: process.env.EMAIL_NAME,
    code: process.env.EMAIL_CODE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
  },
  secret: {
    secret: process.env.JWT_SECRET,
    tokenTime: process.env.JWT_ACCESS_TOKEN_EXPIRES_TIME,
    refreshTime: process.env.JWT_REFRESH_TOKEN_EXPIRES_TIME,
  },
});
