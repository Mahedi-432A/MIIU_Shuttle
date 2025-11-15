// const Bus = require("../models/bus.model.js");

// // 📌 বাস খোঁজার নতুন কন্ট্রোলার (আপডেটেড)
// const findBuses = async (req, res) => {
//   try {
//     const { from, to } = req.query;

//     if (!from || !to) {
//       return res.status(400).json({ message: "Route (from & to) is required" });
//     }

//     // ✅ টাইম ম্যানেজমেন্ট: বর্তমান সময় (সার্ভার টাইম)
//     const now = new Date();
//     // সময়কে "HH:mm" ফরম্যাটে রূপান্তর (e.g., "09:05" or "14:30")
//     const currentTime = now.toTimeString().substring(0, 5);

//     // ✅ বাস খোঁজার লজিক:
//     // ১. রুট মিলতে হবে
//     // ২. বাস ছাড়ার সময় (departureTime) বর্তমান সময়ের চেয়ে বেশি হতে হবে
//     const buses = await Bus.find({
//       routeFrom: from,
//       routeTo: to,
//       departureTime: { $gte: currentTime }, // $gte = greater than or equal
//     }).sort({ departureTime: 1 }); // সকালের বাস আগে দেখাবে

//     res.status(200).json(buses);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching buses", error: err.message });
//   }
// };

// module.exports = { findBuses };

const Bus = require("../models/bus.model.js");

// 📌 বাস খোঁজার কন্ট্রোলার (✅ আপডেটেড: Case-insensitive)
const findBuses = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "Route (from & to) is required" });
    }

    // ✅ টাইম ম্যানেজমেন্ট (আগের মতোই)
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5); // "HH:mm"

    // ✅ রুট খোঁজার লজিক (আপডেটেড)
    // $regex এবং 'i' (case-insensitive) ব্যবহার করা হয়েছে
    // .trim() ব্যবহার করে ইনপুট থেকে অতিরিক্ত স্পেস বাদ দেয়া হয়েছে
    const buses = await Bus.find({
      routeFrom: { $regex: new RegExp(from.trim(), 'i') },
      routeTo: { $regex: new RegExp(to.trim(), 'i') },
      departureTime: { $gte: currentTime },
    }).sort({ departureTime: 1 });

    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching buses", error: err.message });
  }
};

// 📌 ✅ নতুন ফাংশন: Autocomplete-এর জন্য সব রুট
const getBusRoutes = async (req, res) => {
  try {
    // ডাটাবেস থেকে সব ইউনিক 'routeFrom' এবং 'routeTo' খুঁজুন
    const fromRoutes = await Bus.distinct("routeFrom");
    const toRoutes = await Bus.distinct("routeTo");

    // দুটি অ্যারে মার্জ করুন এবং ডুপ্লিকেট বাদ দিন
    const allRoutes = [...new Set([...fromRoutes, ...toRoutes])];
    
    // "Campus" রুটটি বাদ দিন, কারণ এটি ইনপুটে ফিক্সড থাকে
    res.status(200).json(allRoutes.filter(route => route.toLowerCase() !== 'campus'));
  } catch (err) {
    res.status(500).json({ message: "Error fetching routes", error: err.message });
  }
};

module.exports = { 
  findBuses,
  getBusRoutes // ✅ নতুন ফাংশন এক্সপোর্ট করুন
};