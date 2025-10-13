//interaction code



// Navigate to the product page
navigate(input.url);

// Wait for the main product info to load - this is the critical element
wait('h1.pdp-title', {timeout: 30000});

// Wait for price info to be available
wait('.pdp-price strong', {timeout: 10000});

// Collect data immediately after basic elements are loaded
let data = parse();
collect(data);








// parser code









// Helper to safely get text
$.prototype.text_sane = function() {
  return this.text().replace(/\s+/g, ' ').trim() || null;
};

// Helper function to extract price value
const extractPrice = (text) => {
  if (!text) return null;
  const match = text.match(/[\d,]+/);
  return match ? parseFloat(match[0].replace(/,/g, '')) : null;
};

// Helper to convert "3.2k" to 3200
const parseCount = (text) => {
  if (!text) return null;
  text = text.toLowerCase().trim();
  const match = text.match(/([\d.]+)([km]?)/);
  if (!match) return null;
  let num = parseFloat(match[1]);
  if (match[2] === 'k') num *= 1000;
  if (match[2] === 'm') num *= 1000000;
  return Math.round(num);
};

// Extract basic product info
const brand = $('h1.pdp-title').text_sane();
const product_name = $('h1.pdp-name').text_sane();

// Extract prices
const current_price_text = $('.pdp-price strong').text_sane();
const current_price_value = extractPrice(current_price_text);
const current_price = current_price_value ? new Money(current_price_value, 'INR') : null;

const original_price_text = $('.pdp-mrp s').text_sane();
const original_price_value = extractPrice(original_price_text);
const original_price = original_price_value ? new Money(original_price_value, 'INR') : null;

const discount_percentage = $('.pdp-discount').text_sane();

// Extract rating info - get first div which contains the rating number
const rating_text = $('.index-overallRating > div').first().text_sane();
const rating = rating_text ? parseFloat(rating_text) : null;

const rating_count_text = $('.index-ratingsCount').text_sane();
const rating_count = rating_count_text ? parseCount(rating_count_text) : null;

// Extract product fit from size chart info
const product_fit_text = $('.size-buttons-sizeChartInfo div').first().text_sane();
const product_fit = product_fit_text ? product_fit_text.match(/Fit:\s*([^\n]+)/)?.[1]?.trim() : null;

// Extract available sizes
const available_sizes = $('.size-buttons-unified-size').toArray()
  .map(el => $(el).text_sane())
  .filter(s => s);

// Extract material, color, and pattern from product name
const material = product_name?.match(/Cotton|Linen|Silk|Polyester|Wool|Denim/i)?.[0] || null;
const color = product_name?.match(/Maroon\s*&\s*Pink|Maroon|Pink|Blue|Red|Green|Black|White|Grey|Gray|Yellow|Orange|Purple|Brown|Navy|Teal/i)?.[0] || null;
const pattern = product_name?.match(/Gingham\s*Checked|Checked|Striped|Solid|Printed|Floral|Geometric/i)?.[0] || null;

// Extract product code and seller
const product_code = $('.supplier-styleId').text_sane();
const seller_name = $('.supplier-productSellerName').text_sane();

// Extract similar products
const similar_products = $('.product-list-gist').toArray().map(item => {
  const $item = $(item);
  const brand = $item.find('.product-item-brand').text_sane();
  const name = $item.find('.product-item-title').text_sane();
  const price_text = $item.find('.product-item-selling-price').text_sane();
  const price_value = extractPrice(price_text);
  const price = price_value ? new Money(price_value, 'INR') : null;
  const original_price_text = $item.find('.product-item-mrp').text_sane();
  const original_price_value = extractPrice(original_price_text);
  const original_price_item = original_price_value ? new Money(original_price_value, 'INR') : null;
  const discount = $item.find('.product-item-discount').text_sane();
  const url_path = $item.find('.product-list-link').attr('href');
  const url = url_path ? new URL(url_path, location.href) : null;
  
  return {
    brand,
    name,
    price,
    original_price: original_price_item,
    discount,
    url
  };
}).filter(p => p.brand || p.name);

// Extract reviews
const reviews = $('.user-review-userReviewWrapper').toArray().map(item => {
  const $item = $(item);
  const rating_text = $item.find('.user-review-starRating').text_sane();
  const rating = rating_text ? parseFloat(rating_text.match(/\d+/)?.[0]) : null;
  const review_text = $item.find('.user-review-reviewTextWrapper').text_sane();
  const reviewer_spans = $item.find('.user-review-left span').toArray();
  const reviewer_name = reviewer_spans[0] ? $(reviewer_spans[0]).text_sane() : null;
  const review_date = reviewer_spans[1] ? $(reviewer_spans[1]).text_sane() : null;
  
  return {
    rating,
    review_text,
    reviewer_name,
    review_date
  };
}).filter(r => r.rating || r.review_text);

// Return the complete data object
return {
  brand,
  product_name,
  current_price,
  original_price,
  discount_percentage,
  rating,
  rating_count,
  product_fit,
  available_sizes,
  material,
  color,
  pattern,
  product_code,
  seller_name,
  similar_products,
  reviews
};