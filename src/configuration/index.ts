export default () => ({
  port: process.env.SERVER_PORT,
  secret: process.env.SECRET_JWT,
  expireJwt: process.env.EXPIRE_JWT,
});
