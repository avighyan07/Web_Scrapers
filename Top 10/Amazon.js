//interaction code

// Navigate to Amazon India homepage
navigate(input.url);

// Check if keyword is provided in input
if (!input.keyword) {
  bad_input('No keyword provided. Please provide a keyword in input.keyword');
}

// Wait for the search box to be ready
const search_box_selector = '#twotabsearchtextbox';
const search_button_selector = '#nav-search-submit-button';
wait(search_box_selector);

// Type the keyword into the search box
type(search_box_selector, input.keyword);

// Click the search button
click(search_button_selector);

// Wait for search results to load
const search_results_selector = '[data-component-type="s-search-result"]';
wait(search_results_selector, {
  timeout: 30000
});

// Check for captcha or blocking
if (el_exists('form[action*="validateCaptcha"]')) {
  blocked('Captcha detected');
}

// Scroll to load more results if lazy loading is present
scroll_to('bottom');

// Parse the search results and collect product URLs
const {
  product_urls
} = parse();
console.log(`Found ${product_urls.length} products for keyword: ${input.keyword}`);

// Collect each product URL using next_stage
for (let url of product_urls) {
  next_stage({
    url: url
  });
}

//parser code

// Extract product URLs from search results
const product_urls = [];

// Method 1: Find products using data-component-type attribute
$('[data-component-type="s-search-result"]').each(function() {
    const link = $(this).find('h2 a.a-link-normal').attr('href');
    if (link) {
        // Convert relative URL to absolute URL
        const absolute_url = new URL(link, location.href).href;
        product_urls.push(absolute_url);
    }
});

// Method 2: Alternative selector if first method doesn't work
if (product_urls.length === 0) {
    $('[data-asin]:not([data-asin=""])').each(function() {
        const link = $(this).find('a[href*="/dp/"]').first().attr('href');
        if (link) {
            const absolute_url = new URL(link, location.href).href;
            product_urls.push(absolute_url);
        }
    });
}

// Method 3: Look for any product links with /dp/ pattern
if (product_urls.length === 0) {
    $('a[href*="/dp/"]').each(function() {
        const href = $(this).attr('href');
        if (href && href.includes('/dp/')) {
            const absolute_url = new URL(href, location.href).href;
            product_urls.push(absolute_url);
        }
    });
}

// Remove duplicates
const unique_urls = [...new Set(product_urls)];

console.log(`Extracted ${unique_urls.length} unique product URLs`);

return {
    product_urls: unique_urls
};