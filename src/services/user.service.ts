import scyllaDbClient from '../db/scyllaDbClient';
import { User } from '../types';

/**
 * Service to handle user-related operations.
 */

async function createUser(user: User): Promise<User> {
  try {
    const query = 'INSERT INTO users (user_id, user_name, user_avatar) VALUES (?, ?, ?)';
    const params = [user.userId, user.userName, user.userAvatar || null];
    await scyllaDbClient.execute(query, params, { prepare: true });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

export default {
  createUser,
};