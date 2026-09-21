# StockPro â€” Commerce Pulse Dashboard

A responsive product inventory and analytics dashboard built as part of a Frontend Internship technical assessment.

The application provides Firebase authentication, product inventory management, advanced table operations, analytics visualizations, PDF/Excel exports, Redux Toolkit state management, and Docker support.

---

## Features

### Authentication

- Firebase Email/Password authentication
- Persistent authenticated sessions
- Protected dashboard routes
- Logout functionality
- Authentication state synchronized with Redux Toolkit

### Product Management

- View products from Firestore
- Add new products
- Edit existing products
- Delete products
- Product category support
- Product image support
- Inventory calculations
- Responsive product management interface

Each product contains:

- Product name
- Description
- Image
- Category
- Price
- Total quantity
- Sold quantity
- Available quantity
- Profit percentage

Available quantity is calculated dynamically:

```text
Available Quantity = Total Quantity - Sold Quantity
```

This value is derived in the application instead of being stored separately in Firestore.

---

## Dynamic Product Table

The products page includes:

- Search
- Category filtering
- Stock status filtering
- Column sorting
- Pagination
- Configurable rows per page
- Responsive mobile cards
- Edit and delete actions

Stock states are calculated dynamically:

```text
In Stock     â†’ Available quantity > 10
Low Stock    â†’ Available quantity between 1 and 10
Out of Stock â†’ Available quantity = 0
```

Filters can be combined together.

For example:

```text
Category = Laptop
Stock = Low Stock
Search = Pro
```

will display only products matching all selected conditions.

---

## Data Export

The application supports exporting product data to:

- PDF
- Excel (`.xlsx`)

Export operations use the currently filtered and sorted dataset instead of exporting only the visible pagination page.

Libraries used:

- jsPDF
- jspdf-autotable
- XLSX

---

## Analytics Dashboard

The overview dashboard uses live Firestore product data to calculate:

- Total Revenue
- Total Profit
- Units Sold
- Available Stock
- Total Products
- Average Profit Margin

### Revenue Calculation

```text
Revenue = Product Price Ã— Sold Quantity
```

### Profit Per Unit

```text
Profit Per Unit = Product Price Ã— Profit Percentage / 100
```

### Total Product Profit

```text
Product Profit = Profit Per Unit Ã— Sold Quantity
```

The dashboard includes:

- Revenue Overview
- Sales by Product
- Inventory Distribution
- Top Performing Products
- Profit Margin visualization

Charts are implemented with Recharts.

---

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### State Management

- Redux Toolkit
- React Redux

### Authentication & Database

- Firebase Authentication
- Cloud Firestore

### Tables

- TanStack Table

### Charts

- Recharts

### Forms & Validation

- React Hook Form
- Zod
- @hookform/resolvers

### Export

- jsPDF
- jspdf-autotable
- XLSX

### UI

- Lucide React

### Deployment / Containerization

- Docker
- Docker Compose
- Next.js Standalone Output

---

## Project Structure

```text
src/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ (dashboard)/
â”‚   â”‚   â”œâ”€â”€ dashboard/
â”‚   â”‚   â”œâ”€â”€ products/
â”‚   â”‚   â””â”€â”€ layout.tsx
â”‚   â”œâ”€â”€ login/
â”‚   â””â”€â”€ layout.tsx
â”‚
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ auth/
â”‚   â”œâ”€â”€ dashboard/
â”‚   â””â”€â”€ products/
â”‚
â”œâ”€â”€ features/
â”‚   â”œâ”€â”€ auth/
â”‚   â”œâ”€â”€ categories/
â”‚   â””â”€â”€ products/
â”‚
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ exports/
â”‚   â”œâ”€â”€ firebase/
â”‚   â””â”€â”€ products/
â”‚
â””â”€â”€ store/
```

The application follows a feature-oriented structure to keep UI, Firebase services, Redux logic, selectors, and business calculations separated.

---

## Firebase Data Model

### `categories`

Example structure:

```ts
{
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
```

### `products`

Example structure:

```ts
{
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  totalQuantity: number;
  soldQuantity: number;
  categoryId: string;
  profitPercentage: number;
  createdAt: string;
  updatedAt: string;
}
```

`availableQuantity` is not stored in Firestore.

It is calculated from:

```text
totalQuantity - soldQuantity
```

---

## Firebase Setup

Create a Firebase project and enable:

### Authentication

Enable:

```text
Authentication
â†’ Sign-in method
â†’ Email/Password
```

Create at least one Firebase user for testing the login flow.

### Firestore

Create a Cloud Firestore database.

The application uses:

```text
products
categories
```

collections.

For assessment/demo purposes, authenticated users require access to these collections.

Example development rules:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /products/{productId} {
      allow read, write: if request.auth != null;
    }

    match /categories/{categoryId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

For a production application, more restrictive role-based and field-level validation should be implemented.

---

## Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Then add your Firebase Web App configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Do not commit `.env.local`.

The repository tracks only `.env.example`.

---

## Installation

### Requirements

Recommended:

- Node.js 20+
- npm
- Docker Desktop
- Firebase project

Clone the repository:

```bash
git clone https://github.com/nashwamali22-lang/commerce-pulse-dashboard.git
```

Enter the project:

```bash
cd product-dashboard
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env.local
```

Add your Firebase configuration and start development mode:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Available Scripts

### Development

```bash
npm run dev
```

### TypeScript Validation

```bash
npx tsc --noEmit
```

### Production Build

```bash
npm run build
```

### Production Server

```bash
npm run start
```

### ESLint

```bash
npm run lint
```

---

## Production Build

Validate TypeScript:

```bash
npx tsc --noEmit
```

Create an optimized Next.js production build:

```bash
npm run build
```

The project uses:

```ts
output: 'standalone'
```

in `next.config.ts` to support an optimized Docker runtime.

---

## Docker

Docker support is included through:

```text
Dockerfile
docker-compose.yml
.dockerignore
```

### Build the Docker Image

Make sure Docker Desktop is running.

Then execute:

```bash
docker compose --env-file .env.local build
```

### Start the Container

```bash
docker compose --env-file .env.local up -d
```

### Verify the Container

```bash
docker ps
```

The application should be available at:

```text
http://localhost:3000
```

### Stop the Container

```bash
docker compose --env-file .env.local down
```

---

## Docker Architecture

The Dockerfile uses a multi-stage build:

```text
Dependencies
    â†“
Next.js Build
    â†“
Standalone Production Runtime
```

This keeps the final runtime image smaller and avoids shipping unnecessary development dependencies.

The application runs inside the container on:

```text
3000
```

which is exposed to the host as:

```text
localhost:3000
```

---

## State Management

Redux Toolkit is used for application-level state.

Main Redux domains:

```text
auth
products
categories
```

### Auth State

Manages:

- Firebase user
- Authentication initialization
- Loading states
- Authentication errors

### Products State

Manages:

- Firestore products
- Product CRUD operations
- Loading state
- Mutation state
- Errors

### Categories State

Manages:

- Product categories
- Category loading state
- Errors

Dashboard metrics are calculated with memoized Redux selectors.

---

## Implementation Approach

The project was implemented incrementally using feature-oriented development.

### 1. Project Foundation

The base Next.js application was configured with:

- TypeScript
- Tailwind CSS
- Redux Toolkit
- Firebase
- Required dashboard dependencies

### 2. Authentication

Firebase Email/Password authentication was added with:

- Redux state synchronization
- Persistent authentication
- Protected dashboard routes
- Login and logout flows

### 3. Product Architecture

The product domain was implemented using:

- Typed product models
- Firestore services
- Redux async thunks
- Memoized selectors
- Shared inventory calculations

### 4. Product Management

The product interface was extended with:

- CRUD
- Search
- Category filtering
- Stock filtering
- Sorting
- Pagination
- Responsive layouts

### 5. Data Export

Filtered and sorted product data can be exported as:

- PDF
- Excel

### 6. Analytics

The overview dashboard calculates all metrics directly from current Firestore product data instead of relying on static analytics values.

### 7. Docker

The application is containerized using a multi-stage Docker build and Next.js standalone output.

---

## Git Flow

Development followed a Git Flow-inspired branching strategy.

Main development branches include:

```text
develop
feature/project-setup
feature/authentication
feature/products-table
```

Example commit history:

```text
feat: configure Firebase authentication and Firestore services
feat: configure Redux Toolkit store and auth state
feat: implement Firebase email authentication and login screen
feat: complete Firebase authentication flow
feat: add product data architecture and Redux state
feat: complete product management table and data exports
feat: add analytics overview dashboard
chore: update application metadata
chore: dockerize dashboard application
```

Feature branches were merged into `develop` using explicit merge commits.

---

## Responsive Design

The interface supports:

- Desktop
- Laptop
- Tablet
- Mobile

The product table switches to a more mobile-friendly presentation on smaller screens.

Dashboard charts and KPI cards also adapt to available viewport width.

---

## Security Notes

- Firebase credentials are loaded through environment variables.
- `.env.local` is ignored by Git.
- `.env.example` contains only empty placeholders.
- Passwords are handled by Firebase Authentication and are not stored in Firestore.
- Protected routes require an authenticated Firebase session.

---

## Demo Checklist

The recorded project demonstration should include:

1. Login with Firebase Authentication
2. Overview dashboard
3. Analytics charts
4. Product listing
5. Search
6. Category filtering
7. Stock filtering
8. Sorting
9. Pagination
10. Add product
11. Edit product
12. Delete product
13. PDF export
14. Excel export
15. Responsive layout
16. Logout
17. Docker container running with `docker ps`
18. Application running from Docker on `localhost:3000`

---

## Demo Video

Demo video:

```text
Add demo video URL here before submission.
```

---

## Assessment Requirements

| Requirement | Implementation |
|---|---|
| React | âœ… |
| Next.js | âœ… |
| TypeScript | âœ… |
| Tailwind CSS | âœ… |
| Redux Toolkit | âœ… |
| Authentication | âœ… Firebase Authentication |
| Dynamic Data Table | âœ… |
| Sorting | âœ… |
| Filtering | âœ… |
| Pagination | âœ… |
| Charts | âœ… Recharts |
| Mobile Responsive | âœ… |
| PDF Export | âœ… |
| Excel Export | âœ… |
| Docker | âœ… |
| Git Flow | âœ… |
| README | âœ… |

---

## Author

Developed as part of a Frontend Internship technical assessment.

