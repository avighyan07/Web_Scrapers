//interaction code

// Navigate to the URL
navigate(input.url);

// Wait for key product elements to load
wait('.ProductDesktopImage__ImageWrapperDesktop-sc-8sgxcr-0', {timeout: 30000});
wait('.ProductDescription__DetailsCardStyled-sc-1l1jg0i-0', {timeout: 30000});

// Collect the parsed data
collect(parse());





// parser code

// Helper function to clean text
const cleanText = (text) => (text || '').trim();

// Helper function to extract number from text
const extractNumber = (text) => {
  if (!text) return null;
  const match = text.match(/[\d,]+/);
  return match ? parseFloat(match[0].replace(/,/g, '')) : null;
};

// Extract product name from breadcrumb (last item) or product details
const product_name = cleanText($('.Breadcrumb__BreadcrumbItemContainer-sc-z65ae4-0').last().text()) 
  || cleanText($('.ProductDescription__DetailsCardStyled-sc-1l1jg0i-0 p').first().text().replace('Name:', '').replace(/Name\s*:/, ''));

// Extract price
const priceText = cleanText($('h5.sc-eDvSVe.dwCrSh').first().text());
const priceValue = extractNumber(priceText);
const currency = priceText.match(/[^\d,.\s]+/)?.[0] || 'INR';
const price = priceValue ? new Money(priceValue, currency === '₹' ? 'INR' : currency) : null;

// Extract rating
const ratingText = cleanText($('.Rating__StyledPill-sc-12htng8-1 .sc-eDvSVe.laVOtN').first().text());
const rating = ratingText ? parseFloat(ratingText) : null;

// Extract review count from the text that contains "Ratings" and "Reviews"
const reviewElements = $('.sc-eDvSVe.XndEO').toArray();
let review_count = null;
for (let el of reviewElements) {
  const text = $(el).text();
  if (text.includes('Ratings') || text.includes('Reviews')) {
    const match = text.match(/(\d+)\s*(Ratings|Reviews)/);
    if (match) {
      review_count = parseInt(match[1]);
      break;
    }
  }
}

// Extract free delivery
const free_delivery = $('.sc-eDvSVe.fkvMlU').toArray().some(el => $(el).text().includes('Free Delivery'));

// Extract product images
const product_images = [];
$('.ProductDesktopImage__ImageWrapperDesktop-sc-8sgxcr-0 img').each((i, el) => {
  const src = $(el).attr('src');
  if (src && src.startsWith('http')) {
    product_images.push(new Image(src));
  }
});

// Extract similar products images
const similar_products = [];
$('.NewSimilarProductCarouse__ProductImage-sc-zmf4om-0 img').each((i, el) => {
  const src = $(el).attr('src');
  if (src && src.startsWith('http')) {
    similar_products.push(new Image(src));
  }
});

// Extract product details
const product_details = {};
const detailsElements = $('.ProductDescription__DetailsCardStyled-sc-1l1jg0i-0 p');

detailsElements.each((i, el) => {
  const text = cleanText($(el).text());
  
  if (text.includes('Saree Fabric:')) {
    product_details.saree_fabric = text.replace('Saree Fabric:', '').trim();
  } else if (text.includes('Blouse:') && !text.includes('Blouse Fabric:') && !text.includes('Blouse Pattern:')) {
    product_details.blouse = text.replace('Blouse:', '').trim();
  } else if (text.includes('Blouse Fabric:')) {
    product_details.blouse_fabric = text.replace('Blouse Fabric:', '').trim();
  } else if (text.includes('Pattern:') && !text.includes('Blouse Pattern:')) {
    product_details.pattern = text.replace('Pattern:', '').trim();
  } else if (text.includes('Blouse Pattern:')) {
    product_details.blouse_pattern = text.replace('Blouse Pattern:', '').trim();
  } else if (text.includes('Country of Origin:')) {
    product_details.country_of_origin = text.replace('Country of Origin:', '').trim();
  }
});

// Extract size
let size = null;
detailsElements.each((i, el) => {
  const text = cleanText($(el).text());
  if (text.includes('Free Size') && text.includes('Saree Length')) {
    size = text;
  }
});

// Extract seller name
const seller_name = cleanText($('.ShopCardstyled__ShopName-sc-du9pku-6').text());

// Extract action buttons
const action_buttons = [];
$('.ProductCard__WrapAction-sc-camkhj-3 button').each((i, el) => {
  const buttonText = cleanText($(el).text());
  if (buttonText) {
    action_buttons.push(buttonText);
  }
});

// Extract breadcrumb path
const breadcrumb_path = [];
$('.Breadcrumb__BreadcrumbItemContainer-sc-z65ae4-0').each((i, el) => {
  const text = cleanText($(el).text());
  if (text) {
    breadcrumb_path.push(text);
  }
});

// Return the structured data
return {
  // product_name,
  // price,
  // rating,
  // review_count,
  // free_delivery,
  // product_images,
  similar_products,
  // product_details,
  // size,
  // seller_name,
  // action_buttons,
  // breadcrumb_path
};