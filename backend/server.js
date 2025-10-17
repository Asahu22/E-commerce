const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist (for local development)
if (!fs.existsSync('uploads')) {
  try {
    fs.mkdirSync('uploads');
  } catch (err) {
    console.log('Running in serverless mode - uploads directory not created');
  }
}

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Product Model
const Product = require('./models/Product');

// Configure Multer for image uploads (using memory storage for Vercel compatibility)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin login route
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get all products (public)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Add new product (admin only)
app.post('/api/products', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price || !req.file) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Convert image to base64 for serverless compatibility
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const product = new Product({
      name,
      price: parseFloat(price),
      image: base64Image,
      imageType: 'base64'
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});

// Delete product (admin only)
app.delete('/api/products/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete the image file only if it's a file path (for backwards compatibility)
    if (product.imageType === 'url' && product.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Root endpoint - Landing page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Humisha Fireworks Platform</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            .container {
                background: white;
                border-radius: 20px;
                padding: 60px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                text-align: center;
                max-width: 600px;
            }
            h1 {
                color: #667eea;
                font-size: 48px;
                margin-bottom: 20px;
            }
            p {
                color: #666;
                font-size: 18px;
                margin-bottom: 40px;
                line-height: 1.6;
            }
            .links {
                display: flex;
                gap: 20px;
                justify-content: center;
                flex-wrap: wrap;
            }
            .btn {
                padding: 15px 30px;
                border-radius: 10px;
                text-decoration: none;
                font-size: 18px;
                font-weight: bold;
                transition: transform 0.2s, box-shadow 0.2s;
                display: inline-block;
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }
            .btn-shop {
                background: #667eea;
                color: white;
            }
            .btn-admin {
                background: #764ba2;
                color: white;
            }
            .features {
                margin-top: 40px;
                padding-top: 40px;
                border-top: 2px solid #eee;
            }
            .feature {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin: 15px 0;
                color: #555;
                font-size: 16px;
            }
            .icon {
                font-size: 24px;
            }
            .status {
                display: inline-block;
                padding: 8px 20px;
                background: #28a745;
                color: white;
                border-radius: 20px;
                font-size: 14px;
                margin-bottom: 20px;
            }
            .api-links {
                margin-top: 30px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 10px;
            }
            .api-links h3 {
                color: #333;
                margin-bottom: 15px;
                font-size: 20px;
            }
            .api-link {
                display: block;
                color: #667eea;
                text-decoration: none;
                margin: 8px 0;
                font-family: monospace;
            }
            .api-link:hover {
                text-decoration: underline;
            }

            /* Mobile Responsive Styles */
            @media (max-width: 768px) {
                body {
                    padding: 10px;
                }

                .container {
                    padding: 30px 20px;
                    max-width: 95%;
                }

                h1 {
                    font-size: 32px;
                }

                p {
                    font-size: 16px;
                }

                .links {
                    flex-direction: column;
                    gap: 15px;
                }

                .btn {
                    width: 100%;
                    padding: 12px 20px;
                    font-size: 16px;
                }

                .feature {
                    font-size: 14px;
                }

                .api-links {
                    padding: 15px;
                }

                .api-links h3 {
                    font-size: 18px;
                }

                .api-link {
                    font-size: 12px;
                }
            }

            @media (max-width: 480px) {
                .container {
                    padding: 20px 15px;
                }

                h1 {
                    font-size: 28px;
                }

                p {
                    font-size: 15px;
                    margin-bottom: 25px;
                }

                .status {
                    font-size: 12px;
                    padding: 6px 15px;
                }

                .feature {
                    font-size: 13px;
                }

                .icon {
                    font-size: 20px;
                }

                .api-links {
                    padding: 12px;
                }

                .api-link {
                    font-size: 11px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🛍️ Humisha Fireworks Platform</h1>
            <div class="status">✅ Server Running</div>
            <p>Welcome to our Humisha Fireworks platform! Start shopping or manage your products.</p>

            <div class="links">
                <a href="/shop" class="btn btn-shop">🛒 Start Shopping</a>
            </div>

            <div class="features">
                <div class="feature">
                    <span class="icon">✨</span>
                    <span>No registration required for shopping</span>
                </div>
                <div class="feature">
                    <span class="icon">📦</span>
                    <span>Home delivery available</span>
                </div>
                <div class="feature">
                    <span class="icon">📄</span>
                    <span>Instant PDF invoice generation</span>
                </div>
                <div class="feature">
                    <span class="icon">💳</span>
                    <span>Easy checkout process</span>
                </div>
                <div class="feature">
                    <span class="icon">📞</span>
                    <span>Contact: +917000260096</span>
                </div>                
            </div>

        </div>
    </body>
    </html>
  `);
});

// Shop page
app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// Serve static frontend files (for assets, etc.)
app.use(express.static(path.join(__dirname, '../frontend')));

// Only start the server if not running in Vercel serverless environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to get started`);
  });
}

// Export for Vercel
module.exports = app;
