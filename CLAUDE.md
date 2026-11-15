# My Email Studio

This studio is for planning and writing email campaigns for a small business. We use it to work out who we are writing to, what we want to say, and to draft the emails themselves.

## Folders

- **brand/** — Who the business is: voice, tone, brand colours, logos and key messages.
- **leads/** — Information about the people and groups we want to reach.
- **campaigns/** — Campaign plans and the email drafts for each campaign.
- **notes/** — Research, ideas and decisions, such as which skills and tools we chose.

## Brand voice

@brand/voice.md

## Rules

- **Write in plain English.** Use short sentences and everyday words. Avoid jargon.
- **Never send email to real people.** Only write drafts. Do not send, schedule or forward any email to a real address, even as a test.
  - **The one exception is Resend.** Sending through Resend is allowed only to Resend's test addresses (ending in `@resend.dev`) and to my own address (the MY_EMAIL value in .claude/settings.local.json). Never send through Resend to anyone else. A guard will enforce this in the next step.
- **Email format rules live in `.claude/rules/emails.md`.** This covers subject and preview length, the greeting, the one link, and the sign-off and footer. Read it when asked about email format.
- **Ask me before deleting anything.** This includes files, folders, drafts and data in any connected tool.
