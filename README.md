# StockPro — Commerce Pulse Dashboard

A responsive product inventory and analytics dashboard built as part of a Frontend Internship technical assessment.

The application provides Firebase authentication, product inventory management, advanced table operations, analytics visualizations, PDF/Excel exports, Redux Toolkit state management, responsive layouts, and Docker support.

---

## Features

### Authentication

- Firebase Email/Password authentication
- User registration with Create Account
- Persistent authenticated sessions
- Protected dashboard routes
- Logout functionality
- Authentication state synchronized with Redux Toolkit
- Firebase authentication error handling

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
In Stock     → Available quantity > 10
Low Stock    → Available quantity between 1 and 10
Out of Stock → Available quantity = 0
```

Filters can be combined together.

For example:

```text
Category = Laptop
Stock = Low Stock
Search = Pro
```

This displays only products matching all selected conditions.

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
Revenue = Product Price × Sold Quantity
```

### Profit Per Unit

```text
Profit Per Unit = Product Price × Profit Percentage / 100
```

### Total Product Profit

```text
Product Profit = Profit Per Unit × Sold Quantity
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
├── app/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── products/
│   │   └── layout.tsx
│   ├── login/
│   └── layout.tsx
│
├── components/
│   ├── auth/
│   ├── dashboard/
│   └── products/
│
├── features/
│   ├── auth/
│   ├── categories/
│   └── products/
│
├── lib/
│   ├── exports/
│   ├── firebase/
│   └── products/
│
└── store/
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

Create a Firebase project and enable the following services.

### Authentication

Enable:

```text
Authentication
→ Sign-in method
→ Email/Password
```

The application supports both:

- Sign In
- Create Account

### Firestore

Create a Cloud Firestore database.

The application uses the following collections:

```text
products
categories
```

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
cd commerce-pulse-dashboard
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

By default, Next.js will run on:

```text
http://localhost:3000
```

If port `3000` is already in use, Next.js may automatically use another port such as `3001`.

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
output: 'standalone';
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

The Dockerized application should be available at:

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
    ↓
Next.js Build
    ↓
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

Dashboard metrics are calculated using memoized Redux selectors.

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

Firebase Email/Password authentication was implemented with:

- Sign In
- Create Account
- Redux state synchronization
- Persistent authentication
- Protected dashboard routes
- Login and logout flows
- Authentication error handling

### 3. Product Architecture

The product domain was implemented using:

- Typed product models
- Firestore services
- Redux async thunks
- Memoized selectors
- Shared inventory calculations

### 4. Product Management

The product interface was extended with:

- CRUD operations
- Product images
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

The overview dashboard calculates metrics directly from current Firestore product data instead of relying on static analytics values.

### 7. Docker

The application is containerized using a multi-stage Docker build and Next.js standalone output.

---

## Git Flow

Development followed a Git Flow-inspired branching strategy.

Main development branches include:

```text
main
develop
feature/project-setup
feature/authentication
feature/products-table
feature/user-registration
fix/responsive-navigation-final-qa
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
chore: dockerize dashboard application
fix: improve responsive navigation and final code quality
refactor: remove duplicate product summary cards
feat: add user registration and product images
release: add registration and product image updates
```

Features were developed on dedicated branches and integrated into `develop` before the final release was synchronized with `main`.

---

## Responsive Design

The interface supports:

- Desktop
- Laptop
- Tablet
- Mobile

On larger screens, the application uses a persistent sidebar.

On smaller screens, navigation switches to a mobile drawer with a hamburger menu.

The product table also switches to a more mobile-friendly layout when required.

Dashboard charts and KPI cards adapt to the available viewport width.

---

## Security Notes

- Firebase configuration is loaded through environment variables.
- `.env.local` is ignored by Git.
- `.env.example` contains only placeholders.
- Passwords are handled by Firebase Authentication and are not stored in Firestore.
- Protected routes require an authenticated Firebase session.
- Application secrets are not committed to the repository.

---

## Demo Checklist

The recorded project demonstration includes:

1. Firebase Authentication
2. Sign In
3. Create Account
4. Protected routes
5. Overview dashboard
6. Analytics charts
7. Product listing
8. Search
9. Category filtering
10. Stock filtering
11. Sorting
12. Pagination
13. Add product
14. Edit product
15. Delete product
16. PDF export
17. Excel export
18. Responsive layout
19. Logout
20. Docker container running with `docker ps`
21. Application running from Docker on `localhost:3000`

---

## Demo Video

A complete walkthrough of the StockPro Dashboard, including Firebase Authentication, dashboard analytics, dynamic product table operations, filtering, sorting, pagination, CRUD operations, PDF/Excel export, responsive design, and Docker.

[Watch the Demo Video](https://drive.google.com/file/d/1UrqBXjU92GrJ0QINkJx_LoUN5tpHF_L6/view?usp=drivesdk)

---

## Assessment Requirements

| Requirement        | Implementation             |
| ------------------ | -------------------------- |
| React              | ✅                         |
| Next.js            | ✅                         |
| TypeScript         | ✅                         |
| Tailwind CSS       | ✅                         |
| Redux Toolkit      | ✅                         |
| Authentication     | ✅ Firebase Authentication |
| User Registration  | ✅ Firebase Authentication |
| Dynamic Data Table | ✅ TanStack Table          |
| Sorting            | ✅                         |
| Filtering          | ✅                         |
| Pagination         | ✅                         |
| Charts             | ✅ Recharts                |
| Mobile Responsive  | ✅                         |
| PDF Export         | ✅ jsPDF                   |
| Excel Export       | ✅ XLSX                    |
| Docker             | ✅                         |
| Docker Compose     | ✅                         |
| Git Flow           | ✅                         |
| Firestore          | ✅                         |
| README             | ✅                         |
| Demo Video         | ✅                         |

---

## Repository

GitHub Repository:

https://github.com/nashwamali22-lang/commerce-pulse-dashboard

---

## Author

Developed as part of a Frontend Internship technical assessment.
