# Inventory Dashboard

This is a fully functional web-based Inventory Dashboard built with **React**, **Recharts**, **Framer Motion**, and **Tailwind CSS**. The dashboard provides visual analytics for inventory data, including stock levels, category-wise distribution, consumption trends, and Inventory Turnover Ratio (ITR).

## Features

- Category-wise Inventory Distribution
- Monthly Consumption Trends
- Stock vs Minimum Stock Level (MSL) Analysis
- Inventory Turnover Ratio (ITR) Calculation
- ABC Classification Filter
- Responsive layout with sidebar navigation
- Clean and modern UI with animated transitions

## Tech Stack

- React (with Vite)
- Tailwind CSS
- Recharts
- Framer Motion
- Lucide-react icons
- Radix UI components

## Project Structure

InventoryDashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── [Chart and UI components]
│   ├── data/
│   │   └── dummyData.js (converted from Excel)
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
├── package.json
└── README.md

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

## Deployment

You can deploy this project to any modern static hosting platform like:
	•	GitHub Pages
	•	Netlify
	•	Vercel
	•	Hostinger (via FTP or custom domain)

ITR Calculations

Refer to the attached Excel sheet ITR_Calculations.xlsx for sample inventory turnover ratio calculations used in the dashboard.

