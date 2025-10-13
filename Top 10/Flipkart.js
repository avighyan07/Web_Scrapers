//interaction code
// Navigate to Flipkart homepage
navigate(input.url);

// Wait for the search input to be ready
const search_input_selector = 'input.Pke_EE';
const search_button_selector = 'button._2iLD__';
wait(search_input_selector);

// Check if keyword is provided in input
if (!input.keyword) {
  bad_input('Keyword is required. Please provide input.keyword');
}

// Type the search keyword
type(search_input_selector, input.keyword);

// Click the search button
click(search_button_selector);

// Wait for product listing page to load
const product_container_selector = 'div._75nlfW';
wait(product_container_selector, {
  timeout: 30000
});

// Parse the current page to get product URLs
let page_data = parse();

// Collect product URLs from the current page
if (page_data.product_urls && page_data.product_urls.length > 0) {
  console.log(`Found ${page_data.product_urls.length} products on current page`);
  for (let product_url of page_data.product_urls) {
    next_stage({
      url: product_url
    });
  }
} else {
  console.log('No products found on this page');
}

// Handle pagination - check if there's a next page button
const next_button_selector = 'nav a._9QVEpD';
if (el_exists(next_button_selector)) {
  console.log('Next page button found, navigating to next page');
  click(next_button_selector);

  // Wait for the next page to load
  wait(product_container_selector, {
    timeout: 30000
  });

  // Parse the next page
  let next_page_data = parse();
  if (next_page_data.product_urls && next_page_data.product_urls.length > 0) {
    console.log(`Found ${next_page_data.product_urls.length} products on next page`);
    for (let product_url of next_page_data.product_urls) {
      next_stage({
        url: product_url
      });
    }
  }
}
console.log('Finished collecting product URLs');










// parser code



// Extract product URLs from the listing page
const base_url = 'https://www.flipkart.com';

// Find all product links
const product_links = $('div._75nlfW a.CGtC98');

console.log(`Found ${product_links.length} product links`);

// Extract URLs
const product_urls = [];
product_links.each(function() {
    const href = $(this).attr('href');
    if (href) {
        // Convert relative URL to absolute URL
        const full_url = href.startsWith('http') ? href : base_url + href;
        product_urls.push(full_url);
    }
});

// Remove duplicates
const unique_urls = [...new Set(product_urls)];

console.log(`Extracted ${unique_urls.length} unique product URLs`);

return {
    product_urls: unique_urls
};