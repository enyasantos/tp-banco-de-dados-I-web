import axios from 'axios';

export function getAPIClient(ctx) {
  const api = axios.create({
    baseURL: process.env.API_URL,
  });
  return api;
}
