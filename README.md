<a href="#">
  <h1 align="center">Email Priority Dashboard</h1>
</a>

<p align="center">
 A smart dashboard that helps you manage your Gmail inbox by prioritizing unread emails using AI
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#setup"><strong>Setup</strong></a> ·
  <a href="#environment-variables"><strong>Environment Variables</strong></a>
</p>
<br/>

## Features

- Automatically fetches and analyzes unread emails from your Gmail account
- Uses Google's Gemini AI to:
  - Generate concise summaries of email content
  - Assign priority levels (1-5) based on email importance
  - Identify and deprioritize marketing emails
- Real-time dashboard showing email summaries sorted by priority
- Built with:
  - [Next.js](https://nextjs.org) App Router
  - [Supabase](https://supabase.com) for authentication and data storage
  - [Tailwind CSS](https://tailwindcss.com) for styling
  - [shadcn/ui](https://ui.shadcn.com/) components

## Setup

1. Create a Supabase project [via the Supabase dashboard](https://database.new)

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
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project anonymous key
- `GOOGLE_GEMINI_API_KEY`: API key for Google's Gemini AI model

You can find the Supabase variables in your [Supabase project's API settings](https://app.supabase.com/project/_/settings/api).
