# Detailed Project Report: Farmer-to-Consumer Agri Marketplace

## 1. Project Overview
The **Farmer-to-Consumer Agri Marketplace** is a robust web platform designed to eliminate middlemen in the agricultural supply chain. It connects local farmers directly with end consumers, allowing farmers to list their fresh produce and consumers to purchase them at fair prices. 

## 2. Problem Statement
Traditional agricultural supply chains rely heavily on multiple intermediaries, which leads to:
* **Low price realization for farmers**: Farmers receive only a fraction of what the end consumer pays.
* **Lack of transparency**: Consumers do not know where their food comes from or how it was farmed.
* **Inefficiency and wastage**: Long supply chains increase the risk of perishable goods spoiling before reaching the market.

## 3. Proposed Solution
This platform digitizes the local agricultural ecosystem by providing a direct marketplace. It empowers farmers to set their own prices, showcase their farming practices, and build trust with buyers. Consumers gain access to fresh, traceable produce while supporting local agriculture.

## 4. Key Features Implemented
* **Secure Authentication**: Role-based login and registration system for Farmers, Consumers, and Admins using secure password hashing.
* **Dedicated Dashboards**:
  * **Farmer Dashboard**: Allows farmers to track total sales, manage active orders, and view revenue.
  * **Consumer Dashboard**: Enables buyers to track order history and dispute status.
  * **Admin Dashboard**: Provides platform moderators with metrics on total users, platform sales, and the ability to verify new farmers.
* **Marketplace & Filtering**: A dynamic storefront where consumers can browse products with advanced filters (by category, location, organic vs. non-organic, and specific farmers).
* **Detailed Profiles**: Public farmer profiles showcasing their farming methods, location, crop types, and verification status.

## 5. Technology Stack
* **Frontend**: Next.js (React), Tailwind CSS for responsive and modern UI.
* **Backend**: Next.js App Router (Server Actions & API Routes).
* **Database**: PostgreSQL (hosted on Supabase) accessed via Prisma ORM.
* **Deployment**: Vercel.

## 6. Future Scope
* Integration of an online payment gateway (e.g., Stripe or Razorpay).
* Mobile application development for better accessibility in rural areas.
* AI-based price recommendations for farmers based on market demand.
* Cold-chain and logistics API integrations for automated delivery tracking.
