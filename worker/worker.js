// FitForge Cloud v3 — multi-user sync API + MCP server (Cloudflare Worker)
// Login is handled by Clerk. Every user's data is stored under their own Clerk user id.
// Needs: 1) KV binding named FF   2) variable CLERK_PUBLISHABLE_KEY (pk_test_... or pk_live_...)

const EX = [{"id":"c1","name":"Push Ups","m":"Chest","t":"reps","s":3,"r":15},{"id":"c2","name":"Wide Push Ups","m":"Chest","t":"reps","s":3,"r":12},{"id":"c3","name":"Diamond Push Ups","m":"Chest","t":"reps","s":3,"r":10},{"id":"c4","name":"Incline Push Ups","m":"Chest","t":"reps","s":3,"r":15},{"id":"c5","name":"Decline Push Ups","m":"Chest","t":"reps","s":3,"r":12},{"id":"c6","name":"Archer Push Ups","m":"Chest","t":"reps","s":3,"r":8},{"id":"c7","name":"Clap Push Ups","m":"Chest","t":"reps","s":3,"r":8},{"id":"c8","name":"Chest Dips","m":"Chest","t":"reps","s":3,"r":10},{"id":"c9","name":"Chest Squeeze","m":"Chest","t":"timed","s":3,"tm":30},{"id":"c10","name":"Chest Fly (Bands)","m":"Chest","t":"reps","s":3,"r":12},{"id":"c11","name":"Hindu Push Ups","m":"Chest","t":"reps","s":3,"r":10},{"id":"b1","name":"Pull Ups","m":"Back","t":"reps","s":3,"r":8},{"id":"b2","name":"Chin Ups","m":"Back","t":"reps","s":3,"r":8},{"id":"b3","name":"Inverted Rows","m":"Back","t":"reps","s":3,"r":12},{"id":"b4","name":"Superman Hold","m":"Back","t":"timed","s":3,"tm":30},{"id":"b5","name":"Superman Reps","m":"Back","t":"reps","s":3,"r":15},{"id":"b6","name":"Back Extension","m":"Back","t":"reps","s":3,"r":15},{"id":"b7","name":"Dead Hang","m":"Back","t":"timed","s":3,"tm":30},{"id":"b8","name":"Wide Grip Pull Ups","m":"Back","t":"reps","s":3,"r":6},{"id":"b9","name":"Band Rows","m":"Back","t":"reps","s":3,"r":15},{"id":"b10","name":"Scapular Push Ups","m":"Back","t":"reps","s":3,"r":15},{"id":"b11","name":"Reverse Snow Angels","m":"Back","t":"reps","s":3,"r":12},{"id":"b12","name":"Prone Y Raise","m":"Back","t":"reps","s":3,"r":12},{"id":"l1","name":"Squats","m":"Legs","t":"reps","s":4,"r":15},{"id":"l2","name":"Jump Squats","m":"Legs","t":"reps","s":3,"r":12},{"id":"l3","name":"Sumo Squats","m":"Legs","t":"reps","s":3,"r":15},{"id":"l4","name":"Pistol Squats","m":"Legs","t":"reps","s":3,"r":5},{"id":"l5","name":"Bulgarian Split Squats","m":"Legs","t":"reps","s":3,"r":10},{"id":"l6","name":"Lunges","m":"Legs","t":"reps","s":3,"r":12},{"id":"l7","name":"Reverse Lunges","m":"Legs","t":"reps","s":3,"r":12},{"id":"l8","name":"Walking Lunges","m":"Legs","t":"reps","s":3,"r":20},{"id":"l9","name":"Side Lunges","m":"Legs","t":"reps","s":3,"r":12},{"id":"l10","name":"Wall Sit","m":"Legs","t":"timed","s":3,"tm":45},{"id":"l11","name":"Calf Raises","m":"Legs","t":"reps","s":3,"r":20},{"id":"l12","name":"Single Leg Calf Raises","m":"Legs","t":"reps","s":3,"r":15},{"id":"l13","name":"Glute Bridge","m":"Legs","t":"reps","s":3,"r":15},{"id":"l14","name":"Single Leg Glute Bridge","m":"Legs","t":"reps","s":3,"r":12},{"id":"l15","name":"Donkey Kicks","m":"Legs","t":"reps","s":3,"r":15},{"id":"l16","name":"Fire Hydrants","m":"Legs","t":"reps","s":3,"r":15},{"id":"l17","name":"Step Ups","m":"Legs","t":"reps","s":3,"r":12},{"id":"l18","name":"Box Jumps","m":"Legs","t":"reps","s":3,"r":10},{"id":"l19","name":"Squat Hold","m":"Legs","t":"timed","s":3,"tm":30},{"id":"l20","name":"Curtsy Lunges","m":"Legs","t":"reps","s":3,"r":12},{"id":"l21","name":"Frog Jumps","m":"Legs","t":"reps","s":3,"r":10},{"id":"a1","name":"Bicep Curls","m":"Arms","t":"reps","s":3,"r":12},{"id":"a2","name":"Hammer Curls","m":"Arms","t":"reps","s":3,"r":12},{"id":"a3","name":"Concentration Curls","m":"Arms","t":"reps","s":3,"r":10},{"id":"a4","name":"Tricep Dips","m":"Arms","t":"reps","s":3,"r":12},{"id":"a5","name":"Tricep Kickbacks","m":"Arms","t":"reps","s":3,"r":12},{"id":"a6","name":"Overhead Tricep Extension","m":"Arms","t":"reps","s":3,"r":12},{"id":"a7","name":"Close Grip Push Ups","m":"Arms","t":"reps","s":3,"r":12},{"id":"a8","name":"Wrist Curls","m":"Arms","t":"reps","s":3,"r":20},{"id":"a9","name":"Towel Curls","m":"Arms","t":"reps","s":3,"r":12},{"id":"a10","name":"Chin Up Hold","m":"Arms","t":"timed","s":3,"tm":15},{"id":"s1","name":"Shoulder Press","m":"Shoulders","t":"reps","s":3,"r":12},{"id":"s2","name":"Lateral Raises","m":"Shoulders","t":"reps","s":3,"r":15},{"id":"s3","name":"Front Raises","m":"Shoulders","t":"reps","s":3,"r":12},{"id":"s4","name":"Pike Push Ups","m":"Shoulders","t":"reps","s":3,"r":10},{"id":"s5","name":"Wall Handstand Hold","m":"Shoulders","t":"timed","s":3,"tm":20},{"id":"s6","name":"Face Pulls (Band)","m":"Shoulders","t":"reps","s":3,"r":15},{"id":"s7","name":"Shoulder Shrugs","m":"Shoulders","t":"reps","s":3,"r":15},{"id":"s8","name":"Arnold Press","m":"Shoulders","t":"reps","s":3,"r":10},{"id":"s9","name":"Y Raises","m":"Shoulders","t":"reps","s":3,"r":12},{"id":"s10","name":"Band Pull Aparts","m":"Shoulders","t":"reps","s":3,"r":15},{"id":"s11","name":"Reverse Fly","m":"Shoulders","t":"reps","s":3,"r":12},{"id":"co1","name":"Plank","m":"Core","t":"timed","s":3,"tm":60},{"id":"co2","name":"Side Plank","m":"Core","t":"timed","s":3,"tm":30},{"id":"co3","name":"Plank Shoulder Taps","m":"Core","t":"reps","s":3,"r":20},{"id":"co4","name":"Crunches","m":"Core","t":"reps","s":3,"r":20},{"id":"co5","name":"Bicycle Crunches","m":"Core","t":"reps","s":3,"r":20},{"id":"co6","name":"Reverse Crunches","m":"Core","t":"reps","s":3,"r":15},{"id":"co7","name":"Mountain Climbers","m":"Core","t":"timed","s":3,"tm":30},{"id":"co8","name":"Leg Raises","m":"Core","t":"reps","s":3,"r":15},{"id":"co9","name":"Hanging Leg Raises","m":"Core","t":"reps","s":3,"r":10},{"id":"co10","name":"Flutter Kicks","m":"Core","t":"timed","s":3,"tm":30},{"id":"co11","name":"Russian Twists","m":"Core","t":"reps","s":3,"r":20},{"id":"co12","name":"Dead Bug","m":"Core","t":"reps","s":3,"r":12},{"id":"co13","name":"Hollow Body Hold","m":"Core","t":"timed","s":3,"tm":30},{"id":"co14","name":"Toe Touches","m":"Core","t":"reps","s":3,"r":20},{"id":"co15","name":"V-Ups","m":"Core","t":"reps","s":3,"r":12},{"id":"co16","name":"Ab Wheel Rollout","m":"Core","t":"reps","s":3,"r":10},{"id":"co17","name":"Windshield Wipers","m":"Core","t":"reps","s":3,"r":10},{"id":"co18","name":"Plank to Push Up","m":"Core","t":"reps","s":3,"r":10},{"id":"ca1","name":"Jumping Jacks","m":"Cardio","t":"timed","s":3,"tm":60},{"id":"ca2","name":"High Knees","m":"Cardio","t":"timed","s":3,"tm":30},{"id":"ca3","name":"Butt Kicks","m":"Cardio","t":"timed","s":3,"tm":30},{"id":"ca4","name":"Jump Rope","m":"Cardio","t":"timed","s":3,"tm":60},{"id":"ca5","name":"Shadow Boxing","m":"Cardio","t":"timed","s":3,"tm":60},{"id":"ca6","name":"Skater Jumps","m":"Cardio","t":"reps","s":3,"r":20},{"id":"ca7","name":"Tuck Jumps","m":"Cardio","t":"reps","s":3,"r":10},{"id":"ca8","name":"Sprint in Place","m":"Cardio","t":"timed","s":3,"tm":20},{"id":"ca9","name":"Star Jumps","m":"Cardio","t":"reps","s":3,"r":12},{"id":"ca10","name":"Stair Climbing","m":"Cardio","t":"timed","s":3,"tm":120},{"id":"ca11","name":"Burpee Broad Jump","m":"Cardio","t":"reps","s":3,"r":8},{"id":"f1","name":"Burpees","m":"Full Body","t":"reps","s":3,"r":10},{"id":"f2","name":"Bear Crawl","m":"Full Body","t":"timed","s":3,"tm":30},{"id":"f3","name":"Inchworm","m":"Full Body","t":"reps","s":3,"r":8},{"id":"f4","name":"Turkish Get Up","m":"Full Body","t":"reps","s":3,"r":5},{"id":"f5","name":"Thruster","m":"Full Body","t":"reps","s":3,"r":12},{"id":"f6","name":"Man Maker","m":"Full Body","t":"reps","s":3,"r":6},{"id":"f7","name":"Sprawl","m":"Full Body","t":"reps","s":3,"r":10},{"id":"f8","name":"Crab Walk","m":"Full Body","t":"timed","s":3,"tm":30},{"id":"f9","name":"Devil Press","m":"Full Body","t":"reps","s":3,"r":8},{"id":"st1","name":"Neck Stretch","m":"Stretching","t":"timed","s":1,"tm":30},{"id":"st2","name":"Shoulder Stretch","m":"Stretching","t":"timed","s":1,"tm":30},{"id":"st3","name":"Chest Opener","m":"Stretching","t":"timed","s":1,"tm":30},{"id":"st4","name":"Quad Stretch","m":"Stretching","t":"timed","s":1,"tm":30},{"id":"st5","name":"Hamstring Stretch","m":"Stretching","t":"timed","s":1,"tm":30},{"id":"st6","name":"Hip Flexor Stretch","m":"Stretching","t":"timed","s":1,"tm":30},{"id":"st7","name":"Child's Pose","m":"Stretching","t":"timed","s":1,"tm":60},{"id":"st8","name":"Cat-Cow","m":"Stretching","t":"reps","s":1,"r":10},{"id":"st9","name":"Pigeon Pose","m":"Stretching","t":"timed","s":1,"tm":30},{"id":"st10","name":"Cobra Stretch","m":"Stretching","t":"timed","s":1,"tm":30},{"id":"st11","name":"World's Greatest Stretch","m":"Stretching","t":"reps","s":1,"r":6},{"id":"st12","name":"Butterfly Stretch","m":"Stretching","t":"timed","s":1,"tm":30},{"id":"st13","name":"Seated Forward Fold","m":"Stretching","t":"timed","s":1,"tm":30}];

const KEYS = ["plans", "wts", "prof", "cex"];
const MUSCLES = ["Chest", "Back", "Legs", "Arms", "Shoulders", "Core", "Cardio", "Full Body", "Stretching"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["Morning", "Evening", "Custom"];
const MAX_BODY = 2000000;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Mcp-Session-Id, Mcp-Protocol-Version",
  "Access-Control-Expose-Headers": "WWW-Authenticate",
};
const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json", ...CORS, ...extra } });

export default {
  async fetch(req, env) {
    try {
      const url = new URL(req.url);
      if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
      const path = url.pathname.replace(/\/+$/, "") || "/";
      const iss = issuerOf(env);

      if (path === "/") return status(env, iss);
      if (!iss) return json({ error: "Server not configured: CLERK_PUBLISHABLE_KEY is missing or invalid." }, 500);
      if (!env.FF) return json({ error: "Server not configured: KV binding named FF is missing." }, 500);

      if (path === "/.well-known/oauth-protected-resource" || path === "/.well-known/oauth-protected-resource/mcp") {
        return json({
          resource: url.origin + "/mcp",
          resource_name: "FitForge",
          authorization_servers: [iss],
          scopes_supported: ["profile", "email"],
          bearer_methods_supported: ["header"],
        });
      }
      if (path === "/.well-known/oauth-authorization-server") {
        const r = await fetch(iss + "/.well-known/oauth-authorization-server");
        return new Response(await r.text(), { status: r.status, headers: { "Content-Type": "application/json", ...CORS } });
      }
      if (path === "/mcp") return handleMcp(req, env, iss);
      if (path.startsWith("/api/")) return handleApi(req, env, iss, path.split("/").filter(Boolean).slice(1));
      return json({ error: "not found" }, 404);
    } catch (e) {
      return json({ error: "server error", detail: String((e && e.message) || e) }, 500);
    }
  },
};

function status(env, iss) {
  const lines = [
    "FitForge cloud v3 is running ✅",
    "Clerk key: " + (iss ? "✅ set (" + iss.replace("https://", "") + ")" : "❌ missing or wrong — add variable CLERK_PUBLISHABLE_KEY"),
    "Storage (KV named FF): " + (env.FF ? "✅ connected" : "❌ not connected — add KV binding named FF"),
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", ...CORS } });
}

/* ---------------- Clerk login checking ---------------- */

const enc = new TextEncoder();
function b64uToBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}
const b64uToJson = (s) => JSON.parse(new TextDecoder().decode(b64uToBytes(s)));

function issuerOf(env) {
  const m = String(env.CLERK_PUBLISHABLE_KEY || "").trim().match(/^pk_(?:test|live)_(.+)$/);
  if (!m) return null;
  try {
    const host = atob(m[1]).replace(/\$+$/, "");
    return /^[a-z0-9.-]+$/i.test(host) ? "https://" + host : null;
  } catch { return null; }
}

let jwksCache = { iss: null, at: 0, keys: null };
async function getJwks(iss, force) {
  if (!force && jwksCache.iss === iss && jwksCache.keys && Date.now() - jwksCache.at < 600000) return jwksCache.keys;
  const r = await fetch(iss + "/.well-known/jwks.json");
  if (!r.ok) throw new Error("jwks " + r.status);
  const j = await r.json();
  jwksCache = { iss, at: Date.now(), keys: j.keys || [] };
  return jwksCache.keys;
}

async function verifyJwt(token, iss) {
  const p = token.split(".");
  if (p.length !== 3) throw new Error("not a jwt");
  const header = b64uToJson(p[0]);
  const payload = b64uToJson(p[1]);
  if (header.alg !== "RS256") throw new Error("bad alg");
  let jwk = (await getJwks(iss)).find((k) => k.kid === header.kid);
  if (!jwk) jwk = (await getJwks(iss, true)).find((k) => k.kid === header.kid);
  if (!jwk) throw new Error("unknown key");
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64uToBytes(p[2]), enc.encode(p[0] + "." + p[1]));
  if (!ok) throw new Error("bad signature");
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === "number" && payload.exp < now - 5) throw new Error("expired");
  if (typeof payload.nbf === "number" && payload.nbf > now + 5) throw new Error("not yet valid");
  if (String(payload.iss || "").replace(/\/+$/, "") !== iss) throw new Error("wrong issuer");
  if (!payload.sub) throw new Error("no user");
  return payload;
}

const bearer = (req) => {
  const h = req.headers.get("Authorization") || "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
};

// The app's own login token (Clerk session token). Used for the sync API.
async function authSession(req, iss) {
  const t = bearer(req);
  if (!t) throw new Error("no token");
  const p = await verifyJwt(t, iss);
  if (!p.sid) throw new Error("not a session token");
  return p.sub;
}

// A token an AI app got after the user approved it (Clerk OAuth). Also accepts a session token.
async function authAny(req, iss) {
  const t = bearer(req);
  if (!t) throw new Error("no token");
  if (t.split(".").length === 3) {
    try { return (await verifyJwt(t, iss)).sub; } catch { /* fall through to userinfo */ }
  }
  const r = await fetch(iss + "/oauth/userinfo", { headers: { Authorization: "Bearer " + t } });
  if (!r.ok) throw new Error("userinfo " + r.status);
  const j = await r.json();
  const sub = j.sub || j.user_id;
  if (!sub) throw new Error("no user");
  return sub;
}

/* ---------------- per-user storage ---------------- */

async function loadAll({ env, uid }) {
  const d = { plans: [], wts: [], prof: { name: "User", height: 170, weight: 70, age: 25 }, cex: [] };
  for (const k of KEYS) {
    const r = await env.FF.get(`d:${uid}:${k}`, "json");
    if (r && r.v !== undefined) d[k] = r.v;
  }
  return d;
}
async function saveKeys({ env, uid }, d, keys) {
  const u = Date.now();
  for (const k of keys) await env.FF.put(`d:${uid}:${k}`, JSON.stringify({ v: d[k], u }));
}
async function aiEnabled({ env, uid }) {
  const r = await env.FF.get(`ai:${uid}`, "json");
  return !!(r && r.enabled);
}

/* ---------------- app sync API (needs the user's login token) ---------------- */

async function handleApi(req, env, iss, rest) {
  let uid;
  try { uid = await authSession(req, iss); } catch { return json({ error: "unauthorized" }, 401); }

  if (rest[0] === "data") {
    if (req.method === "GET" && rest.length === 1) {
      const out = {};
      for (const k of KEYS) out[k] = await env.FF.get(`d:${uid}:${k}`, "json");
      return json(out);
    }
    if (req.method === "PUT" && rest.length === 2 && KEYS.includes(rest[1])) {
      const text = await req.text();
      if (text.length > MAX_BODY) return json({ error: "too large" }, 413);
      let body;
      try { body = JSON.parse(text); } catch { return json({ error: "bad json" }, 400); }
      if (body.v === undefined || typeof body.u !== "number") return json({ error: "need v and u" }, 400);
      const cur = await env.FF.get(`d:${uid}:${rest[1]}`, "json");
      if (cur && cur.u > body.u) return json({ ok: false, stale: true, current: cur });
      await env.FF.put(`d:${uid}:${rest[1]}`, JSON.stringify({ v: body.v, u: body.u }));
      return json({ ok: true });
    }
    if (req.method === "DELETE" && rest.length === 1) {
      for (const k of KEYS) await env.FF.delete(`d:${uid}:${k}`);
      return json({ ok: true });
    }
  }
  if (rest[0] === "ai" && rest.length === 1) {
    if (req.method === "GET") return json({ enabled: await aiEnabled({ env, uid }) });
    if (req.method === "PUT") {
      let body;
      try { body = await req.json(); } catch { return json({ error: "bad json" }, 400); }
      const enabled = body.enabled === true;
      await env.FF.put(`ai:${uid}`, JSON.stringify({ enabled, u: Date.now() }));
      return json({ enabled });
    }
  }
  return json({ error: "not found" }, 404);
}

/* ---------------- MCP server (Streamable HTTP, JSON replies) ---------------- */

const SUPPORTED = ["2025-06-18", "2025-03-26", "2024-11-05"];

function unauth(req, msg) {
  const origin = new URL(req.url).origin;
  return json(
    { jsonrpc: "2.0", id: null, error: { code: -32001, message: msg } },
    401,
    { "WWW-Authenticate": `Bearer resource_metadata="${origin}/.well-known/oauth-protected-resource/mcp"` }
  );
}

async function handleMcp(req, env, iss) {
  if (req.method === "GET") return new Response("POST only", { status: 405, headers: { Allow: "POST", ...CORS } });
  if (req.method === "DELETE") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: CORS });

  let uid;
  try { uid = await authAny(req, iss); } catch { return unauth(req, "Sign in required. Approve this app with your FitForge account."); }
  const ctx = { env, uid };

  let body;
  try { body = await req.json(); }
  catch { return json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, 400); }
  const batch = Array.isArray(body) ? body : [body];
  const out = [];
  for (const m of batch) {
    const r = await rpc(m, ctx);
    if (r) out.push(r);
  }
  if (out.length === 0) return new Response(null, { status: 202, headers: CORS });
  return json(Array.isArray(body) ? out : out[0]);
}

async function rpc(m, ctx) {
  if (!m || m.jsonrpc !== "2.0" || typeof m.method !== "string") {
    return { jsonrpc: "2.0", id: m && m.id !== undefined ? m.id : null, error: { code: -32600, message: "Invalid request" } };
  }
  if (m.id === undefined || m.id === null) return null; // notification
  const ok = (result) => ({ jsonrpc: "2.0", id: m.id, result });
  const err = (code, message) => ({ jsonrpc: "2.0", id: m.id, error: { code, message } });

  switch (m.method) {
    case "initialize": {
      const want = m.params && m.params.protocolVersion;
      return ok({
        protocolVersion: SUPPORTED.includes(want) ? want : SUPPORTED[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "fitforge", version: "3.0.0" },
        instructions:
          "FitForge workout app (this is the signed-in user's own private data). Start with get_overview. Plans reference exercises by name or id; use search_exercises first if unsure. Changes show up in the app next time it is opened or synced.",
      });
    }
    case "ping":
      return ok({});
    case "tools/list":
      return ok({ tools: TOOLS });
    case "tools/call": {
      const name = m.params && m.params.name;
      const args = (m.params && m.params.arguments) || {};
      const tool = HANDLERS[name];
      if (!tool) return err(-32602, "Unknown tool: " + name);
      if (!(await aiEnabled(ctx))) {
        return ok({
          isError: true,
          content: [{ type: "text", text: "AI access is turned OFF for this FitForge account. Ask the user to open FitForge → Profile → Account & AI and turn AI access ON, then try again." }],
        });
      }
      try {
        const result = await tool(args, ctx);
        return ok({ content: [{ type: "text", text: JSON.stringify(result, null, 2) }] });
      } catch (e) {
        return ok({ isError: true, content: [{ type: "text", text: String((e && e.message) || e) }] });
      }
    }
    default:
      return err(-32601, "Method not found: " + m.method);
  }
}

/* ---------------- helpers ---------------- */

const norm = (s) => String(s || "").trim().toLowerCase();
const allEx = (d) => [...EX, ...d.cex];

function findEx(d, ref) {
  const list = allEx(d);
  const r = norm(ref);
  if (!r) return null;
  const byId = list.find((e) => norm(e.id) === r);
  if (byId) return byId;
  const exact = list.find((e) => norm(e.name) === r);
  if (exact) return exact;
  const part = list.filter((e) => norm(e.name).includes(r));
  if (part.length === 1) return part[0];
  if (part.length > 1) {
    throw new Error(`"${ref}" matches several exercises (${part.slice(0, 6).map((e) => e.name).join(", ")}). Use the exact name or id.`);
  }
  return null;
}

function normDay(x) {
  const s = norm(x).slice(0, 3);
  const d = DAYS.find((v) => v.toLowerCase() === s);
  if (!d) throw new Error(`Invalid day "${x}". Use Mon, Tue, Wed, Thu, Fri, Sat, Sun.`);
  return d;
}

function findPlan(d, ref) {
  const r = norm(ref);
  if (!r) throw new Error("Plan name or id required.");
  const p = d.plans.find((x) => norm(x.id) === r) || d.plans.find((x) => norm(x.name) === r);
  if (p) return p;
  const part = d.plans.filter((x) => norm(x.name).includes(r));
  if (part.length === 1) return part[0];
  if (part.length > 1) throw new Error(`"${ref}" matches several plans: ${part.map((x) => x.name).join(", ")}.`);
  throw new Error(`Plan "${ref}" not found. Existing plans: ${d.plans.map((x) => x.name).join(", ") || "none"}.`);
}

function makeEntry(d, spec) {
  const s = typeof spec === "string" ? { exercise: spec } : spec || {};
  const ex = findEx(d, s.exercise);
  if (!ex) throw new Error(`Exercise "${s.exercise}" not found. Use search_exercises, or add_custom_exercise to create it.`);
  const entry = { eid: ex.id, sets: num(s.sets, ex.s), youtubeLink: s.youtube_link || "", notes: s.notes || "" };
  if (ex.t === "timed") entry.time = num(s.time_seconds, ex.tm);
  else entry.reps = num(s.reps, ex.r);
  return entry;
}
function num(v, dflt) {
  const n = Number(v);
  return v !== undefined && v !== null && v !== "" && Number.isFinite(n) && n > 0 ? n : dflt;
}

function describePlan(d, p) {
  return {
    id: p.id,
    name: p.name,
    slot: p.slot,
    days: p.days,
    exercises: p.exercises.map((e) => {
      const ex = allEx(d).find((x) => x.id === e.eid);
      return {
        exercise: ex ? ex.name : `(missing: ${e.eid})`,
        muscle: ex ? ex.m : undefined,
        sets: e.sets,
        reps: e.reps,
        time_seconds: e.time,
        notes: e.notes || undefined,
        youtube_link: e.youtubeLink || undefined,
      };
    }),
  };
}

function bmiOf(prof) {
  if (!(prof.height > 0)) return null;
  const v = prof.weight / (prof.height / 100) ** 2;
  const cat = v < 18.5 ? "Underweight" : v < 25 ? "Normal" : v < 30 ? "Overweight" : "Obese";
  return { bmi: Number(v.toFixed(1)), category: cat };
}

/* ---------------- tool definitions ---------------- */

const RO = { readOnlyHint: true, openWorldHint: false };
const WR = { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false };
const DEL = { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false };

const exerciseSpec = {
  type: "object",
  properties: {
    exercise: { type: "string", description: "Exercise name or id (built-in or custom)" },
    sets: { type: "number" },
    reps: { type: "number", description: "For rep-based exercises" },
    time_seconds: { type: "number", description: "For timed exercises" },
    notes: { type: "string" },
    youtube_link: { type: "string" },
  },
  required: ["exercise"],
};

const TOOLS = [
  { name: "get_overview", title: "Get overview", description: "Profile, BMI, latest weight, and the weekly schedule (which plans fall on which day). Call this first.", inputSchema: { type: "object", properties: {} }, annotations: RO },
  { name: "list_workout_plans", title: "List workout plans", description: "All workout plans with full exercise details.", inputSchema: { type: "object", properties: {} }, annotations: RO },
  { name: "create_workout_plan", title: "Create workout plan", description: "Create a plan. Needs a name, at least one day and at least one exercise.", inputSchema: { type: "object", properties: { name: { type: "string" }, slot: { type: "string", enum: SLOTS, description: "Default Morning" }, days: { type: "array", items: { type: "string" }, description: "e.g. [\"Mon\",\"Wed\",\"Fri\"]" }, exercises: { type: "array", items: exerciseSpec } }, required: ["name", "days", "exercises"] }, annotations: WR },
  { name: "update_workout_plan", title: "Update workout plan", description: "Edit a plan found by name or id. Can rename, change slot/days, replace the exercise list, add exercises, or remove exercises by name.", inputSchema: { type: "object", properties: { plan: { type: "string", description: "Plan name or id" }, new_name: { type: "string" }, slot: { type: "string", enum: SLOTS }, days: { type: "array", items: { type: "string" } }, set_exercises: { type: "array", items: exerciseSpec, description: "Replaces the whole list" }, add_exercises: { type: "array", items: exerciseSpec }, remove_exercises: { type: "array", items: { type: "string" } } }, required: ["plan"] }, annotations: WR },
  { name: "delete_workout_plan", title: "Delete workout plan", description: "Permanently delete a plan.", inputSchema: { type: "object", properties: { plan: { type: "string" } }, required: ["plan"] }, annotations: DEL },
  { name: "search_exercises", title: "Search exercises", description: "Search the exercise library (116 built-in + custom).", inputSchema: { type: "object", properties: { query: { type: "string" }, muscle: { type: "string", enum: MUSCLES }, limit: { type: "number", description: "Default 20" } } }, annotations: RO },
  { name: "add_custom_exercise", title: "Add custom exercise", description: "Create a custom exercise in the library.", inputSchema: { type: "object", properties: { name: { type: "string" }, muscle: { type: "string", enum: MUSCLES }, type: { type: "string", enum: ["reps", "timed"] }, sets: { type: "number" }, reps: { type: "number" }, time_seconds: { type: "number" }, description: { type: "string" }, youtube_link: { type: "string" }, icon: { type: "string", description: "One emoji" } }, required: ["name", "muscle"] }, annotations: WR },
  { name: "delete_custom_exercise", title: "Delete custom exercise", description: "Delete a custom exercise. Refuses if a plan still uses it.", inputSchema: { type: "object", properties: { exercise: { type: "string" } }, required: ["exercise"] }, annotations: DEL },
  { name: "get_weight_history", title: "Get weight history", description: "Weight log entries, newest first.", inputSchema: { type: "object", properties: { limit: { type: "number", description: "Default 30" } } }, annotations: RO },
  { name: "log_weight", title: "Log weight", description: "Add a weight entry in kg (20–300). Date optional, defaults to now.", inputSchema: { type: "object", properties: { weight_kg: { type: "number" }, date: { type: "string", description: "ISO date, e.g. 2026-11-03" } }, required: ["weight_kg"] }, annotations: WR },
  { name: "delete_weight_entry", title: "Delete weight entry", description: "Delete one weight entry by its exact date value from get_weight_history.", inputSchema: { type: "object", properties: { date: { type: "string" } }, required: ["date"] }, annotations: DEL },
  { name: "update_profile", title: "Update profile", description: "Change name, height (cm), weight (kg) or age.", inputSchema: { type: "object", properties: { name: { type: "string" }, height_cm: { type: "number" }, weight_kg: { type: "number" }, age: { type: "number" } } }, annotations: WR },
];

/* ---------------- tool handlers ---------------- */

const HANDLERS = {
  async get_overview(_a, ctx) {
    const d = await loadAll(ctx);
    const sched = {};
    for (const day of DAYS) sched[day] = d.plans.filter((p) => p.days.includes(day)).map((p) => `${p.name} (${p.slot})`);
    const w = [...d.wts].sort((a, b) => new Date(a.date) - new Date(b.date));
    return {
      profile: { name: d.prof.name, height_cm: d.prof.height, weight_kg: d.prof.weight, age: d.prof.age, ...bmiOf(d.prof) },
      counts: { plans: d.plans.length, custom_exercises: d.cex.length, weight_logs: d.wts.length },
      latest_weight: w.length ? w[w.length - 1] : null,
      first_weight: w.length ? w[0] : null,
      weekly_schedule: sched,
    };
  },

  async list_workout_plans(_a, ctx) {
    const d = await loadAll(ctx);
    return { plans: d.plans.map((p) => describePlan(d, p)) };
  },

  async create_workout_plan(a, ctx) {
    const d = await loadAll(ctx);
    const name = String(a.name || "").trim();
    if (!name) throw new Error("Plan name required.");
    if (!Array.isArray(a.days) || a.days.length === 0) throw new Error("At least one day required.");
    if (!Array.isArray(a.exercises) || a.exercises.length === 0) throw new Error("At least one exercise required.");
    const slot = a.slot ? SLOTS.find((s) => norm(s) === norm(a.slot)) : "Morning";
    if (!slot) throw new Error("slot must be Morning, Evening or Custom.");
    const days = [...new Set(a.days.map(normDay))];
    const exercises = [];
    for (const spec of a.exercises) {
      const entry = makeEntry(d, spec);
      if (!exercises.find((e) => e.eid === entry.eid)) exercises.push(entry);
    }
    let id = Date.now().toString();
    while (d.plans.find((p) => p.id === id)) id = String(Number(id) + 1);
    const plan = { id, name, slot, days, exercises, ca: new Date().toISOString() };
    d.plans.push(plan);
    await saveKeys(ctx, d, ["plans"]);
    return { created: describePlan(d, plan) };
  },

  async update_workout_plan(a, ctx) {
    const d = await loadAll(ctx);
    const p = findPlan(d, a.plan);
    if (a.new_name !== undefined) {
      if (!String(a.new_name).trim()) throw new Error("new_name cannot be empty.");
      p.name = String(a.new_name).trim();
    }
    if (a.slot !== undefined) {
      const s = SLOTS.find((x) => norm(x) === norm(a.slot));
      if (!s) throw new Error("slot must be Morning, Evening or Custom.");
      p.slot = s;
    }
    if (a.days !== undefined) {
      if (!Array.isArray(a.days) || a.days.length === 0) throw new Error("days cannot be empty.");
      p.days = [...new Set(a.days.map(normDay))];
    }
    if (a.set_exercises !== undefined) {
      if (!Array.isArray(a.set_exercises) || a.set_exercises.length === 0) throw new Error("set_exercises cannot be empty.");
      const list = [];
      for (const spec of a.set_exercises) {
        const e = makeEntry(d, spec);
        if (!list.find((x) => x.eid === e.eid)) list.push(e);
      }
      p.exercises = list;
    }
    for (const ref of a.remove_exercises || []) {
      const ex = findEx(d, ref);
      if (!ex) throw new Error(`Exercise "${ref}" not found.`);
      p.exercises = p.exercises.filter((e) => e.eid !== ex.id);
    }
    for (const spec of a.add_exercises || []) {
      const e = makeEntry(d, spec);
      if (!p.exercises.find((x) => x.eid === e.eid)) p.exercises.push(e);
    }
    if (p.exercises.length === 0) throw new Error("A plan needs at least one exercise. Delete the plan instead.");
    await saveKeys(ctx, d, ["plans"]);
    return { updated: describePlan(d, p) };
  },

  async delete_workout_plan(a, ctx) {
    const d = await loadAll(ctx);
    const p = findPlan(d, a.plan);
    d.plans = d.plans.filter((x) => x.id !== p.id);
    await saveKeys(ctx, d, ["plans"]);
    return { deleted: p.name };
  },

  async search_exercises(a, ctx) {
    const d = await loadAll(ctx);
    const q = norm(a.query);
    let list = allEx(d);
    if (a.muscle) list = list.filter((e) => e.m === a.muscle);
    if (q) list = list.filter((e) => norm(e.name).includes(q) || norm(e.m).includes(q));
    const limit = num(a.limit, 20);
    return {
      total: list.length,
      exercises: list.slice(0, limit).map((e) => ({ id: e.id, name: e.name, muscle: e.m, type: e.t, default_sets: e.s, default_reps: e.r, default_time_seconds: e.tm, custom: !!e.custom })),
    };
  },

  async add_custom_exercise(a, ctx) {
    const d = await loadAll(ctx);
    const name = String(a.name || "").trim();
    if (!name) throw new Error("name required.");
    if (!MUSCLES.includes(a.muscle)) throw new Error("muscle must be one of: " + MUSCLES.join(", "));
    if (allEx(d).find((e) => norm(e.name) === norm(name))) throw new Error(`An exercise named "${name}" already exists.`);
    const type = a.type === "timed" ? "timed" : "reps";
    let id = "cx_" + Date.now();
    while (d.cex.find((e) => e.id === id)) id += "x";
    const ex = { id, name, m: a.muscle, t: type, ic: a.icon || "⭐", s: num(a.sets, 3), r: num(a.reps, 12), tm: num(a.time_seconds, 30), desc: String(a.description || "").trim(), youtubeLink: a.youtube_link || "", custom: true };
    d.cex.push(ex);
    await saveKeys(ctx, d, ["cex"]);
    return { created: { id: ex.id, name: ex.name, muscle: ex.m, type: ex.t } };
  },

  async delete_custom_exercise(a, ctx) {
    const d = await loadAll(ctx);
    const ex = d.cex.find((e) => norm(e.id) === norm(a.exercise) || norm(e.name) === norm(a.exercise));
    if (!ex) throw new Error(`Custom exercise "${a.exercise}" not found (built-in exercises cannot be deleted).`);
    const used = d.plans.filter((p) => p.exercises.some((e) => e.eid === ex.id)).map((p) => p.name);
    if (used.length) throw new Error(`"${ex.name}" is used in: ${used.join(", ")}. Remove it from those plans first.`);
    d.cex = d.cex.filter((e) => e.id !== ex.id);
    await saveKeys(ctx, d, ["cex"]);
    return { deleted: ex.name };
  },

  async get_weight_history(a, ctx) {
    const d = await loadAll(ctx);
    const list = [...d.wts].sort((x, y) => new Date(y.date) - new Date(x.date));
    return { total: list.length, entries: list.slice(0, num(a.limit, 30)) };
  },

  async log_weight(a, ctx) {
    const d = await loadAll(ctx);
    const v = Number(a.weight_kg);
    if (!Number.isFinite(v) || v < 20 || v > 300) throw new Error("weight_kg must be between 20 and 300.");
    let date = new Date().toISOString();
    if (a.date) {
      const t = Date.parse(a.date);
      if (Number.isNaN(t)) throw new Error("date is not a valid date.");
      date = new Date(t).toISOString();
    }
    d.wts.push({ value: v, date });
    await saveKeys(ctx, d, ["wts"]);
    return { logged: { value: v, date }, total_entries: d.wts.length };
  },

  async delete_weight_entry(a, ctx) {
    const d = await loadAll(ctx);
    const i = d.wts.findIndex((w) => w.date === a.date);
    if (i < 0) throw new Error("No entry with that exact date. Copy it from get_weight_history.");
    const [gone] = d.wts.splice(i, 1);
    await saveKeys(ctx, d, ["wts"]);
    return { deleted: gone };
  },

  async update_profile(a, ctx) {
    const d = await loadAll(ctx);
    if (a.name !== undefined) d.prof.name = String(a.name).trim() || "User";
    if (a.height_cm !== undefined) {
      const h = Number(a.height_cm);
      if (!(h >= 50 && h <= 250)) throw new Error("height_cm must be 50–250.");
      d.prof.height = h;
    }
    if (a.weight_kg !== undefined) {
      const w = Number(a.weight_kg);
      if (!(w >= 20 && w <= 300)) throw new Error("weight_kg must be 20–300.");
      d.prof.weight = w;
    }
    if (a.age !== undefined) {
      const g = parseInt(a.age, 10);
      if (!(g > 0 && g < 120)) throw new Error("age looks invalid.");
      d.prof.age = g;
    }
    await saveKeys(ctx, d, ["prof"]);
    return { profile: { ...d.prof, ...bmiOf(d.prof) } };
  },
};
