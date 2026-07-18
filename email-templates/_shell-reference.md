# MaxLight Kenya — Supabase Auth email templates

These are branded replacements for Supabase's default auth emails (the ones
that currently show up with "Supabase Auth" as the sender and a plain gray
template).

## The sender name is a separate setting from the template

Pasting these HTML files into Email Templates changes what the email
**looks like**. It does **not** change who it's **from** — that's controlled
by SMTP settings, and Supabase's built-in email service always sends as a
generic Supabase address no matter what template you use.

To make it actually say **MaxLight Kenya** as the sender, you must connect a
real SMTP provider:

1. Supabase Dashboard → your project → **Project Settings → Authentication →
   SMTP Settings**
2. Toggle **Enable Custom SMTP**
3. Pick an SMTP provider and get credentials from them first (all have free
   tiers big enough for auth emails):
   - [Resend](https://resend.com) — simplest to set up, good default choice
   - Postmark, Brevo, SendGrid, or AWS SES also work fine
4. You'll need a **verified domain** with that provider (e.g. maxlightkenya.com)
   — you can't send as "hello@maxlightkenya.com" until the provider confirms
   you own that domain (a DNS record they give you).
5. Fill in:
   - **Sender name**: `MaxLight Kenya`
   - **Sender email**: something on your verified domain, e.g.
     `hello@maxlightkenya.com` or `no-reply@maxlightkenya.com`
   - Host/port/username/password from your SMTP provider
6. Save, then send a real test signup to confirm.

If you don't have a domain yet, Resend also lets you send from a
**@resend.dev** test address while you're setting things up, though most
providers will show a "via resend.dev"-style note in some inboxes.

## Applying a template

Supabase Dashboard → **Authentication → Email Templates → Confirm signup**
(or Reset Password, etc.) → paste the contents of the matching `.html` file
into the **Message body** field → Save.

Supabase templates use Go template variables — don't remove `{{ .ConfirmationURL }}`,
it's replaced automatically with the real confirmation link.

## Files

- `confirm-signup.html` — sent when someone creates an account with email/password
- `reset-password.html` — sent from the "forgot password" flow
- `magic-link.html` — sent if you ever enable passwordless email sign-in

## Logo used in these templates

Hosted on Cloudinary (permanent, version-less URL — safe to keep in the
template even if you re-upload a new logo later):

```
https://res.cloudinary.com/bx0aqcem/image/upload/maxlight/branding/logo-icon.png
```
