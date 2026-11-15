// PreToolUse guard: stops Claude from sending email to the wrong people.
// Reads the tool call as JSON on stdin. Exit 0 = allow, exit 2 = block
// (the reason printed to stderr is shown to Claude).

const MY_EMAIL = (process.env.MY_EMAIL || "").trim().toLowerCase();

// Resend tools that can reach whole lists, or people we can't check.
const RESEND_ALWAYS_BLOCK = new Set([
  "send-broadcast",
  "create-automation",
  "send-inbox-draft",
  "send-new-inbox-email",
  // Also send real email, but were not in the original list:
  "reply-to-inbox-thread-email",
  "forward-inbox-thread-email",
  "send-event", // fires automations, which send email
]);

// Gmail connector tools that send. Drafts and reading stay allowed.
const GMAIL_ALWAYS_BLOCK = new Set(["send_message", "reply", "forward"]);

function block(reason) {
  process.stderr.write(`Blocked by send-guard: ${reason}\n`);
  process.exit(2);
}

function toList(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

// Accepts "a@b.com" or "Name <a@b.com>".
function bareAddress(addr) {
  const s = String(addr).trim();
  const m = s.match(/<([^>]+)>/);
  return (m ? m[1] : s).trim().toLowerCase();
}

function isAllowed(addr) {
  const a = bareAddress(addr);
  if (a.endsWith("@resend.dev")) return true;
  return MY_EMAIL !== "" && a === MY_EMAIL;
}

function checkRecipients(email) {
  for (const field of ["to", "cc", "bcc"]) {
    for (const addr of toList(email?.[field])) {
      if (!isAllowed(addr)) {
        block(
          `"${addr}" (in ${field}) is not a @resend.dev test address or your own email. ` +
            `Only those may receive email.`
        );
      }
    }
  }
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  let call;
  try {
    call = JSON.parse(raw);
  } catch {
    block("could not read the tool call, so it was blocked to be safe.");
  }

  const toolName = String(call.tool_name || "");
  const input = call.tool_input || {};

  const resend = toolName.match(/^mcp__resend__(.+)$/);
  if (resend) {
    const name = resend[1];
    if (name === "send-email") {
      checkRecipients(input);
    } else if (name === "send-batch-emails") {
      for (const email of toList(input.emails)) checkRecipients(email);
    } else if (RESEND_ALWAYS_BLOCK.has(name)) {
      block(`Resend "${name}" can reach people we can't check, so it is never allowed.`);
    }
    process.exit(0);
  }

  const gmail = toolName.match(/^mcp__claude_ai_Gmail__(.+)$/);
  if (gmail && GMAIL_ALWAYS_BLOCK.has(gmail[1])) {
    block(`Gmail "${gmail[1]}" sends real email, so it is never allowed. Make a draft instead.`);
  }

  process.exit(0);
});
