import app from './app';
import { config } from './config';
import { connectScyllaDb, disconnectScyllaDb } from './db/scyllaDbClient';

const PORT = config.port;

// Start the server
(async() => {
  await connectScyllaDb();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();

// Graceful shutdown
process.on('SIGINT', async() => {
  console.log('Shutting down server...');
  await disconnectScyllaDb();
  process.exit(0);
});
