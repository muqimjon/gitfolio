import { handleCard } from "../src/handler.js";

export default async function handler(req, res) {
  const { status, headers, body } = await handleCard(req.query || {}, process.env);
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  return res.status(status).send(body);
}
