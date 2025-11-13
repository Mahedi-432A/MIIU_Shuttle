// // sockets/seat.socket.js
// module.exports = (io) => {
//   io.on("connection", (socket) => {
//     console.log("🟢 User connected:", socket.id);

//     // Seat booked event
//     socket.on("seatBooked", (data) => {
//       console.log("🎫 Seat booked:", data);
//       // data = { busId, seatNumber, userId }

//       // Emit to everyone except the sender
//       socket.broadcast.emit("seatStatusUpdate", data);
//     });

//     socket.on("disconnect", () => {
//       console.log("🔴 User disconnected:", socket.id);
//     });
//   });
// };


// sockets/seat.socket.js

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // ✅ নতুন ইভেন্ট: বাসের রুমে জয়েন করা
    socket.on("joinBusRoom", (busId) => {
      socket.join(busId);
      console.log(`Socket ${socket.id} joined room ${busId}`);
    });

    // ❌ "seatBooked" ইভেন্ট এখান থেকে সরিয়ে ফেলা হয়েছে
    // এটি এখন কন্ট্রোলারে হ্যান্ডেল করা হবে

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};