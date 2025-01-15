# Node.js Web API with TypeScript and Swagger

This project is a simple Node.js web API built using TypeScript and Swagger. It implements a "Hello World" endpoint.

## Project Structure

```
nodejs-web-api
├── src
│   ├── app.ts                # Entry point of the application
│   ├── controllers
│   │   └── helloController.ts # Controller for handling requests
│   ├── routes
│   │   └── helloRoutes.ts     # Routes for the API
│   ├── swagger
│   │   └── swagger.json        # Swagger configuration
│   └── types
│       └── index.ts           # Custom types and interfaces
├── package.json               # npm configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd nodejs-web-api
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

4. **Access the API:**
   Open your browser and navigate to `http://localhost:3000/api/hello` to see the "Hello World" response.

## Usage Example

To test the "Hello World" endpoint, you can use a tool like Postman or simply visit the URL mentioned above in your web browser.

## API Documentation

The API documentation is available at `http://localhost:3000/api-docs`, where you can explore the available endpoints and their specifications.