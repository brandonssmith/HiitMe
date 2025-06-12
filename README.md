# CrossFit Workout Generator

A responsive web application that generates personalized CrossFit-style workouts based on user preferences.

## Features

- User authentication via Google OAuth
- Responsive design for desktop, mobile, and TV displays
- Customizable workout parameters:
  - Warm-up selection
  - Muscle group targeting
  - Number of rounds
  - Rest intervals
- CrossFit movement database
- Workout history tracking

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret
   ```
4. Start the development server:
   ```bash
   npm run dev:full
   ```

## Tech Stack

- Frontend: React, Material-UI
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: Passport.js, Google OAuth
- State Management: Redux Toolkit

## Contributing

Feel free to submit issues and enhancement requests! 

Forced