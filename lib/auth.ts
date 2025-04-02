"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/payload-types";
import { getPayload } from "payload";
import config from "@payload-config";

type Token = {
  id: number;
  collection: string;
  email: string;
  iat: number;
  exp: number;
};

export async function getCurrentUser(): Promise<null | User> {
  const cook = await cookies();
  const token = cook.get("payload-token");

  if (!token?.value) return null;

  const res = jwt.decode(token?.value) as Token;

  if (!res || !res.id) return null;

  const payload = await getPayload({ config });

  const user = await payload.findByID({
    collection: "users",
    id: res.id,
  });

  return user;
}
