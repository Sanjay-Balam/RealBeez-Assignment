import { Elysia } from "elysia";
import { getAllJobs, deleteJob } from "../controllers/jobController";

export const jobRoutes = new Elysia({ prefix: "/jobs" })
  .get("/", async () => {
    return getAllJobs();
  })
  .delete("/:id", async ({ params: { id } }) => {
    return deleteJob(id);
  });
