import { buildServer } from "./vercel.main";

let server: any;

export default async function handler(req: any, res: any) {
  if (!server) {
    server = await buildServer();
    await server.ready();
  }

  server.server.emit("request", req, res);
}
