# Book Management API with Email Notifications and Data Seeding

A RESTful API for managing books with user authentication, email notifications, and automated data seeding built with Node.js, Express, MongoDB, Nodemailer, and Faker.js.

## Features

- 📚 **Book Management**: Create, read, update, and delete books
- 🔐 **User Authentication**: JWT-based authentication system
- 📧 **Email Notifications**: Automatic email notifications when books are created
- 🎨 **Professional Email Templates**: Beautiful HTML emails using Pug templates
- 🌱 **Data Seeding**: Automated generation of realistic sample data using Faker.js
- 🛡️ **Input Validation**: Comprehensive validation using Joi
- 🔒 **Secure**: Password hashing with bcrypt
- 📱 **Responsive**: Email templates work on all devices

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer with Gmail SMTP
- **Templates**: Pug template engine
- **Data Generation**: Faker.js for realistic sample data
- **Validation**: Joi
- **Security**: bcrypt for password hashing

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_gmail@gmail.com
   SMTP_PASS=your_gmail_app_password
   FROM_EMAIL=your_gmail@gmail.com

   # Environment
   NODE_ENV=production
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## Data Seeding

This project includes a powerful data seeding feature that generates realistic sample data for development and testing.

### Quick Start with Sample Data

To populate your database with sample data:

```bash
npm run seed
```

This command will:

- 🧹 Clear existing users and books from the database
- 👥 Generate 10 fake users with realistic usernames and emails
- 📚 Create 25 fake books with realistic titles, authors, and publication years (1950-2024)
- 🔐 Set all user passwords to "password123" (hashed with bcrypt)
- 📊 Display a detailed summary of the seeding process

### Sample Output

```
🌱 Starting database seeding process...
=====================================
🔌 Connecting to MongoDB...
✅ Connected to MongoDB successfully

🧹 Clearing existing data...
✅ Deleted 0 users
✅ Deleted 0 books

👥 Generating 10 fake users...
🔐 Password hashed successfully
  📝 Generated user 1: JohnDoe123 (john.doe@example.com)
  📝 Generated user 2: JaneSmith456 (jane.smith@example.com)
  ...

📚 Generating 25 fake books...
  📖 Generated book 1: "The Art of Programming" by John Smith (2020)
  📖 Generated book 2: "Modern Web Development" by Jane Doe (2019)
  ...

📊 SEEDING SUMMARY
==================
👥 Users created: 10
📚 Books created: 25
🔐 Default password for all users: "password123"

✨ Database seeding completed successfully!
```

### Using Seeded Data

After seeding, you can:

1. Login with any generated username and password "password123"
2. View all books through the API endpoints
3. Test the complete functionality with realistic data

### Seeder Features

- **Realistic Data**: Uses Faker.js to generate authentic-looking usernames, emails, book titles, and author names
- **Safe Execution**: Can be run multiple times safely (clears old data first)
- **Comprehensive Logging**: Detailed progress messages and error handling
- **Validation Compliance**: All generated data passes model validation rules
- **Unique Constraints**: Ensures usernames and emails are unique

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User

```http
POST /api/auth/signin
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

### Books (Protected Routes)

All book endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

#### Get All Books

```http
GET /api/books
```

#### Get Book by ID

```http
GET /api/books/:id
```

#### Create Book (Triggers Email Notification)

```http
POST /api/books
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "year": 1925
}
```

#### Update Book

```http
PUT /api/books/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "author": "Updated Author",
  "year": 2024
}
```

#### Delete Book

```http
DELETE /api/books/:id
```

## Email Notifications

When a new book is created, the system automatically sends a professional email notification to the authenticated user containing:

- Book title, author, and year
- Confirmation message
- Professional styling with responsive design
- Company branding and signature

## Environment Variables

| Variable      | Description                 | Example                             |
| ------------- | --------------------------- | ----------------------------------- |
| `MONGODB_URI` | MongoDB connection string   | `mongodb://localhost:27017/bookapi` |
| `JWT_SECRET`  | Secret key for JWT tokens   | `your-secret-key`                   |
| `SMTP_HOST`   | SMTP server hostname        | `smtp.gmail.com`                    |
| `SMTP_PORT`   | SMTP server port            | `587`                               |
| `SMTP_USER`   | Email username              | `your-email@gmail.com`              |
| `SMTP_PASS`   | Email password/app password | `your-app-password`                 |
| `FROM_EMAIL`  | Sender email address        | `your-email@gmail.com`              |
| `NODE_ENV`    | Environment mode            | `production`                        |

## Security Notes

- Never commit your `.env` file to version control
- Use Gmail App Passwords instead of your regular password
- Keep your JWT secret secure and complex
- Use HTTPS in production
- Regularly rotate your secrets

## Error Handling

The API includes comprehensive error handling:

- Email failures don't break book creation
- Detailed error logging for debugging
- Graceful fallbacks for all operations
- Input validation with meaningful error messages

## Project Structure

```
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── bookController.js     # Book management logic
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── send-email.middleware.js # Email notification middleware
├── models/
│   ├── Book.js              # Book data model
│   └── User.js              # User data model
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   └── bookRoutes.js        # Book management routes
├── seeders/
│   └── seed.js              # Database seeding script
├── validation/
│   └── auth.validation.js   # Input validation schemas
├── views/
│   └── bookCreated.pug      # Email template
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
└── server.js               # Main application file
```

## License

This project is licensed under the ISC License.
