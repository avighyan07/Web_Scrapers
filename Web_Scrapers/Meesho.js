
//interaction code



navigate(input.url);

// Wait for the main product title to load
wait('h1.sc-eDvSVe.fhfLdV', {timeout: 10000});

// Wait for price information to load
wait('h4.sc-eDvSVe.biMVPh', {timeout: 10000});

// Wait for rating information to load
wait('span.sc-eDvSVe.laVOtN', {timeout: 10000});

// Scroll to action buttons to ensure they're visible
scroll_to('span.sc-eDvSVe.eEiZjr');

// Collect the parsed data
collect(parse());








// parser code




// Helper function to extract numeric value from price text
// function extractPrice(priceText) {
//   if (!priceText) return null;
//   const match = priceText.match(/₹(\d+)/);
//   return match ? parseInt(match[1]) : null;
// }

// Helper function to extract numeric value from rating count text
function extractRatingCount(text) {
  if (!text) return null;
  const match = text.match(/(\d+(?:,\d+)*)/);
  return match ? parseInt(match[1].replace(/,/g, '')) : null;
}

// Helper function to create Money object
// function createMoney(amount, currency = 'INR') {
//   return amount ? new Money(amount, currency) : null;
// }

// Extract product title
const product_title = $('h1.sc-eDvSVe.fhfLdV').text().trim() || null;
function extractPrice(text) {
    if (!text) return null;
    const match = text.replace(/,/g, '').match(/₹(\d+)/);
    return match ? new Money(parseInt(match[1]), 'INR') : null;
}
function getText(selector) {
    return $(selector).text().trim() || null;
}
//const current_price = extractPrice(getText('h4.sc-eDvSVe'));

// Extract current price
const currentPriceText = $('h4.sc-eDvSVe.biMVPh').text().trim();
const current_price = createMoney(extractPrice(currentPriceText));

// Extract original price
const originalPriceText = $('p.sc-eDvSVe.gQDOBc.sc-jSUZER.eSuFsQ.ShippingInfo__ParagraphBody2StrikeThroughStyled-sc-frp12n-3.dMCitE').text().trim();
const original_price = createMoney(extractPrice(originalPriceText));

// Extract discount percentage
const discount_percentage = $('span.sc-eDvSVe.dOqdSt').text().trim() || null;

// Extract rating (first occurrence is the product rating)
const ratingText = $('span.sc-eDvSVe.laVOtN').first().text().trim();
const rating = ratingText ? parseFloat(ratingText) : null;

// Extract rating count from the reviews text
const reviewsText = $('span.sc-eDvSVe.eOvght.ShippingInfo__OverlineStyled-sc-frp12n-4.bfIZVF').text().trim();
const rating_count = extractRatingCount(reviewsText);

// Extract delivery info
const delivery_info = $('span.sc-eDvSVe.fkvMlU').first().text().trim() || null;

// Extract deal timer
const deal_timer = $('span.sc-eDvSVe.dURizl.OfferTimer__Subtitle2Styled-sc-dfvdiq-1.jFYRpH').text().trim() || null;

// Extract product images
const product_images = [];
$('img.AvifImage__ImageWrapper-sc-1055enk-0[data-testid="product-images"]').each(function() {
  const src = $(this).attr('src');
  if (src) {
    // Convert to higher resolution image
    const highResSrc = src.replace(/width=\d+/, 'width=512');
    product_images.push(new Image(highResSrc));
  }
});

// Extract seller name
const seller_name = $('span.sc-eDvSVe.dpdDrR.ShopCardstyled__ShopName-sc-du9pku-6.bdcHGu').text().trim() || null;

// Extract seller rating
const sellerRatingText = $('span.sc-eDvSVe.jkpPSq').text().trim();
const seller_rating = sellerRatingText ? parseFloat(sellerRatingText) : null;

// Extract seller rating count
const sellerRatingCountText = $('span.sc-eDvSVe.YtJFx').first().text().trim();
const seller_rating_count = extractRatingCount(sellerRatingCountText);

// Extract similar products info
const similar_products = $('h6.sc-eDvSVe.cGUUOO').first().text().trim() || null;

// Extract product type and color from title
const product_type = product_title ? product_title.replace(/GESPO\s*/i, '').trim() : null;
const colorMatch = product_title ? product_title.match(/\b(Navy Blue|Blue|Red|Green|Black|White|Yellow|Pink|Purple|Orange|Grey|Gray)\b/i) : null;
const product_color = colorMatch ? colorMatch[1] : null;

// Extract action buttons
const action_buttons = [];
$('span.sc-eDvSVe.eEiZjr, span.sc-eDvSVe.fpkPeP').each(function() {
  const buttonText = $(this).text().trim();
  if (buttonText && (buttonText === 'Add to Cart' || buttonText === 'Buy Now')) {
    action_buttons.push(buttonText);
  }
});

return {
  product_title,
  current_price,
  original_price,
  discount_percentage,
  rating,
  rating_count,
  delivery_info,
  deal_timer,
  product_images,
  seller_name,
  seller_rating,
  seller_rating_count,
  similar_products,
  product_type,
  product_color,
  action_buttons
};
