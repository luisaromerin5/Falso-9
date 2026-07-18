import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

// Auto-sync: syncs today's and yesterday's matches if not done in last 15 minutes
export async function GET(request: Request) {
  // Allow cron-job.org and internal calls
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (token && token !== "f9sync2026") return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) return NextResponse.json({ skipped: true, reason: "no API key" });

  try {
    const db = getDb();

    // Create settings table if needed
    db.exec(`CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT)`);

    // Check if we synced recently (within 15 minutes)
    const lastSync = db.prepare(`
      SELECT value FROM app_settings WHERE key = 'last_auto_sync'
    `).get() as { value: string } | undefined;

    const now = Date.now();
    if (lastSync && (now - Number(lastSync.value)) < 15 * 60 * 1000) {
      return NextResponse.json({ skipped: true, reason: "synced recently" });
    }

    // Sync today and yesterday
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const { syncMatchesByDate } = await import("@/lib/football-api");
    const r1 = await syncMatchesByDate(today);
    const r2 = await syncMatchesByDate(yesterday);

    // Save last sync time
    db.prepare(`INSERT OR REPLACE INTO app_settings (key, value) VALUES ('last_auto_sync', ?)`).run(String(now));

    return NextResponse.json({
      success: true,
      today: r1.synced,
      yesterday: r2.synced,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "sync failed" }, { status: 500 });
  }
}
