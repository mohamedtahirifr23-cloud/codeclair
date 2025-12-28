import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const code = (body?.code ?? "").toString().trim();
    const email = (body?.email ?? "").toString().trim();
    const note = (body?.note ?? "").toString().trim();

    if (!code || code.length < 2) {
      return NextResponse.json({ ok: false, error: "CODE_REQUIRED" }, { status: 400 });
    }

    const row = {
      ts: new Date().toISOString(),
      code,
      email: email || null,
      note: note || null
    };

    // Salva in JSON Lines (una riga JSON per richiesta)
    const filePath = path.join(process.cwd(), "data", "missing_requests.jsonl");
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.appendFileSync(filePath, JSON.stringify(row) + "\n", { encoding: "utf-8" });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "SERVER_ERROR" }, { status: 500 });
  }
}
