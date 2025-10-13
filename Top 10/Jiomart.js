//interaction code
navigate(input.url);
const search_input_selector = '#autocomplete-0-input';
const product_link_selector = 'a.plp-card-wrapper[href*="/p/"]';
const search_results_selector = '.ais-InfiniteHits-item';
wait(search_input_selector, {
  timeout: 30000
});
if (!input.keyword) {
  bad_input('Search keyword is required. Please provide input.keyword');
}
console.log('Searching for:', input.keyword);
type(search_input_selector, input.keyword, {
  submit: true
});
wait(product_link_selector, {
  timeout: 60000
});
wait(search_results_selector, {
  timeout: 60000
});
const scroll_count = 3;
for (let i = 0; i < scroll_count; i++) {
  console.log(`Scrolling ${i + 1}/${scroll_count}`);
  scroll_to('bottom');
  wait(product_link_selector, {
    timeout: 10000
  });
}
const data = parse();
if (!data.product_urls || data.product_urls.length === 0) {
  dead_page('No products found for the search keyword: ' + input.keyword);
}
console.log(`Found ${data.product_urls.length} products`);
const max_products = Math.min(data.product_urls.length, 10);
for (let i = 0; i < max_products; i++) {
  const product_url = data.product_urls[i];
  console.log(`Collecting product ${i + 1}: ${product_url}`);
  next_stage({
    url: product_url
  });
}

// parser code

// Extract product URLs from the search results page
const product_links = [];

// Base URL for JioMart
const base_url = 'https://www.jiomart.com';

// Find all product links - JioMart uses a.plp-card-wrapper with href containing "/p/"
$('a.plp-card-wrapper[href*="/p/"]').each(function() {
    const href = $(this).attr('href');
    if (href) {
        // Convert relative URLs to absolute URLs
        let full_url = href;
        
        if (href.startsWith('/')) {
            full_url = base_url + href;
        } else if (!href.startsWith('http')) {
            full_url = base_url + '/' + href;
        }
        
        // Add to list
        product_links.push(full_url);
    }
});

// Remove duplicates by converting to Set and back to Array
const unique_product_urls = [...new Set(product_links)];

console.log(`Extracted ${unique_product_urls.length} unique product URLs`);

return {
    product_urls: unique_product_urls
};