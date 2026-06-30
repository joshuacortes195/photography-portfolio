// Contact form handler. Forwards a visitor's message to Web3Forms, which emails
// it to us. We proxy through this route (rather than posting to Web3Forms from
// the browser) so the access key stays server-side in WEB3FORMS_ACCESS_KEY and
// the request fits our Content-Security-Policy (connect-src 'self').

export const dynamic = "force-dynamic";

const MAX = { name: 100, email: 200, message: 5000 };

export async function POST(request: Request) {
  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) {
    return Response.json(
      { success: false, error: "Contact form is not configured yet." },
      { status: 500 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field. Pretend success so bots
  // don't learn they were caught.
  if (typeof body.botcheck === "string" && body.botcheck.trim() !== "") {
    return Response.json({ success: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    return Response.json(
      { success: false, error: "Please fill in your name, email, and message." },
      { status: 400 }
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (
    name.length > MAX.name ||
    email.length > MAX.email ||
    message.length > MAX.message
  ) {
    return Response.json(
      { success: false, error: "That message is too long." },
      { status: 400 }
    );
  }

  let res: Response;
  try {
    res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: `New message from ${name} — afterimage.thirds`,
        from_name: "afterimage.thirds website",
        name,
        email,
        message,
      }),
    });
  } catch {
    return Response.json(
      { success: false, error: "Couldn't send right now. Please try again." },
      { status: 502 }
    );
  }

  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  if (!res.ok || !data.success) {
    return Response.json(
      { success: false, error: "Couldn't send right now. Please try again." },
      { status: 502 }
    );
  }

  return Response.json({ success: true });
}
