// controllers/productController.js

// import Product from '../models/Product.js'; // Import your Mongoose model here

// @desc    Get all products
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    // const products = await Product.find();
    res.status(200).json({ message: "List of all products fetched successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    // const product = await Product.findById(id);
    res.status(200).json({ message: `Fetched product with ID: ${id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    // const newProduct = await Product.create(productData);
    res.status(201).json({ message: "Product created successfully", data: productData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    // const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ message: `Updated product with ID: ${id}`, updates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // await Product.findByIdAndDelete(id);
    res.status(200).json({ message: `Deleted product with ID: ${id} successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};