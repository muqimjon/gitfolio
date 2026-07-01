import { handleCard } from "../src/handler";
import type { Env, Query } from "../src/types";

interface VercelReq {
  query?: Record<string, string | string[] | undefined>;
}

interface VercelRes {
  setHeader(k: string, v: string): void;
  status(code: number): VercelRes;
  send(body: string): VercelRes;
}

export default async function handler(req: VercelReq, res: VercelRes): Promise<VercelRes> {
  const { status, headers, body } = await handleCard((req.query as Query) || {}, process.env);
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  return res.status(status).send(body);
}
