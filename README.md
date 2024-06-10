# Skinport Items API Server

This is a web server built using Fastify, Typescript, and PostgreSQL. It provides two endpoints:

1. `/items`: Fetches a list of items from the Skinport API and caches the response.
2. `/users/:userId/withdraw`: Allows withdrawing funds from a user's account.

## Prerequisites

- Node.js (version 20 or later)
- PostgreSQL (version 16 or later)

## Environment Variables

The application requires the following environment variables to be set:

- `DB_HOST`: The host for the PostgreSQL database.
- `DB_PORT`: The port for the PostgreSQL database.
- `DB_USER`: The username for the PostgreSQL database.
- `DB_PASSWORD`: The password for the PostgreSQL database.
- `DB_NAME`: The name of the PostgreSQL database.
- `CACHE_DURATION`: The duration (in seconds) for caching the Skinport items.
- `SKINPORT_API_URL`: The URL for the Skinport API.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/thezathe/-skinport-price-tracker.git
   ```
2. Install the dependencies:
   ```
   cd task
   npm install
   ```
3. Create a `.env` file in the root of the project and add the necessary environment variables:
   ```
   DB_HOST=your-db-host
   DB_PORT=your-db-port
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=your-db-name
   CACHE_DURATION=3600
   SKINPORT_API_URL=https://api.skinport.com/v1/items
   ```
4. Ensure that you have a PostgreSQL database running and that the user specified in the environment variables has the necessary permissions to create and modify tables.

## Running the Application

1. Compile the TypeScript code:
   ```
   npm run build
   ```
2. Start the server:
   ```
   npm start
   ```

Alternatively, you can run the server in development mode using `nodemon` and the TypeScript compiler:

```
npm run dev
```

This will start the server and automatically restart it whenever you make changes to the code.

## Endpoints

### `/items`

This endpoint fetches a list of items from the Skinport API and returns an array of objects with the following properties:

- `name`: The name of the item.
- `tradeableMinPrice`: The minimum price for the tradable version of the item.
- `nonTradeableMinPrice`: The minimum price for the non-tradable version of the item.
- `appId`: The ID of the application the item is associated with.
- `currency`: The currency of the prices.

The response is cached for the duration specified by the `CACHE_DURATION` environment variable.

### `/users/:userId/withdraw`

This endpoint allows withdrawing funds from a user's account. It expects the following request body:

```json
{
  "amount": 100
}
```

The `amount` field specifies the amount to be withdrawn from the user's account.

If the user has sufficient funds, the balance will be updated, and a success message will be returned. If the user does not have enough funds or the request parameters are invalid, an error message will be returned.

## Error Handling

The application uses Fastify's built-in error handling mechanism. If an error occurs during the execution of an endpoint, the server will respond with an appropriate HTTP status code and an error message.

## Additional Features

- **Caching**: The `/items` endpoint caches the response from the Skinport API to improve performance and reduce the load on the external API.
- **Input Validation**: The `/users/:userId/withdraw` endpoint validates the input parameters to ensure that the request is valid before processing it.
- **Logging**: The application uses the built-in logging capabilities of Fastify to log errors and other relevant information.

## Future Improvements

- **Pagination**: The `/items` endpoint could be extended to support pagination, allowing users to fetch the items in smaller chunks.
- **Authentication and Authorization**: The application could be extended to include authentication and authorization mechanisms, allowing users to perform actions based on their permissions.
- **Error Handling and Logging**: The error handling and logging could be further improved to provide more detailed information and make it easier to debug issues.
- **Testing**: Unit and integration tests could be added to ensure the correctness and reliability of the application.

## License

This project is licensed under the [MIT License](LICENSE).