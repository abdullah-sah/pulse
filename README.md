<a href="#">
  <h1 align="center">Pulse - AI-Powered Productivity Assistant</h1>
</a>

<p align="center">
  A smart productivity dashboard that automates task management, email summarisation, and daily briefings using AI.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#setup"><strong>Setup</strong></a> ·
  <a href="#environment-variables"><strong>Environment Variables</strong></a>
</p>
<br/>

## Features

- [ ] Fetches AI-prioritised tasks from [Motion](https://www.usemotion.com) and caches them in Supabase
- [x] Uses Google's Gemini AI to:
  - Generate concise summaries of emails from Gmail
  - Prioritise tasks based on urgency and deadlines
  - Summarise meeting transcripts from Google Meet & Zoom
- [ ] Sends daily task/email summaries to Slack, Telegram, or Discord
- [ ] Customisable delivery times and priority filtering for daily summaries
- Built with:
  - [Next.js](https://nextjs.org) 14 (app router)
  - [Supabase](https://supabase.com/) for authentication and data storage
  - [Tailwind CSS](https://tailwindcss.com) for styling
  - [shadcn/ui](https://ui.shadcn.com/) components

## Setup

1. Create a Supabase project [via the Supabase dashboard](https://supabase.com/dashboard/projects)

2. Clone this repository:
   ```bash
   git clone https://github.com/abdullah-sah/pulse.git
   cd pulse
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create `.env.local` with the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[YOUR SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR SUPABASE PROJECT API ANON KEY]
   GOOGLE_GEMINI_API_KEY=[YOUR GEMINI API KEY]
   MOTION_API_KEY=[YOUR MOTION API KEY]
   SLACK_WEBHOOK_URL=[YOUR SLACK WEBHOOK URL]
   TELEGRAM_BOT_TOKEN=[YOUR TELEGRAM BOT TOKEN]
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project anonymous key
- `GOOGLE_GEMINI_API_KEY`: API key for Google's Gemini AI model
- `MOTION_API_KEY`: API key for fetching AI-prioritised tasks from Motion
- `SLACK_WEBHOOK_URL`: Webhook URL for sending summaries to Slack
- `TELEGRAM_BOT_TOKEN`: Bot token for sending summaries to Telegram

You can find the Supabase variables in your [Supabase project's API settings](https://app.supabase.com/project/_/settings/api).

