//interaction code
// Navigate to the product page
navigate(input.url);

// Wait for key elements to load
wait('#productTitle', {timeout: 30000});
wait('#bylineInfo', {timeout: 10000});
wait('.a-price .a-offscreen', {timeout: 10000});

// Wait for images to load
wait('#imageBlock img', {timeout: 10000});

// Scroll to ensure all content is loaded
scroll_to('#productDescription');
if (el_exists('#productFactsDesktopExpander')) {
  scroll_to('#productFactsDesktopExpander');
}

// Collect the parsed data
collect(parse());

// parser code
// Helper function to extract price value
const extractPrice = (priceText) => {
  if (!priceText) return null;
  const match = priceText.replace(/,/g, '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
};

// Helper function to get currency
const getCurrency = () => {
  const priceElement = $('.a-price .a-offscreen').first().text();
  if (priceElement.includes('₹')) return 'INR';
  return 'INR'; // Default for Amazon India
};

// Product Title
const product_title = $('#productTitle').text().trim() || null;

// Brand
const brand = $('#bylineInfo').text().replace('Visit the', '').replace('Store', '').trim() || null;

// Current Price
const currentPriceText = $('.a-price.aok-align-center .a-offscreen').eq(1).text() || 
                         $('.priceToPay .a-offscreen').first().text() ||
                         $('.a-price .a-offscreen').first().text();
const currentPriceValue = extractPrice(currentPriceText);
const currency = getCurrency();
const current_price = currentPriceValue ? new Money(currentPriceValue, currency) : null;

// Original Price
const originalPriceText = $('.a-price[data-a-strike="true"] .a-offscreen').first().text();
const originalPriceValue = extractPrice(originalPriceText);
const original_price = originalPriceValue ? new Money(originalPriceValue, currency) : null;

// Discount Percentage
const discount_percentage = $('.savingsPercentage').text().trim() || null;

// Rating
const ratingText = $('#acrPopover .a-icon-alt').first().text();
const rating = ratingText ? parseFloat(ratingText.match(/[\d.]+/)?.[0]) : null;

// Review Count
const reviewText = $('[data-hook="total-review-count"]').text();
const review_count = reviewText ? parseInt(reviewText.replace(/[^\d]/g, '')) : null;

// Product Images
const product_images = [];
$('#altImages ul li img').each((i, el) => {
  const src = $(el).attr('src');
  if (src && src.includes('media-amazon') && !src.includes('icon') && !src.includes('360_icon')) {
    // Get high-res version
    const highResSrc = src.replace(/_SX\d+_SY\d+_CR.*?\.jpg/, '._SL1500_.jpg')
                          .replace(/_AC_.*?\.jpg/, '._SL1500_.jpg');
    product_images.push(new Image(highResSrc));
  }
});

// Main product image
const mainImage = $('#landingImage').attr('data-old-hires') || $('#imgTagWrapperId img').attr('data-old-hires') || $('#landingImage').attr('src') || $('#imgTagWrapperId img').attr('src');
if (mainImage && product_images.length === 0) {
  product_images.push(new Image(mainImage));
}

// Available Sizes
const available_sizes = [];
$('#native_dropdown_selected_size_name option').each((i, el) => {
  const size = $(el).text().trim();
  if (size && size !== 'Select') {
    available_sizes.push(size);
  }
});

// Available Colors - get from selection span (current color)
const available_colors = [];
const currentColor = $('#variation_color_name .selection').text().trim();
if (currentColor) {
  available_colors.push(currentColor);
}

// Product Description
const product_description = $('#productDescription p').text().trim() || 
                           $('#productDescription').text().trim() || null;

// Product Features - from "About this item" section
const product_features = [];
$('#productFactsDesktopExpander .product-facts-detail').each((i, el) => {
  const label = $(el).find('.a-col-left .a-color-base').text().trim();
  const value = $(el).find('.a-col-right .a-color-base').text().trim();
  if (label && value) {
    product_features.push(`${label}: ${value}`);
  }
});

// In Stock
const availabilityText = $('#availability span').text().trim().toLowerCase();
const in_stock = availabilityText.includes('in stock');

// Delivery Info
const delivery_info = $('#mir-layout-DELIVERY_BLOCK').text().trim() || null;

// Seller Name - FIX: Use .first() to get only the first matching element
const seller_name = $('#sellerProfileTriggerId').first().text().trim() || null;

// Return Policy
const return_policy = $('[data-name="RETURNS_POLICY"] .icon-content').text().trim() || 
                      $('[data-name="RETURNS_POLICY"]').text().trim() || null;

// Product Specifications
const product_specifications = {
  material: null,
  fit_type: null,
  sleeve_type: null,
  neck_style: null
};

$('#productFactsDesktopExpander .product-facts-detail').each((i, el) => {
  const label = $(el).find('.a-col-left .a-color-base').text().trim().toLowerCase();
  const value = $(el).find('.a-col-right .a-color-base').text().trim();
  
  if (label.includes('material') || label.includes('composition')) {
    product_specifications.material = value;
  } else if (label.includes('fit')) {
    product_specifications.fit_type = value;
  } else if (label.includes('sleeve')) {
    product_specifications.sleeve_type = value;
  } else if (label.includes('collar') || label.includes('neck')) {
    product_specifications.neck_style = value;
  }
});

// Similar Products
const similar_products = [];
$('.a-carousel-card').each((i, el) => {
  const title = $(el).find('.sponsored-products-truncator-truncated').text().trim() ||
                $(el).find('.a-truncate-full').text().trim();
  const priceText = $(el).find('.a-price .a-offscreen').first().text();
  const imageUrl = $(el).find('img[src*="media-amazon"]').first().attr('src');
  const productUrl = $(el).find('a[href*="/dp/"]').first().attr('href');
  
  if (title && imageUrl && !imageUrl.includes('IconFarm')) {
    const priceValue = extractPrice(priceText);
    similar_products.push({
      title: title,
      price: priceValue ? new Money(priceValue, currency) : null,
      image: new Image(imageUrl.replace(/_AC_.*?\.jpg/, '._AC_SR300,300_.jpg')),
      url: productUrl ? new URL(productUrl, location.href) : null
    });
  }
});

// Return the complete data object
return {
  product_title,
  brand,
  current_price,
  original_price,
  discount_percentage,
  rating,
  review_count,
  product_images,
  available_sizes,
  available_colors,
  product_description,
  product_features,
  in_stock,
  delivery_info,
  seller_name,
  return_policy,
  product_specifications,
  similar_products
};
