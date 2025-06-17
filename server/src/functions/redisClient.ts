import { createClient } from "redis";

// Create a Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379", // Use your Redis URL or localhost
});

const saveUserDataInRedis = (values: {
  username: string;
  countryCode: string;
  mobile: string;
  avatar: string;
  hashedPassword: string;
  roleName: string;
  otp: string;
  roleId?: string;
  monitorId?: string;
}) => {
  const userData = JSON.stringify({ ...values });
  redisClient.setEx(`user_${values.mobile}`, 120, userData);
};

const saveForgetUserDetails = (mobile: string, otp: string) => {
  const userData = JSON.stringify({
    mobile,
    otp,
  });

  redisClient.setEx(`user_fp_${mobile}`, 120, userData);
};
// Connect to Redis
redisClient
  .connect()
  .catch((err) => console.error("Redis connection error", err));

export { redisClient, saveUserDataInRedis, saveForgetUserDetails };
