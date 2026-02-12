import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import Database from "./config/db";
import { jobRoutes } from "./routes/jobRoutes";
import { createJobRoute } from "./routes/createJobRoute";

const port = process.env.PORT || 3001;

await Database.connect();

new Elysia()
  .use(cors())
  .use(jobRoutes)
  .use(createJobRoute)
  .listen(port);

console.log(`Backend running at http://localhost:${port}`);
