require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const User = require("./models/user"); // ← added

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

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPrice() {
  return Math.floor(Math.random() * 20000) + 1500;
}

async function main() { // ← sampleListings moved inside main()
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
          url: `https://source.unsplash.com/800x600/?house,${place.city.toLowerCase()}`,
          filename: `listing_${i + 1}`
        },
        price: randomPrice(),
        location: place.city,
        country: place.country,
        category: random(categories),
        reviews: [],
        owner: defaultOwner._id  // ← assigned here
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