# 🏨 Raj Heritage Hospitality — Client Setup Guide

Welcome to the **Raj Heritage Hospitality** project. This guide will walk you through setting up and running the application on your local machine.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your system:

1.  **Node.js (v18 or higher)**: The engine that runs the application.
    *   [Download Node.js here](https://nodejs.org/) (Choose the "LTS" version).
2.  **Git**: To download the project files.
    *   [Download Git here](https://git-scm.com/downloads).
3.  **A Code Editor**: We recommend [Visual Studio Code](https://code.visualstudio.com/).

---

## 🚀 Step 1: Clone the Project

Open your terminal (or Command Prompt) and run the following commands:

```bash
# Clone the repository
git clone <YOUR_REPO_URL_HERE>

# Navigate into the project folder
cd "Hotel Management"
```

---

## 📦 Step 2: Install Dependencies

Once inside the project folder, install the necessary libraries by running:

```bash
npm install
```

---

## 🔑 Step 3: Configure Environment Variables

The application needs "keys" to connect to the database, AI services, and payment gateway. 

1.  In the project root folder, look for a file named `.env`.
2.  If it doesn't exist, create a new file named `.env`.
3.  Copy and paste the following content into the file (replacing with your own keys if needed):

```env
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
VITE_OPENROUTER_MODEL=openai/gpt-oss-120b:free
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

> [!NOTE]
> For testing purposes, you can use the keys already provided in the `.env` file if they are still active.

---

## 🗄️ Step 4: Database Setup (Supabase)

If you are setting up your own database instance:

1.  Create a project at [Supabase](https://supabase.com/).
2.  Go to the **SQL Editor** in your Supabase dashboard.
3.  Copy the contents of `schema.sql` (found in the project folder) and run it in the SQL Editor. This will create all the necessary tables and security rules.
4.  **Important**: Also run the contents of `migration.sql`. This will populate your database with "Seed Data" (mock hotel rooms) so the application isn't empty when you first run it.
5.  Copy the **Project URL** and **Anon Key** from your Supabase settings into your `.env` file.

---

## 🏃 Step 5: Run the Application

Now you are ready to start the app! Run:

```bash
npm run dev
```

*   The terminal will provide a link (usually `http://localhost:5173`).
*   Open this link in your browser to see the application in action.

---

## 🏗️ Production Build

If you wish to create a production-ready version of the app:

```bash
npm run build
```

The output will be in the `dist` folder, which can be uploaded to any static hosting service like Vercel, Netlify, or Hostinger.

---

## 📞 Support

If you encounter any issues during setup, please reach out to the development team.

*Built with excellence by the Raj Heritage Dev Team.*
