import { FastifyReply, FastifyRequest } from 'fastify';
import NodeCache from 'node-cache';
import axios, { AxiosError } from 'axios';

import { config } from '@/config';
import { SkinportItem } from '@/types';

// Create a cache instance with a TTL (Time-To-Live) of 60 seconds
const cache = new NodeCache({ stdTTL: config.cache.duration });

/**
 * Endpoint handler to retrieve Skinport items
 * @param request - The Fastify request object
 * @param reply - The Fastify reply object
 * @returns The transformed Skinport items array
 */
export const getItems = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  // Check if the Skinport items data is already cached
  const cachedData = cache.get<SkinportItem[]>('skinportItems');
  if (cachedData) {
    return cachedData;
  }

  try {
    // Fetch the Skinport items data from the API
    const response = await axios.get(config.skinport.apiUrl);

    // Transform the API response data into the desired format
    const items = response.data.map(
      (item: any): SkinportItem => ({
        name: item.market_hash_name,
        tradeableMinPrice: item.min_price_tradeable, // предположим, есть min_price_tradeable
        nonTradeableMinPrice: item.min_price_non_tradeable, // предположим, есть min_price_non_tradeable
        appId: item.app_id,
        currency: item.currency,
      }),
    );

    // Cache the transformed Skinport items data
    cache.set('skinportItems', items);
    return items;
  } catch (error) {
    // Handle any errors that occur during the API request
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // If there's a response from the API, return the error with the appropriate status code
        return reply
          .status(axiosError.response.status)
          .send({ error: axiosError.response.data });
      } else {
        // If there's no response, return a generic 500 error
        return reply
          .status(500)
          .send({ error: 'Failed to fetch Skinport items' });
      }
    } else {
      // Handle any other types of errors
      return reply
        .status(500)
        .send({ error: 'Failed to fetch Skinport items' });
    }
  }
};
