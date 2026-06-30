"use client";

import { useEffect, useRef, useState } from "react";
import { MailIcon, InstagramIcon } from "@/components/Icons";
import { SITE } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

// Web3Forms' free plan only accepts submissions from the browser, so we post
// directly to their endpoint. The access key is public by design.
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [botcheck, setBotcheck] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  // "Email copied" toast.
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(SITE.email);
    } catch {
      // Fallback for browsers without the async clipboard API.
      const ta = document.createElement("textarea");
      ta.value = SITE.email;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* give up silently */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2200);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Honeypot: a filled hidden field means a bot — pretend it worked.
    if (botcheck.trim() !== "") {
      setStatus("sent");
      return;
    }
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      setError("Please fill in your name, email, and message.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setStatus("error");
      setError("Please enter a valid email address.");
      return;
    }
    if (!ACCESS_KEY) {
      setStatus("error");
      setError("The contact form isn't configured yet. Please email us instead.");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `New message from ${name} — afterimage.thirds`,
          from_name: "afterimage.thirds website",
          name,
          email,
          message,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
      };
      if (data.success) {
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Couldn't send right now. Please try again.");
    }
  }

  const fieldClass =
    "mt-2 w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-white/35 focus:outline-2 focus:outline-offset-2 focus:outline-accent";

  if (status === "sent") {
    return (
      <div className="mt-8 max-w-xl rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <p className="text-lg font-medium">Thanks for reaching out!</p>
        <p className="mt-2 text-sm text-muted">
          Your message is on its way — we&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 text-sm font-medium text-foreground transition-colors hover:border-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <form onSubmit={onSubmit} className="max-w-xl space-y-5" noValidate>
        {/* Honeypot — hidden from real users, catches bots. */}
        <input
          type="text"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={botcheck}
          onChange={(e) => setBotcheck(e.target.value)}
          className="hidden"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name" className="text-sm font-medium">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              required
              maxLength={200}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className="text-sm font-medium">
            Message
          </label>
          <textarea
            id="contact-message"
            required
            maxLength={5000}
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you have in mind…"
            className={`${fieldClass} resize-y`}
          />
        </div>

        {status === "error" && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send message"}
          </button>

          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-6 text-sm font-medium text-foreground transition-colors hover:border-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <MailIcon className="size-4" />
            Copy email
          </button>
        </div>
      </form>

      <p className="mt-6 text-sm text-muted">
        Or message us on{" "}
        <a
          href={SITE.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-medium text-foreground underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <InstagramIcon className="size-3.5" />
          Instagram
        </a>
        !
      </p>

      {/* Copied toast */}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 bottom-6 z-[200] flex justify-center transition-all duration-300 ${
          copied ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <span className="rounded-full border border-white/15 bg-background/95 px-5 py-2.5 text-sm font-medium text-foreground shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur">
          Email copied to clipboard
        </span>
      </div>
    </div>
  );
}
