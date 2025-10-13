//interaction code


// Navigate to the product page
navigate(input.url);

// Wait for key elements to load
wait('#pdp_product_name', {timeout: 10000});
wait('.jm-heading-xs.jm-ml-xxs', {timeout: 10000});

// Scroll to ensure all content is loaded
scroll_to('.product-specifications-table-item');

// Collect the parsed data
collect(parse());






// parser code







// Helper function to extract text safely
const getText = (selector) => {
  const el = $(selector).first();
  return el.length ? el.text().trim() : null;
};

// Helper function to extract price value
const getPrice = (selector) => {
  const text = getText(selector);
  if (!text) return null;
  const match = text.match(/[\d,]+\.?\d*/);
  return match ? parseFloat(match[0].replace(/,/g, '')) : null;
};

// Helper function to get specification value
const getSpec = (label) => {
  const selector = `.product-specifications-table-item-header:contains('${label}') + .product-specifications-table-item-data`;
  return getText(selector);
};

// Extract product title
const product_title = getText('#pdp_product_name');

// Extract prices
const current_price_value = getPrice('.jm-heading-xs.jm-ml-xxs');
const original_price_value = getPrice('.line-through');
const currency = 'INR';

// Extract discount
const discount_percentage = getText('.jm-badge.jm-ml-base.jm-body-s-link');

// Extract product images
const product_images = [];
$('.product-image-carousel .largeimage').each((i, el) => {
  const src = $(el).attr('src') || $(el).attr('data-src');
  if (src && !product_images.includes(src)) {
    product_images.push(new Image(src.split('?')[0]));
  }
});

// Extract brand
const brand = getText('#top_brand_name');

// Extract color
const color = getSpec('Brand Color');

// Extract available colors
const available_colors = [];
$('.product-variant-color-list-item-name').each((i, el) => {
  const colorName = $(el).text().trim();
  if (colorName) available_colors.push(colorName);
});

// Extract available sizes
const available_sizes = [];
$('.btn-variant-size').each((i, el) => {
  const size = $(el).text().trim();
  if (size) available_sizes.push(size);
});

// Extract product highlights
const product_highlights = getSpec('Highlight');

// Extract product features
const product_features = [];
$('.product-key-features-list-item').each((i, el) => {
  const feature = $(el).text().trim();
  if (feature) product_features.push(feature);
});

// Extract material
const material = getSpec('Fabric');

// Extract occasion
const occasion = getSpec('Occasion');

// Extract sleeve length
const sleeve_length = getSpec('Sleeve Length');

// Extract neck type from title
const neck_type = product_title && product_title.includes('Crew Neck') ? 'Crew Neck / Round Neck' : null;

// Extract wash care
const wash_care = getSpec('Wash Care');

// Extract dimensions
const dimensions = {
  chest_size: getSpec('Chest Size (in Inches) (in Inch)'),
  shoulder_size: getSpec('Shoulder Size (in Inches) (in Inch)'),
  sleeve_length_inches: getSpec('Sleeve Length (in Inches) (in Inch)'),
  length: getSpec('Length (in Inches) (in Inch)')
};

// Extract rating and reviews
const rating = parseFloat(getText('#average')) || null;
const review_count = parseInt(getText('#total_rating')) || null;

// Extract seller
const seller = getText('.buybox_seller_name');

// Extract availability
const availability = getText('.product-delivery-to-stock-main');

// Extract delivery info
const delivery_info = getText('.product-delivery-to-between');

// Extract country of origin
const country_of_origin = getSpec('Country of Origin');

// Extract article ID
const article_id = $('.product-article-detail span').first().text().trim() || null;

// Return the structured data
return {
  product_title,
  current_price: current_price_value ? new Money(current_price_value, currency) : null,
  original_price: original_price_value ? new Money(original_price_value, currency) : null,
  discount_percentage,
  product_images,
  brand,
  color,
  available_colors,
  available_sizes,
  product_highlights,
  product_features,
  material,
  occasion,
  sleeve_length,
  neck_type,
  wash_care,
  dimensions,
  rating,
  review_count,
  seller,
  availability,
  delivery_info,
  country_of_origin,
  article_id
};