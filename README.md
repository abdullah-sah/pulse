# 💤 Pulse – AI-Powered Catch-Up Dashboard  

**Pulse** is an AI-driven personal dashboard that **summarizes your day as soon as you wake up**. It fetches your tasks, unread emails, and important WhatsApp messages, then organizes them into a clean, mobile-friendly dashboard.  

## 🚀 Features  
✅ **Wake-Up Trigger** – Runs automatically when you **unlock your iPhone**.  
✅ **Task Sync** – Fetches today’s tasks from **Motion (via Google Calendar API)**.  
✅ **Email Summarisation** – Uses **AI (GPT-4-turbo or self-hosted Mistral)** to summarise unread emails.  
✅ **WhatsApp Message Insights** – Scrapes **WhatsApp Web** to summarise your latest messages.  
✅ **News & RSS Feeds** *(Optional)* – Displays top news articles relevant to you.  
✅ **Fully Free to Run** – Uses **Vercel + Supabase + Free APIs** for hosting and data storage.  

## 📸 Screenshot (UI Preview)  
🚀 *Coming Soon*  

## 🔧 Tech Stack  
- **Frontend:** Next.js (t3 Stack) + Tailwind CSS
- **Backend:** tRPC (Next.js API) + Drizzle ORM
- **Database:** Supabase (PostgreSQL free-tier)
- **AI:** OpenAI GPT-4-turbo (Azure free-tier) or Self-Hosted Mistral
- **Automation:** iOS Shortcuts → Webhook to trigger updates

---

## 📥 Installation & Setup  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/abdullah-sah/pulse.git  
cd pulse
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Setup Environment Variables** 
Create a `.env.` file in the root directory and add the following environment variables:
```ini
# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google API (for Gmail & Calendar)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI Summarisation (Optional)
OPENAI_API_KEY=your_openai_key  # Use this if you're relying on OpenAI for email & WhatsApp summarisation

# Deployment (if using Vercel)
NEXT_PUBLIC_SITE_URL=https://your-vercel-app.vercel.app
```

💡 **Note**: You'll get these keys from:
- **Supabase Console** (Database settings -> API Keys)
- **Google Cloud Console** (OAuth Credentials for Google API)
- **OpenAI Dashboard** (if using OpenAI's API)

### **4️⃣ Setup Database (Drizzle ORM with Supabase)**
Since we're using **Drizzle ORM** with Supabase, initialise the database:
```sh
npx drizzle-kit generate:pg		# Generate migrations
npx drizzle-kit push:pg			# Apply migrations to Supabase
```
This will create the necessary tables in your **Supabase PostgreSQL database**

### **5️⃣ Run the Development Server**
After setting up the database, start the Next.js app:
```sh
npm run dev
```

📌 The app will be at *http://localhost:3000* 🚀
