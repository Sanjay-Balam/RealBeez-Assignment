import { atom } from "jotai";
import type { Job } from "./types";

export const jobsAtom = atom<Job[]>([]);
export const jobsLoadedAtom = atom(false);
