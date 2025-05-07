import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://default:DW4yzNFzQ4sGQioKKn7qXHtPx0rghjWW@redis-13666.c305.ap-south-1-1.ec2.redns.redis-cloud.com:13666'
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

if (!redisClient.isOpen) {
  await redisClient.connect();
  console.log("✅ Redis connected to Redis Cloud");
}

export default redisClient;
