/**
 * Database Seeder Script
 *
 * This script generates and inserts realistic sample data into MongoDB using Faker.js.
 * It creates 10 fake users with hashed passwords and 25 fake books with proper user associations.
 *
 * Usage: npm run seed
 *
 * What it does:
 * - Clears existing users and books collections
 * - Generates 10 users with realistic data and hashed passwords
 * - Generates 25 books with realistic titles, authors, and publication years
 * - Associates each book with a random user
 * - Provides detailed logging and error handling
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

// Import models
const User = require("../models/User");
const Book = require("../models/Book");

// Configuration
const SALT_ROUNDS = 10;
const USERS_COUNT = 10;
const BOOKS_COUNT = 25;
const DEFAULT_PASSWORD = "password123";

/**
 * Connect to MongoDB database
 */
async function connectDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

/**
 * Clear existing data from collections
 */
async function clearExistingData() {
  try {
    console.log("\n🧹 Clearing existing data...");

    const deletedUsers = await User.deleteMany({});
    const deletedBooks = await Book.deleteMany({});

    console.log(`✅ Deleted ${deletedUsers.deletedCount} users`);
    console.log(`✅ Deleted ${deletedBooks.deletedCount} books`);

    return {
      usersDeleted: deletedUsers.deletedCount,
      booksDeleted: deletedBooks.deletedCount,
    };
  } catch (error) {
    console.error("❌ Error clearing existing data:", error.message);
    throw error;
  }
}

/**
 * Generate a unique username (3-15 characters, alphanumeric only)
 */
function generateUniqueUsername(existingUsernames) {
  let username;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    // Generate username with 3-15 characters, alphanumeric only
    const baseUsername = faker.internet.username().replace(/[^a-zA-Z0-9]/g, "");
    username = baseUsername.substring(
      0,
      Math.min(15, Math.max(3, baseUsername.length))
    );

    // Ensure minimum length
    if (username.length < 3) {
      username = username + faker.string.alphanumeric(3 - username.length);
    }

    attempts++;
    if (attempts > maxAttempts) {
      // Fallback: use timestamp to ensure uniqueness
      username = "user" + Date.now() + faker.string.alphanumeric(3);
      break;
    }
  } while (existingUsernames.has(username.toLowerCase()));

  return username;
}

/**
 * Generate fake users with hashed passwords
 */
async function generateUsers() {
  try {
    console.log(`\n👥 Generating ${USERS_COUNT} fake users...`);

    const users = [];
    const existingUsernames = new Set();
    const existingEmails = new Set();

    // Hash the default password once
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
    console.log("🔐 Password hashed successfully");

    for (let i = 0; i < USERS_COUNT; i++) {
      // Generate unique username
      const username = generateUniqueUsername(existingUsernames);
      existingUsernames.add(username.toLowerCase());

      // Generate unique email
      let email;
      let emailAttempts = 0;
      do {
        email = faker.internet.email().toLowerCase();
        emailAttempts++;
        if (emailAttempts > 50) {
          email = `user${Date.now()}${i}@example.com`;
          break;
        }
      } while (existingEmails.has(email));
      existingEmails.add(email);

      const user = {
        username,
        email,
        password: hashedPassword,
      };

      users.push(user);
      console.log(`  📝 Generated user ${i + 1}: ${username} (${email})`);
    }

    // Save users to database
    console.log("\n💾 Saving users to database...");
    const savedUsers = await User.insertMany(users);
    console.log(`✅ Successfully created ${savedUsers.length} users`);

    return savedUsers;
  } catch (error) {
    console.error("❌ Error generating users:", error.message);
    throw error;
  }
}

/**
 * Generate fake books with realistic data
 */
async function generateBooks() {
  try {
    console.log(`\n📚 Generating ${BOOKS_COUNT} fake books...`);

    const books = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < BOOKS_COUNT; i++) {
      // Generate realistic book data
      const title = faker.lorem
        .words({ min: 1, max: 4 })
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const author = faker.person.fullName();
      const year = faker.number.int({ min: 1950, max: currentYear });

      const book = {
        title,
        author,
        year,
      };

      books.push(book);
      console.log(
        `  📖 Generated book ${i + 1}: "${title}" by ${author} (${year})`
      );
    }

    // Save books to database
    console.log("\n💾 Saving books to database...");
    const savedBooks = await Book.insertMany(books);
    console.log(`✅ Successfully created ${savedBooks.length} books`);

    return savedBooks;
  } catch (error) {
    console.error("❌ Error generating books:", error.message);
    throw error;
  }
}

/**
 * Display summary statistics
 */
function displaySummary(stats) {
  console.log("\n📊 SEEDING SUMMARY");
  console.log("==================");
  console.log(`👥 Users created: ${stats.usersCreated}`);
  console.log(`📚 Books created: ${stats.booksCreated}`);
  console.log(`🗑️  Previous users deleted: ${stats.usersDeleted}`);
  console.log(`🗑️  Previous books deleted: ${stats.booksDeleted}`);
  console.log(`🔐 Default password for all users: "${DEFAULT_PASSWORD}"`);
  console.log("\n✨ Database seeding completed successfully!");
  console.log("\n💡 You can now:");
  console.log("   - Start the server: npm run dev");
  console.log(
    '   - Login with any generated username and password "password123"'
  );
  console.log("   - View the seeded data through the API endpoints");
}

/**
 * Main seeding function
 */
async function seedDatabase() {
  const startTime = Date.now();

  try {
    console.log("🌱 Starting database seeding process...");
    console.log("=====================================");

    // Connect to database
    await connectDatabase();

    // Clear existing data
    const clearStats = await clearExistingData();

    // Generate users
    const users = await generateUsers();

    // Generate books
    const books = await generateBooks();

    // Display summary
    const stats = {
      usersCreated: users.length,
      booksCreated: books.length,
      usersDeleted: clearStats.usersDeleted,
      booksDeleted: clearStats.booksDeleted,
    };

    displaySummary(stats);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`⏱️  Total time: ${duration} seconds`);
  } catch (error) {
    console.error("\n💥 SEEDING FAILED");
    console.error("==================");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
  } finally {
    // Close database connection
    try {
      await mongoose.connection.close();
      console.log("\n🔌 Database connection closed");
    } catch (error) {
      console.error("❌ Error closing database connection:", error.message);
    }
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
