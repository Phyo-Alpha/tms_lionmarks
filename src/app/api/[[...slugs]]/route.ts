import server from "@/server";

export const GET = server.handle;
export const POST = server.handle;
export const PUT = server.handle;
export const DELETE = server.handle;
export const PATCH = server.handle;
export const OPTIONS = server.handle;
export type App = typeof server;
