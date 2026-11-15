# My Email Studio

An AI-assisted email marketing studio built with [Claude Code](https://claude.com/claude-code) during **Email Studio Lab**.

It plans and drafts a four-email launch campaign for **Kettlebird Tea**, a made-up online tea shop launching the Steep Club, a monthly tea subscription box. Claude Code does the drafting and checking. The rules, brand voice and safety guards in this repo keep its work on-brand and stop it from emailing real people.

> **All of this is practice data.** Kettlebird Tea, its leads and its customer reviews are made up. Every lead uses an `@example.com` address, which can never receive mail. No email in this repo has been sent to a real person.

## Main features

| Feature | Where | What it does |
|---|---|---|
| Brand voice import | `CLAUDE.md`, `brand/voice.md` | `CLAUDE.md` pulls in the voice guide with `@brand/voice.md`, so every session knows the tone, banned words, banned health claims and the sign-off. |
| Folder and path rules | `leads/CLAUDE.md`, `.claude/rules/emails.md` | Rules that load only when Claude works in that folder or on matching files. The email rules cover subject and preview length, the greeting, the one link, the sign-off and the footer. |
| Personalize skill | `.claude/skills/personalize/` | `/personalize` writes one copy of each campaign email for every lead group (tea-curious, gift-buyers, daily-drinkers). |
| Resend MCP in practice mode | `.mcp.json` | Connects the Resend email tools, but by default points at a local test server with a practice key. |
| PreToolUse send guard | `.claude/settings.json`, `.claude/hooks/send-guard.mjs` | A hook that runs before every Resend tool and before Gmail send, reply and forward. It blocks any send that isn't to an `@resend.dev` test address or my own address. |
| Headless JSON review | `scripts/review.mjs`, `review/findings.schema.json` | Runs Claude Code without a chat window. It reviews a campaign against the voice guide and email rules, saves the findings as JSON and exits with an error if any finding is high severity. |
| CI review | `.github/workflows/review.yml` | Runs the headless review on every pull request to `master`. |
| studio-kit plugin | separate repo | The skill, a read-only email-reviewer subagent, the send guard and the review script, packaged as a reusable Claude Code plugin so they can be installed in any client's repo. |

## Folder layout

```
my-email-studio/
├── CLAUDE.md                 Project instructions and rules for Claude
├── brand/voice.md            Kettlebird Tea brand voice guide
├── leads/
│   ├── CLAUDE.md             Rules for lead data (made-up people only)
│   └── leads.csv             Practice leads, all @example.com
├── campaigns/
│   ├── steep-club-launch/
│   │   ├── plan.md           Campaign plan
│   │   ├── emails/           The four main emails
│   │   └── groups/           One copy of each email per lead group
│   └── test-bad/             An email that breaks the rules on purpose, to test the review
├── notes/                    Research, decisions and the review analysis
│   ├── reviews/              Made-up customer reviews
│   └── scratchpad.md         Findings written down during long analysis jobs
├── review/                   Review findings and their JSON schema
├── scripts/review.mjs        Headless review script
├── .claude/
│   ├── rules/emails.md       Email format rules
│   ├── skills/personalize/   Personalize skill
│   ├── hooks/send-guard.mjs  Send guard
│   └── settings.json         Hook and plugin settings
├── .github/workflows/        CI review on pull requests
└── .mcp.json                 Resend MCP server (practice mode)
```

## Running the review

```
node scripts/review.mjs campaigns/steep-club-launch
```

This needs Claude Code installed and signed in. `campaigns/test-bad` fails on purpose, so CI never reviews it.

To run the review in GitHub Actions, add an `ANTHROPIC_API_KEY` repository secret. Without it, the workflow prints a notice and skips the review.
