
---

## Project Overview

**Repository:** KumaloWilson/learnsmart

### General Description

- The top-level `README.md` is nearly empty, but internal documentation and configuration files reveal the following:
- **Purpose:**  
  The backend's `package.json` describes the project as an "**AI-powered smart learning system for Chinhoyi Technology students.**"  
  This suggests the project is an education technology platform leveraging AI for personalized or enhanced learning, likely aimed at higher education or university students in Chinhoyi.

---

## Structure & Components

### 1. Monorepo Layout

The repository is structured as a monorepo, containing at least three primary sub-projects:
- `admin` (Next.js frontend for administration)
- `backend` (Node.js/Express backend)
- `lecturer` (Next.js frontend for lecturers)

---

### 2. Admin Frontend (`admin/`)

- **Framework:** Next.js (bootstrapped with `create-next-app`)
- **Development:**  
  - Start with `npm run dev`, `yarn dev`, `pnpm dev`, or `bun dev`
  - Runs at [http://localhost:3000](http://localhost:3000)
- **Customization:**  
  - Edit `app/page.tsx` for home page
- **Features:**  
  - Uses `next/font` for font optimization ([Geist](https://vercel.com/font))
- **Deployment:**  
  - Instructions for deploying to Vercel are included

**Key dependencies:**  
Radix UI components, Redux Toolkit, Tailwind CSS, Axios, Framer Motion, Zod, React Hook Form, Recharts, and more.  
This indicates a modern, interactive, and accessible UI using component libraries and state management.

---

### 3. Backend (`backend/`)

- **Framework:** Node.js with Express
- **Language:** TypeScript
- **Description:** "AI-powered smart learning system for Chinhoyi Technology students"
- **Features & Tech Stack:**
  - **ORM/Database:** Sequelize (with TypeScript support), PostgreSQL (`pg`, `pg-hstore`, `pg-pool`)
  - **AI Integration:** OpenAI API
  - **Auth & Security:** JWT, Bcrypt, Helmet, CORS, Express Validator
  - **APIs & Documentation:** Swagger (jsdoc & UI express)
  - **Cloud/Third-party:** Supabase JS, Nodemailer, Paynow (payment integration for Zimbabwe)
  - **Rate Limiting & Performance:** Rate-limit-redis, Compression
  - **Others:** Winston (logging), Joi (validation), Multer (file uploads)
- **Scripts:** Build, start, dev (with nodemon), migrations, seeding, testing (Jest)
- **License:** MIT

---

### 4. Lecturer Frontend (`lecturer/`)

- **Framework:** Next.js
- **Development:** Standard Next.js scripts (`dev`, `build`, `start`, `lint`)
- **Key dependencies:**  
  Similar to admin with Radix UI, Redux, Tailwind CSS, Axios, React Hook Form, Recharts, Zod, etc.

---

## Features (Inferred)

- **Multi-role platform:**  
  Separate interfaces for administrators and lecturers suggest role-based access and functionality.
- **AI integration:**  
  Likely for personalized content, recommendations, or automated grading/feedback.
- **Learning management:**  
  Backend structure and payment integration hint at course/content management, student progress tracking, and potentially paid services or certifications.
- **Modern UI/UX:**  
  Use of Radix UI, Tailwind CSS, and Next.js for fast, accessible, and maintainable interfaces.
- **Scalability & Security:**  
  Use of JWTs, rate limiting, helmet, and Supabase for robust authentication, authorization, and cloud services.

---

## Setup & Usage

- **Admin and Lecturer Frontends:**
  - Install dependencies (`npm install`, `yarn`, etc.)
  - Start with `npm run dev` or equivalent
  - Access via web browser at local host
- **Backend:**
  - Install dependencies
  - Use `npm run dev` for development, `npm run build` to compile, `npm start` to run compiled project
  - Database migrations and seed scripts included

---

## Contribution & Community

- No dedicated `CONTRIBUTING.md` or `CODE_OF_CONDUCT.md` files were found, so contribution guidelines are likely not formalized yet.

---

## Technologies Used

- **Frontend:** Next.js, React, Redux Toolkit, Radix UI, Tailwind CSS, TypeScript
- **Backend:** Node.js, Express, TypeScript, Sequelize, PostgreSQL, OpenAI API, Supabase
- **Other:** Swagger, Winston, Nodemailer, Paynow, Zod

---

## Summary

**LearnSmart** is a full-stack, AI-powered educational platform designed for Chinhoyi Technology students. It features separate administrative and lecturer user interfaces, a robust Node.js/TypeScript backend, and modern UI frameworks. The system integrates AI for smart learning, supports payments, handles security and scalability, and leverages many modern JavaScript/TypeScript tools for development.

If you would like more detail on a specific area (e.g., API endpoints, example features, or code structure), let me know!
