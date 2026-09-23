const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Floor = require("../models/Floor");
const Desk = require("../models/Desk");

const seed = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding...");

    // 1. Create or Update Admin User
    const adminIdentifier = "admin";
    let adminUser = await User.findOne({
      $or: [{ name: adminIdentifier }, { email: "admin@deskbook.com" }],
    });

    if (!adminUser) {
      adminUser = await User.create({
        name: "admin",
        email: "admin@deskbook.com",
        password: "admin123",
        role: "ADMIN",
      });
      console.log("✅ Admin user created successfully (Username: admin, Email: admin@deskbook.com, Password: admin123)");
    } else {
      adminUser.name = "admin";
      adminUser.email = "admin@deskbook.com";
      adminUser.role = "ADMIN";
      adminUser.password = "admin123";
      await adminUser.save();
      console.log("✅ Admin user updated with credentials (Username: admin, Password: admin123)");
    }

    // 2. Define 10 Floors
    const floorsData = [
      { floorNumber: 1, name: "Ground Floor - Welcome & Reception", capacity: 30 },
      { floorNumber: 2, name: "Floor 2 - Engineering Wing", capacity: 40 },
      { floorNumber: 3, name: "Floor 3 - Product & UI/UX Design", capacity: 35 },
      { floorNumber: 4, name: "Floor 4 - Marketing & Growth", capacity: 30 },
      { floorNumber: 5, name: "Floor 5 - Sales & Partnerships", capacity: 35 },
      { floorNumber: 6, name: "Floor 6 - Operations & HR", capacity: 25 },
      { floorNumber: 7, name: "Floor 7 - Finance & Legal", capacity: 25 },
      { floorNumber: 8, name: "Floor 8 - Innovation & AI Labs", capacity: 40 },
      { floorNumber: 9, name: "Floor 9 - Collaboration & Agile Hub", capacity: 30 },
      { floorNumber: 10, name: "Floor 10 - Executive & Sky Lounge", capacity: 20 },
    ];

    console.log("Seeding 10 floors and accompanying desks...");

    for (const fData of floorsData) {
      let floor = await Floor.findOne({ floorNumber: fData.floorNumber });
      if (!floor) {
        floor = await Floor.create({
          floorNumber: fData.floorNumber,
          name: fData.name,
          capacity: fData.capacity,
          occupiedCount: 0,
        });
        console.log(`Created Floor ${floor.floorNumber}: ${floor.name}`);
      } else {
        floor.name = fData.name;
        floor.capacity = fData.capacity;
        await floor.save();
        console.log(`Updated Floor ${floor.floorNumber}: ${floor.name}`);
      }

      // Check if desks exist for this floor, if not create desks
      const existingDesksCount = await Desk.countDocuments({ floor: floor._id });
      if (existingDesksCount === 0) {
        const desksToCreate = [];
        const zones = ["A", "B", "C"];
        const desksPerFloor = Math.min(floor.capacity, 15); // seed 15 initial active desks per floor

        for (let i = 1; i <= desksPerFloor; i++) {
          const zone = zones[(i - 1) % zones.length];
          const deskNumber = `D-${floor.floorNumber}${String(i).padStart(2, "0")}`;
          desksToCreate.push({
            floor: floor._id,
            deskNumber,
            zone,
            deskType: i === 1 ? "FIXED" : "FLEXIBLE",
            x: ((i - 1) % 5) * 10 + 10,
            y: Math.floor((i - 1) / 5) * 10 + 10,
            isActive: true,
          });
        }

        await Desk.insertMany(desksToCreate);
        console.log(`  └─ Created ${desksToCreate.length} active desks for Floor ${floor.floorNumber}`);
      }
    }

    console.log("\n🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
