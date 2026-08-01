// import mongoose from 'mongoose';
// import dns from 'dns'
// const MONGODB_URL = process.env.MONGODB_URL;



// if (!MONGODB_URL) {
//   throw new Error('Please define the MONGODB_URL environment variable inside .env.local');
// }

// // Global declaration to prevent multiple connections during Next.js hot reloads
// let cached = (global as any).mongoose;

// if (!cached) {
//   cached = (global as any).mongoose = { conn: null, promise: null };
// }

// async function ConnectDb() {

//   dns.setServers([
//   '1.1.1.1',
//   '8.8.8.8'
// ])
// console.log("working")
 

//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//         bufferCommands: false,
//       // Force Node to look up via IPv4 only
//         family: 4,
//     };

//     cached.promise = mongoose.connect(MONGODB_URL!, opts)
//       .then((mongooseInstance) => {
//         return mongooseInstance;
//       })
//       .catch((err) => {
//         // CRITICAL: If connection fails, clear the promise cache 
//         // so the next attempt can actually try again!
//         cached.promise = null;
//         throw err;
//       });
//   }

//   try {
//   cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null; // Clear out the broken promise on failure
//     throw e;
//   }

//   return cached.conn;
// }

// export default ConnectDb;