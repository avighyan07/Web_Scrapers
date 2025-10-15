//interaction code

navigate(input.url);

// Wait for key elements to load
wait('.pdp-title', {timeout: 15000});
wait('.pdp-price', {timeout: 10000});
wait('.index-overallRating', {timeout: 10000});

// Scroll to load all content
scroll_to('.user-review-userReviewWrapper');
scroll_to('.product-list-gist');

// Collect the parsed data
let data = parse();
collect(data);






// parser code


// Helper function to clean text
const cleanText = (text) => (text || '').replace(/\s+/g, ' ').trim();

// Helper function to extract price number
const extractPrice = (text) => {
  if (!text) return null;
  const match = text.replace(/,/g, '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
};

// Extract product title and brand
const product_title = cleanText($('.pdp-name').text());
const brand = cleanText($('.pdp-title').text());

// Extract prices
const current_price_text = cleanText($('.pdp-price strong').text());
const current_price_value = extractPrice(current_price_text);
const current_price = current_price_value ? new Money(current_price_value, 'INR') : null;

const original_price_text = cleanText($('.pdp-mrp s').text());
const original_price_value = extractPrice(original_price_text);
const original_price = original_price_value ? new Money(original_price_value, 'INR') : null;

const discount_percentage = cleanText($('.pdp-discount').text());

// Extract rating and reviews
const product_rating = parseFloat($('.index-overallRating > div').first().text().trim()) || null;
const rating_count_text = cleanText($('.index-ratingsCount').text());
const rating_count = parseFloat(rating_count_text.replace(/[^\d.]/g, '')) * (rating_count_text.includes('k') ? 1000 : 1) || null;

// Extract product images
const product_images = $('.image-grid-image').toArray().map(img => {
  const src = $(img).attr('src');
  return src ? new Image(src) : null;
}).filter(Boolean);

// Extract available sizes
const available_sizes = $('.size-buttons-size-button p').toArray().map(el => cleanText($(el).text())).filter(Boolean);

// Extract fit information
const fit_information = cleanText($('.answer-caption-wrapper.answer-highlighted').first().text());

// Extract product details
const product_details = cleanText($('.pdp-product-description-content').first().text());

// Extract material and care
const material_care = cleanText($('.pdp-sizeFitDesc').eq(1).find('.pdp-product-description-content').text());

// Extract specifications
const specifications = $('.index-tableContainer .index-row').toArray().map(row => ({
  specification_name: cleanText($(row).find('.index-rowKey').text()),
  specification_value: cleanText($(row).find('.index-rowValue').text())
}));

// Extract delivery information
const delivery_information = $('.meta-container .meta-desc').toArray().map(el => cleanText($(el).text())).join('\n');

// Extract reviews
const reviews = $('.user-review-userReviewWrapper').toArray().slice(0, 10).map(review => {
  const reviewer_name = cleanText($(review).find('.user-review-left span').first().text());
  const review_date_text = cleanText($(review).find('.user-review-left span').last().text());
  const review_date = review_date_text ? new Date(review_date_text).toISOString().split('T')[0] : null;
  const rating_text = cleanText($(review).find('.user-review-starRating').first().text());
  const rating = parseFloat(rating_text) || null;
  const review_text = cleanText($(review).find('.user-review-reviewTextWrapper').text());
  
  return {
    reviewer_name,
    review_date,
    rating,
    review_text
  };
}).filter(r => r.reviewer_name);

// Extract similar products
const similar_products = $('.product-list-gist').toArray().slice(0, 10).map(product => {
  const product_name = cleanText($(product).find('.product-item-title').text());
  const product_brand = cleanText($(product).find('.product-item-brand').text());
  const product_price_text = cleanText($(product).find('.product-item-selling-price').text());
  const product_price_value = extractPrice(product_price_text);
  const product_price = product_price_value ? new Money(product_price_value, 'INR') : null;
  const product_link_href = $(product).find('.product-list-link').attr('href');
  const product_link = product_link_href ? new URL(product_link_href, location.href) : null;
  
  return {
    product_name,
    product_brand,
    product_price,
    product_link
  };
}).filter(p => p.product_name);

// Extract color (from description or other sources)
const color = product_details ? product_details.split(' ')[0] : null;

// Extract offers
const offers = $('.pdp-offers-offerTitle b').toArray().map(el => cleanText($(el).text())).filter(Boolean);

// Extract product ID from URL
const product_id = input.url.match(/\/(\d+)\//)?.[1] || null;

return {
  // product_title,
  // brand,
  // current_price,
  // original_price,
  // discount_percentage,
  // product_rating,
  // rating_count,
  // product_images,
  // available_sizes,
  // fit_information,
  // product_details,
  // material_care,
  // specifications,
  // delivery_information,
  // reviews,
  similar_products
  // color,
  // offers,
  // product_id
};
