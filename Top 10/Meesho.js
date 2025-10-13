//interaction code

// Navigate to Meesho homepage
navigate(input.url);

// Wait for the page to load
const search_input_selector = 'input.search-input-elm';
const product_link_selector = '.ProductListItem__GridCol-sc-1baba2g-0 a';

// Check if we have a search keyword from input
if (input.keyword) {
  // Wait for search input to be visible
  wait_visible(search_input_selector);

  // Click on search input
  click(search_input_selector);

  // Type the search keyword
  type(search_input_selector, input.keyword);

  // Press Enter to search
  press_key('Enter');

  // Wait for search results to load
  wait(product_link_selector, {
    timeout: 30000
  });
} else {
  // If no keyword, just wait for products on homepage
  wait(product_link_selector, {
    timeout: 30000
  });
}

// Scroll to load more products if needed
scroll_to('bottom');

// Parse the page to get product URLs
const data = parse();

// Limit to top 10 products
const products_to_collect = data.product_urls.slice(0, 10);
console.log(`Found ${data.product_urls.length} products, collecting top 10`);

// Collect each product URL using next_stage
for (let product_url of products_to_collect) {
  next_stage({
    url: product_url
  });
}









// parser code

// Extract all product links from the page
const product_links = $('.ProductListItem__GridCol-sc-1baba2g-0 a[href*="/p/"]');

console.log(`Found ${product_links.length} product links on page`);

const product_urls = [];

// Extract href from each product link
product_links.each(function() {
    const href = $(this).attr('href');
    if (href) {
        // Convert relative URL to absolute URL
        const absolute_url = new URL(href, 'https://www.meesho.com').href;
        product_urls.push(absolute_url);
    }
});

// Remove duplicates
const unique_urls = [...new Set(product_urls)];

console.log(`Extracted ${unique_urls.length} unique product URLs`);

return {
    product_urls: unique_urls
};





