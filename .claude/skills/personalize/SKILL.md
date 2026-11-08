---
name: personalize
description: Write a version of each campaign email for every lead group in leads/leads.csv. Use when a campaign's emails are final and you want one copy per group.
argument-hint: "[campaign folder]"
context: fork
allowed-tools: Read, Glob, Grep, Write
---

# Personalize a campaign for each lead group

Campaign folder: $ARGUMENTS

## 1. Check the campaign folder

- If no campaign folder was given above, stop. Use Glob on `campaigns/*/` and reply with a list of the campaign folders that exist. Ask which one to use. Do not write any files.
- If the folder does not exist, or it has no `emails/*.md` files, stop and say so. List the campaign folders that do exist.

## 2. Read the rules first

Read these before writing anything:

- `brand/voice.md` — voice, words to avoid, claims we must never make, and the sign-off.
- `.claude/rules/emails.md` — subject and preview length, greeting, the one link, and the footer.
- `<campaign folder>/plan.md`, if it exists, for what each email is for.

## 3. Find the lead groups

- Read `leads/leads.csv` and collect the unique values in the `group` column. Today these are `tea-curious`, `gift-buyers` and `daily-drinkers`. If the file lists other groups, write versions for those too.
- Only use the group names. Do not copy any names, email addresses or other lead details into the emails.

## 4. Write one version of each email per group

For every file in `<campaign folder>/emails/` and every group:

**Keep exactly the same:**
- The `Subject:` and `Preview:` lines.
- The greeting with `{{first_name}}`.
- The structure: the same sections, headings, lists and order.
- The one main link, with the same button text and web address.
- Every `[square bracket]` placeholder, word for word.
- The sign-off and footer, exactly as written.

**Change only two things:**
1. **The opening line** (the first sentence after the greeting). Rewrite it so it speaks to that group.
2. **One example.** Pick one sentence that gives an example or describes a reader, and rewrite it to fit that group. Change only that one sentence or short passage.

**What fits each group:**
- **tea-curious:** new to loose-leaf tea. Keep it simple and welcoming. Nothing to learn first; a kettle is enough.
- **gift-buyers:** thinking of someone else. Talk about sharing a calm moment with a friend or family member. Do not promise gift options, gift wrap or gift messages; use `[square brackets]` if the idea is needed.
- **daily-drinkers:** already brew tea every day. Talk about trying something new in their usual ritual. Do not show off or use tea jargon.

**Brand checks for every new line:**
- Calm, warm, curious. Short sentences, plain English.
- None of the words to avoid in `brand/voice.md`. No health claims. No new promises about price, delivery, what's in the box, caffeine, gifts, or pause and cancel terms.
- No ALL CAPS. No more than one exclamation mark in the whole email, counting any already there.
- No P.S. and no new links.

## 5. Save the files

- Save each version to `<campaign folder>/groups/<group>/emails/` with the same file name as the original.
- Never change or delete the original emails.
- If a file already exists at the target path, do not overwrite it. Skip it and mention it in the summary.

## 6. Reply with a short summary only

Reply with just:

- How many files you wrote (and how many you skipped, if any).
- One example opening line for each group.

Do not paste the full emails.
