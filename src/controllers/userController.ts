import { FastifyReply, FastifyRequest } from 'fastify';

import { pool } from '@/db';
import { WithdrawRequest } from '@/types';

/**
 * Endpoint handler to withdraw funds from a user's balance
 * @param request - The Fastify request object
 * @param reply - The Fastify reply object
 * @returns A success message or an error response
 */
export const withdrawFunds = async (request: FastifyRequest, reply: FastifyReply) => {
  // Extract the userId from the request parameters and the amount from the request body
  const { userId } = request.params as { userId: string };
  const { amount } = request.body as WithdrawRequest;

  // Validate the input parameters
  if (!userId || !amount || typeof amount !== 'number' || amount <= 0) {
    return reply.status(400).send({ error: 'Invalid request parameters' });
  }

  try {
    // Fetch the current balance of the user
    const { rows } = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
    if (rows.length === 0) {
      // If the user is not found, return a 404 error
      return reply.status(404).send({ error: 'User not found' });
    }
    const currentBalance = rows[0].balance;

    // Check if the user has enough funds
    if (currentBalance < amount) {
      // If the user doesn't have enough funds, return a 400 error
      return reply.status(400).send({ error: 'Insufficient funds' });
    }

    // Update the user's balance by subtracting the withdrawal amount
    await pool.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, userId]);
    return { message: 'Withdrawal successful' };
  } catch (error) {
    // Handle any errors that occur during the database operations
    console.error('Error withdrawing funds:', error);
    return reply.status(500).send({ error: 'Failed to withdraw funds' });
  }
};
