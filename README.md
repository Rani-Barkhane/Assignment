# Assignment

This project is a simple Node.js application that uses Express.js for routing and a cluster module to take advantage of multi-core systems. It also includes a set of API endpoints for managing users and their data.

## Getting Started

1. Clone the repository to your local machine.
2. Run `npm install` to install all the dependencies.
3. Create a `.env` file in the root directory and set the `PORT` variable (default is 4000 if not provided).

## Running the Application

- For development, run `npm run start:dev`.
- For production, run `npm run start:prod`.
- To start the application with clustering enabled, run `npm run start:multi`.

## Testing

Run `npm test` to execute the test cases.

## API Endpoints

- GET `/api/users`: Fetch all users.
- GET `/api/users/:userId`: Fetch a user by id.
- POST `/api/users`: Create a new user.
- PUT `/api/users/:userId`: Update a user by id.
- DELETE `/api/users/:userId`: Delete a user by id.
