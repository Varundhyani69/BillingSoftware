# RetailPOS — Billing & Inventory Management System

A full-stack point-of-sale application built with Spring Boot and React. Designed for small retail businesses with role-based access for owners (Admin) and cashiers (User).

## Live Demo

**URL:** http://65.0.103.61

| Role | Email | Password |
|------|-------|----------|
| Admin (Owner) | admin@retail.com | admin123 |
| Cashier | varun@cashier.com | cashier |

## Features

- **POS Billing** — Search items, add to cart, adjust quantities, place orders with tax calculation
- **Role-Based Access** — Admin manages inventory/users, Cashier handles billing
- **Category Management** — Create, view, delete categories with image uploads
- **Item Management** — Add items with images, pricing, and category mapping
- **Order Management** — Track all orders, view order history, delete orders
- **Dashboard** — Today's sales, order count, and recent orders at a glance
- **User Management** — Admin can create/delete cashier accounts
- **Payment Integration** — Razorpay payment flow with order verification
- **Image Uploads** — AWS S3 integration for product and category images

## Tech Stack

### Backend
- Java 17, Spring Boot 3.5
- Spring Security + JWT Authentication
- JPA/Hibernate + MySQL
- AWS S3 (file uploads)
- Razorpay (payments)
- Docker (containerized deployment)

### Frontend
- React 19 + Vite
- Tailwind CSS
- React Router, Axios
- React Hot Toast, React Icons

### Deployment
- AWS EC2 (backend + frontend)
- Nginx (reverse proxy + static file serving)
- Docker (multi-stage build)

## Project Structure

```
RetailSoftware/
├── backend/           # Spring Boot application
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── client/            # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## Running Locally

### Backend
```bash
cd backend
./mvnw spring-boot:run
```
Requires MySQL running on localhost:3306 with database `billing_app`.

### Frontend
```bash
cd client
npm install
npm run dev
```
Runs on http://localhost:5173 with Vite proxy to backend.

## Environment Variables

### Backend (`application.properties`)
| Variable | Description |
|----------|-------------|
| DB_URL | MySQL connection URL |
| DB_USERNAME | Database username |
| DB_PASSWORD | Database password |
| AWS_ACCESS_KEY | AWS S3 access key |
| AWS_SECRET_KEY | AWS S3 secret key |
| AWS_REGION | AWS region |
| AWS_BUCKET_NAME | S3 bucket name |
| JWT_SECRET | JWT signing key |
| RAZORPAY_KEY_ID | Razorpay test/live key |
| RAZORPAY_KEY_SECRET | Razorpay secret |

### Frontend (`.env.production`)
| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API base URL |

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /login | Public | User login |
| POST | /encode | Public | Encode password |
| GET | /dashboard | User, Admin | Dashboard data |
| GET | /category | User, Admin | List categories |
| POST | /admin/categories | Admin | Create category |
| DELETE | /admin/categories/:id | Admin | Delete category |
| GET | /items | User, Admin | List items |
| POST | /admin/items | Admin | Create item |
| DELETE | /admin/items/:id | Admin | Delete item |
| POST | /orders | User, Admin | Create order |
| GET | /orders/latest | User, Admin | List orders |
| DELETE | /orders/:id | User, Admin | Delete order |
| POST | /payments/create-order | User, Admin | Create Razorpay order |
| POST | /payments/verify | User, Admin | Verify payment |
| POST | /images/upload | User, Admin | Upload image |
| DELETE | /images | User, Admin | Delete image |
| POST | /admin/register | Admin | Create user |
| GET | /admin/users | Admin | List users |
| DELETE | /admin/users/:id | Admin | Delete user |

## Docker Deployment

```bash
cd backend
docker build -t retail-backend .
docker run -d --name retail-backend --network host retail-backend
```

---

Built by [Varun Dhyani](https://github.com/varundhyani69)
