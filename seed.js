require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const User = require("./models/user");

const MONGO_URL = process.env.ATLASDB_URL;

if (process.env.NODE_ENV === "production") {
  console.log("❌ Seeding blocked in production");
  process.exit(1);
}

const categories = [
  "Trending", "Rooms", "Iconic Cities", "Mountains", "Castles",
  "Amazing Pools", "Camping", "Farms", "Arctic", "Dome", "Cruise"
];

const places = [
  { city: "Manali", country: "India" },
  { city: "Goa", country: "India" },
  { city: "Tokyo", country: "Japan" },
  { city: "Paris", country: "France" },
  { city: "New York", country: "USA" },
  { city: "Dubai", country: "UAE" },
  { city: "Bali", country: "Indonesia" },
  { city: "London", country: "UK" },
  { city: "Sydney", country: "Australia" },
  { city: "Rome", country: "Italy" }
];

const adjectives = [
  "Cozy", "Luxury", "Modern", "Rustic", "Elegant",
  "Private", "Royal", "Scenic", "Hidden", "Peaceful"
];

const propertyTypes = [
  "Villa", "Cabin", "Apartment", "Cottage", "Resort",
  "Penthouse", "Studio", "Hut", "Estate", "Retreat"
];

const unsplashPhotos = [
  "1501785888041-af3ef285b470",
  "1506905925346-21bda4d32df4",
  "1520250497591-112f2f40a3f4",
  "1564501049412-61c2a3083791",
  "1571003123894-1f0594d2b5d9",
  "1580060839134-75a5edca2e99",
  "1507525428034-b723cf961d3e",
  "1476514525535-07fb3b4ae5f1",
  "1518495973542-4542c06a5843",
  "1493976040374-85c8e12f0c0e",
];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice() {
  return Math.floor(Math.random() * 20000) + 1500;
}

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    let defaultOwner = await User.findOne({ email: "demo@user.com" });

    if (!defaultOwner) {
      defaultOwner = await User.create({
        username: "demoUser",
        email: "demo@user.com"
      });
    }

    const sampleListings = Array.from({ length: 100 }).map((_, i) => {
      const place = random(places);
      const title = `${random(adjectives)} ${random(propertyTypes)}`;
      return {
        title: `${title} ${i + 1}`,
        description: `Experience a beautiful stay in ${place.city} with comfort, style, and unforgettable views.`,
        image: {
          url: `https://images.unsplash.com/photo-${unsplashPhotos[i % unsplashPhotos.length]}?w=800`,
          filename: `listing_${i + 1}`
        },
        price: randomPrice(),
        location: place.city,
        country: place.country,
        category: random(categories),
        reviews: [],
        owner: defaultOwner._id
      };
    });

    await Listing.deleteMany({});
    console.log("🧹 Old listings cleared");

    const inserted = await Listing.insertMany(sampleListings);
    console.log(`🚀 Seeded ${inserted.length} listings`);

  } catch (err) {
    console.error("❌ Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
}

main();