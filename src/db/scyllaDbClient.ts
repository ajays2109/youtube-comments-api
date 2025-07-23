import { Client } from 'cassandra-driver';
import { config } from '../config';

const scyllaDbClient = new Client({
  contactPoints: config.scyllaDb.contactPoints.split(','),
  localDataCenter: config.scyllaDb.localDataCenter,
  credentials: {
    username: config.scyllaDb.username,
    password: config.scyllaDb.password,
  },
  keyspace: config.scyllaDb.keyspace,
});

export async function connectScyllaDb() {
  try {
    // Connect to the ScyllaDB cluster
    console.log('Connecting to ScyllaDB...');
    await scyllaDbClient.connect();
    console.log('Connected to ScyllaDB successfully');
  } catch (error) {
    console.error('Error connecting to ScyllaDB:', error);
    throw error; // Re-throw the error for further handling
  }
}

export async function disconnectScyllaDb() {
  try {
    // Disconnect from the ScyllaDB cluster
    console.log('Disconnecting from ScyllaDB...');
    await scyllaDbClient.shutdown();
    console.log('Disconnected from ScyllaDB successfully');
  } catch (error) {
    console.error('Error disconnecting from ScyllaDB:', error);
    throw error; // Re-throw the error for further handling
  }
}

export default scyllaDbClient;