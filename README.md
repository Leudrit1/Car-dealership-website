# Car Dealership Website

## Overview

This repository contains a full‑stack web application for a car dealership.  
It includes a public website for visitors and a protected admin interface for managing inventory,
customer enquiries and sell requests.

## Main Features

### Visitor Side
- **Fahrzeugkollektion**: overview of all cars with search, price filters and body‑type filters  
- **Fahrzeugdetails**: detail page with image gallery (up to 10 images), specifications and CHF price  
- **Kontaktformular**: contact page plus a contact section on the home page  
- **Auto verkaufen**: dedicated page for owners to submit their car for evaluation, with a clear follow‑up message
  explaining that the team will get in touch if the car fits the portfolio

### Admin Side
- **Login**: session‑based authentication with admin role  
- **Dashboard**:
  - stats for total cars, contact messages and sell requests  
  - recent activity list with the latest cars  
- **Fahrzeugverwaltung**:
  - add / edit / delete cars via a structured form  
  - upload up to 10 images per car (stored as Base64 and shown in the gallery)  
  - maintain technical data (engine, transmission, fuel type, body type, colour)  
- **Kontaktverwaltung**:
  - table view of contact messages with date and time  
  - view / delete entries
- **Verkaufsanfragen**:
  - table view of sell requests, including contact details and requested price  
  - ability to remove processed requests

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, framer‑motion  
- **Routing**: wouter  
- **Data fetching & cache**: TanStack React Query  
- **Backend**: Node.js, Express, session‑based auth with `express-session`  
- **Database**: SQLite via drizzle‑orm and better‑sqlite3  
- **Validation**: zod and drizzle‑zod for all user input (cars, contacts, sell requests)

## Security and Code Hygiene

- The session secret is read from the `SESSION_SECRET` environment variable (with a simple fallback
  used only for development).  
- API logging only records method, path, status code and duration; response bodies are not logged.  
- All incoming data for cars, contacts and sell requests is validated with zod schemas before being stored.  
- Debug/test endpoints and verbose console logging that exposed internal data have been removed.  
- Default admin credentials are not shown anywhere in the UI or documentation.

## Running the Project (Development)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the application in your browser (for example):
   - `http://localhost:5004`

