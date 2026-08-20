import { handleIcon } from "../src/handler";

interface VercelReq {
  query?: Record<string, string | string[] | undefined>;
}

interface VercelRes {
  setHeader(k: string, v: string): void;
  status(code: number): VercelRes;
  send(body: string): VercelRes;
}

export default function handler(req: VercelReq, res: VercelRes): VercelRes {
  const { status, headers, body } = handleIcon(String(req.query?.slug || ""));
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  return res.status(status).send(body);
}
