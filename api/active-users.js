import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  const adminKey = req.query.admin_key;

  if (adminKey !== process.env.ADMIN_KEY)
    return res.status(403).json({ error: "Invalid admin key" });

  const { data, error } = await supabase
    .from("active_users")
    .select("*");

  if (error) return res.status(500).json({ error: error.message });

  return res.json(
    data.map(u => ({
      username: u.username,
      key: u.user_key,
      job_id: u.job_id,
      place_id: u.place_id,
      last_seen: u.last_seen
    }))
  );
}
