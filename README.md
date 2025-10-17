# Humisha Fireworks Website with Admin Panel

A simple Humisha Fireworks website where admins can add products and users can shop without logging in. PDF invoices are generated on checkout.

## Features

### Admin Panel
- Hardcoded login credentials:
  - Username: `admin`
  - Password: `vishal@2233`
- Add new products with name, image, and price
- View and delete existing products
- Dashboard displays "Home delivery available" message
- **Fully mobile responsive** - manage products from your phone

### User Shopping Interface
- No login required for shopping
- Browse all available products
- Add products to cart with quantity controls
- Generate PDF invoice on checkout
- Invoice includes items, quantities, prices, and total amount
- **Mobile optimized** - shop seamlessly on phones and tablets

### Mobile Responsive Design
- ✅ Works on phones, tablets, and desktops
- ✅ Touch-friendly buttons and controls
- ✅ Adaptive layouts for all screen sizes
- ✅ Optimized for mobile browsers
- See [MOBILE_FEATURES.md](MOBILE_FEATURES.md) for details

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: HTML, CSS, JavaScript
- **PDF Generation**: jsPDF library

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Start the Backend Server

```bash
npm start
```

The server will run on `http://localhost:5000`

For development with auto-restart:
```bash
npm run dev
```

### 3. Open the Frontend

Open the following files in your browser:

- **User Shopping Page**: `frontend/index.html`
- **Admin Panel**: `frontend/admin.html`

## Usage Guide

### For Admin:

1. Open `frontend/admin.html` in your browser
2. Login with:
   - Username: `admin`
   - Password: `vishal@2233`
3. Add products by filling in:
   - Product name
   - Price
   - Product image (upload file)
4. Click "Add Product"
5. Products will immediately appear on the user shopping page

### For Users:

1. Open `frontend/index.html` in your browser
2. Browse available products
3. Click "Add to Cart" on desired products
4. Click the cart icon to view cart
5. Adjust quantities using +/- buttons
6. Click "Buy Now - Generate Invoice"
7. PDF invoice will be downloaded automatically
8. Send the PDF to **+91 95844 84662** to complete the order

## Project Structure

```
website/
├── backend/
│   ├── models/
│   │   └── Product.js          # Product schema
│   ├── uploads/                # Uploaded product images
│   ├── .env                    # Environment variables
│   ├── package.json            # Backend dependencies
│   └── server.js               # Express server
├── frontend/
│   ├── index.html              # User shopping page
│   └── admin.html              # Admin panel
└── README.md                   # This file
```

## Database Configuration

MongoDB connection is configured in `backend/.env`:
- Database: MongoDB Atlas
- Connection string includes authentication
- Database name: `ecommerce`

## API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `POST /api/admin/login` - Admin login

### Protected Endpoints (require admin token)
- `POST /api/products` - Add new product
- `DELETE /api/products/:id` - Delete product

## Environment Variables

Located in `backend/.env`:
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens
- `ADMIN_USERNAME` - Admin username (admin)
- `ADMIN_PASSWORD` - Admin password (vishal@2233)

## Notes

- Product images are stored in `backend/uploads/` directory
- Cart data is stored in browser's localStorage
- PDF invoices include date, items, quantities, and total amount
- The admin panel is protected with JWT authentication
- Users can shop without any registration or login

## Troubleshooting

### Backend won't start:
- Ensure MongoDB connection string is correct in `.env`
- Check if port 5000 is available
- Run `npm install` in backend directory

### Products not showing:
- Verify backend server is running
- Check browser console for errors
- Ensure MongoDB is accessible

### PDF not generating:
- Check browser console for errors
- Ensure jsPDF library is loaded
- Try a different browser (Chrome/Firefox recommended)

## License

This project is for educational purposes.
