---
paths:
  - "campaigns/**/emails/*.md"
---

# Rules for email files

These rules apply to every email file in any campaign. Check each one before you finish a draft.

## 1. Subject and preview come first

- Line 1 must be `Subject: ` followed by the subject line.
- Line 2 must be `Preview: ` followed by the preview text.
- The subject must be 50 characters or fewer. The preview must be 90 characters or fewer. Count only the text after `Subject: ` or `Preview: `, including spaces.
- Nothing comes before these two lines.

## 2. Greet the reader by name

- Greet the reader with `{{first_name}}`. For example: `Hi {{first_name}},`
- Write the tag exactly like this, with two curly brackets on each side.

## 3. One main link

- Each email has exactly one main link.
- Write it like this: `[Button text](https://kettlebird.example/steep-club)`
- Change only the button text. Keep the web address exactly the same.
- Do not add any other links in the body.

## 4. End with the sign-off, then the footer

Finish every email with the sign-off from `brand/voice.md`, then the footer. Nothing else goes after the sign-off except the footer.

The end of every email must look exactly like this:

```
Happy steeping,
The Kettlebird team

You're getting this because you joined the Kettlebird Tea waitlist.
Kettlebird Tea, {{company_address}} · Unsubscribe: {{unsubscribe_url}}
```

- In the email file, write these lines as plain text. Do not put them inside a code block. Copy only the lines, not the ``` marks above.
- Keep `{{company_address}}` and `{{unsubscribe_url}}` exactly as written. They get filled in later.
- No P.S.
