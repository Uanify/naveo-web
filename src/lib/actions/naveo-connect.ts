"use server";

import { createClient } from "@/lib/supabase/server";

const WEBHOOK_URL =
  "https://jzlziekwefbarbqjvsiu.supabase.co/functions/v1/webhook-receiver";

export async function sendTestWebhook(payload: unknown) {
  const supabase = await createClient();

  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };

  // Optional JWT (only if you are enforcing auth on the Edge Function)
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const message =
      data?.error || data?.message || `Webhook request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}
