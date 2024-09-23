# Searce Assignment Backend

## Getting Started

Follow these steps to run the Node.js project:

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**:

   ```bash
   npm i
   ```

3. **Ensure you are using the correct Node version** (used for development):
   `Node.js v20.11.0`

4. **Start the development server**:

   ```bash
   nodemon index.js
   ```

   `OR`

   ```bash
   node index.js
   ```

5. **Configure environment variables**:

   This project uses PostgreSQL as the database. Create a `.env` file in the root directory and configure the following:

   ```bash
    SERVER_PORT=your-server-port
    IS_PRODUCTION=false
    ISSUER=searce-assignment
    SALT_ROUND=10
    DB_HOST=localhost
    DB_HOST=your-database-host
    DB_PORT=your-database-port
    DB_NAME=your-database-name
    DB_USER=your-database-username
    DB_PASS=your-database-password
    JWT_SECRET=your-jwt-secret
   ```

6. Once the server is running, access the API at `http://localhost:<port>`, where `<port>` is the value specified in your `.env` file.

```

This version clearly states that PostgreSQL is being used as the database. Let me know if you need anything else!
```
