import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { username, key, job_id, place_id } = req.body;

  if (!username || !key)
    return res.status(400).json({ error: "Missing username or key" });

  const last_seen = new Date().toISOString();

  const { error } = await supabase
    .from("active_users")
    .upsert({
      username,
      user_key: key,
      job_id: job_id || "",
      place_id: place_id || 0,
      last_seen
    });

  if (error) return res.status(500).json({ error: error.message });

  return res.json({ success: true });
}
