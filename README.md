# 📅 Habit Tracker App

A simple habit tracking web application built with **Vue 3** and **TailwindCSS**. This app helps you build and maintain daily habits by tracking progress over time.

## 🚀 Features

- ✅ Add, edit, stop, and delete habits
- 📆 Track habits day by day
- 🔄 Navigate between days
- 💾 Progress saved in LocalStorage
- 🌙 Clean, responsive UI with TailwindCSS

## 🧠 How It Works

- Each habit is stored in a global habit list (`habit-names`)
- Daily completions are stored per-date (`habits-YYYY-MM-DD`)
- You can edit the same habit or add new habits
- You can also stop a habit (hide it from future days) or delete it entirely

## 📦 Project Setup

```bash
# Clone the repo
git clone https://github.com/def217/HabitTrackingApp
cd habit-tracker-app

# Install dependencies
npm install

# Run the development server
npm run dev
```
