import Product from '../models/Product.js';

export async function getProducts(req, res, next) {
  try {
    const { type, gender, search, sort, tag } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (gender) filter.gender = gender;
    if (tag === 'sale') filter.oldPrice = { $exists: true, $ne: null };
    else if (tag) filter.tag = tag;
    if (search) filter.name = { $regex: search, $options: 'i' };

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };

    const products = await Product.find(filter).sort(sortOption);
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Khong tim thay san pham' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

