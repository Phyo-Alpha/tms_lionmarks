import { db } from "@/server/db";
import Elysia from "elysia";

export type Database = typeof db;

export const api = new Elysia({ detail: { tags: ["Elysia API"] } });

export type App = typeof api;
