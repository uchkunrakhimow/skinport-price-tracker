import { FastifyReply, FastifyRequest } from 'fastify';
import { pool } from '@/db';
import { WithdrawRequest } from '@/types';

/**
 * Endpoint handler to withdraw funds from a user's balance.
 * Utilizes transaction management to ensure atomicity and prevent race conditions.
 * @param request - The Fastify request object
 * @param reply - The Fastify reply object
 * @returns A success message or an error response
 */
export const withdrawFunds = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const client = await pool.connect(); // Obtain a client from the connection pool to manage the transaction

  // Destructure the userId from request params and amount from the body
  const { userId } = request.params as { userId: string };
  const { amount } = request.body as WithdrawRequest;

  // Input validation: Ensure the userId exists, and the amount is a positive number
  if (!userId || !amount || typeof amount !== 'number' || amount <= 0) {
    // Return early in case of invalid input, avoiding unnecessary DB transactions
    return reply.status(400).send({ error: 'Invalid request parameters' });
  }

  try {
    await client.query('BEGIN'); // Start the transaction. Ensures all queries are atomic.

    // Single query for balance check and deduction to prevent race conditions.
    // FOR UPDATE lock is implicit here by nature of the balance check and update being atomic.
    const updateQuery = `
      UPDATE users
      SET balance = balance - $1
      WHERE id = $2 AND balance >= $1
      RETURNING balance;
    `;

    // Execute the query with the amount and userId. If the balance is insufficient, no rows will be returned.
    const { rows } = await client.query(updateQuery, [amount, userId]);

    if (rows.length === 0) {
      // If no rows were returned, either the user doesn't exist or they have insufficient funds.
      await client.query('ROLLBACK'); // Explicit rollback for any failed cases.
      return reply
        .status(400)
        .send({ error: 'Insufficient funds or user not found' });
    }

    // Commit the transaction since everything succeeded. Failure to commit will result in automatic rollback in some DBs, but explicit commit is always safer.
    await client.query('COMMIT');

    // Respond with the updated balance after successful withdrawal
    return { message: 'Withdrawal successful', balance: rows[0].balance };
  } catch (error) {
    // In case of an exception, rollback the transaction to maintain database integrity.
    await client.query('ROLLBACK');
    console.error('Error withdrawing funds:', error); // Detailed logging for debugging

    // Return a generic error to the client. Avoid exposing internal details about the exception.
    return reply.status(500).send({ error: 'Failed to withdraw funds' });
  } finally {
    // Always release the client back to the pool, even in error cases, to avoid connection leaks.
    client.release();
  }
};
