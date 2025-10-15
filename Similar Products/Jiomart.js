//interaction code
// Navigate to the product page
navigate(input.url);

// Wait for key elements to load
wait('.buy-box-product-card-details', {timeout: 15000});
wait('.product-price', {timeout: 10000});
wait('.product-specifications-table-item', {timeout: 10000});

// Scroll to load similar products section
scroll_to('.similar-recommended-product-card-wrapper');

// Wait for similar products to load
wait('.similar-recommended-product-card-wrapper', {timeout: 10000});

// Collect the parsed data
let data = parse();
collect(data);







// parser code


// Helper function to clean text
const cleanText = (text) => (text || '').replace(/\s+/g, ' ').trim();

// Helper function to extract price from text
const extractPrice = (text) => {
  if (!text) return null;
  const match = text.match(/₹([\d,]+\.?\d*)/);
  return match ? parseFloat(match[1].replace(/,/g, '')) : null;
};

// Helper function to create Money object
const toMoney = (priceText) => {
  const price = extractPrice(priceText);
  return price ? new Money(price, 'INR') : null;
};

// Product title
const product_title = cleanText($('.buy-box-product-card-details .jm-body-s').text());

// Current price
const current_price_text = cleanText($('.product-price span.jm-heading-xs').first().text()) || 
                           cleanText($('.product-price .jm-body-m-bold').first().text());
const current_price = toMoney(current_price_text);

// Original price
const original_price_text = cleanText($('.product-price span.line-through').first().text()) ||
                            cleanText($('.product-price .jm-body-xs.line-through').first().text());
const original_price = toMoney(original_price_text);

// Discount percentage
const discount_percentage = cleanText($('.product-price .jm-badge').first().text());

// Brand - from specifications table
const brand = cleanText($('.product-specifications-table-item:contains("Brand") .product-specifications-table-item-data').text());

// Availability
const availability = cleanText($('.product-delivery-to-stock-main').text());

// Delivery info
const delivery_info = cleanText($('.product-delivery-to-between').text());

// Seller
const seller = cleanText($('.jm-ma-none.jm-body-m-bold').text()) || 
               cleanText($('.buybox_seller_name').text());

// Product type
const product_type = cleanText($('.product-specifications-table-item:contains("Product Type") .product-specifications-table-item-data').text());

// Country of origin
const country_of_origin = cleanText($('.product-specifications-table-item:contains("Country of Origin") .product-specifications-table-item-data').text());

// Product image
const product_image_src = $('.buy-box-product-card-image img').attr('src');
const product_image = product_image_src ? new Image(product_image_src) : null;

// Manufacturer
const manufacturer = cleanText($('.product-specifications-table-item:contains("Manufacturer") .product-specifications-table-item-data').first().text());

// Net quantity
const net_quantity = cleanText($('.product-specifications-table-item:contains("Net Quantity") .product-specifications-table-item-data').text());

// Similar products
const similar_products = [];
$('.similar-recommended-product-card-wrapper').each((i, elem) => {
  const $elem = $(elem);
  const title = cleanText($elem.find('.display_name').text());
  const price_text = cleanText($elem.find('.jm-body-s-bold').text());
  const price = toMoney(price_text);
  const image_src = $elem.find('img').attr('src');
  const image = image_src ? new Image(image_src) : null;
  const url_path = $elem.find('a').attr('href');
  const url = url_path ? new URL(url_path, location.href) : null;
  
  if (title && price) {
    similar_products.push({
      title: title,
      price: price,
      image: image,
      url: url
    });
  }
});

// Offers
const offers = [];
$('.jm-list-content-caption-title.jm-body-xs-bold').each((i, elem) => {
  const offer_text = cleanText($(elem).text());
  if (offer_text) {
    offers.push(offer_text);
  }
});

// Review title
const review_title = cleanText($('.feedback-service-title.feedback-service-title-desktop').first().text());

// Review content
const review_content = cleanText($('#content div').first().text());

// Review date
const review_date = cleanText($('#createdAt div').first().text());

return {
  // product_title: product_title || null,
  // current_price: current_price,
  // original_price: original_price,
  // discount_percentage: discount_percentage || null,
  // brand: brand || null,
  // availability: availability || null,
  // delivery_info: delivery_info || null,
  // seller: seller || null,
  // product_type: product_type || null,
  // country_of_origin: country_of_origin || null,
  // product_image: product_image,
  // manufacturer: manufacturer || null,
  // net_quantity: net_quantity || null,
  similar_products: similar_products.length > 0 ? similar_products : null,
  // offers: offers.length > 0 ? offers : null,
  // review_title: review_title || null,
  // review_content: review_content || null,
  // review_date: review_date || null
};
