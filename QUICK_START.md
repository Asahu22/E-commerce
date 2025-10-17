# Quick Start Guide

## Getting Started in 3 Steps

### Step 1: Start the Backend Server

```bash
cd backend
npm install  # First time only
npm start
```

You should see:
```
Server is running on port 5000
MongoDB connected successfully
```

### Step 2: Open Admin Panel

1. Open `frontend/admin.html` in your web browser
2. Login with:
   - **Username**: `admin`
   - **Password**: `vishal@2233`
3. Add some products to test

### Step 3: Open Shopping Page

1. Open `frontend/index.html` in your web browser
2. You should see the products you added
3. Add items to cart and test the checkout flow

## Testing the Complete Flow

1. **Add Products (Admin)**:
   - Login to admin panel
   - Add 2-3 products with images
   - Products appear immediately

2. **Shop (User)**:
   - Open shopping page
   - Add products to cart
   - Adjust quantities
   - Click "Buy Now - Generate Invoice"

3. **Generate Invoice**:
   - PDF will download automatically
   - Contains all items, quantities, and total
   - Shows instruction to send to +91 95844 84662

## Important Notes

- Backend must be running for frontend to work
- Use Chrome or Firefox for best experience
- **Fully responsive design** - works perfectly on mobile phones, tablets, and desktops
- Cart data is saved in browser (localStorage)
- Product images are stored in `backend/uploads/`

## Admin Credentials

- **Username**: admin
- **Password**: vishal@2233

## Support Contact

Send invoices to: **+91 95844 84662**

---

That's it! You're ready to go. 🎉
