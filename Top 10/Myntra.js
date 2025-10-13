//interaction code
navigate(input.url || 'https://www.myntra.com/');
if (!input.keyword) {
  bad_input('Please provide a keyword to search for products');
}
const search_input_selector = 'input.desktop-searchBar';
const search_button_selector = 'a.desktop-submit';
const product_list_selector = 'ul.results-base li';
wait(search_input_selector, {
  timeout: 30000
});
click(search_input_selector);
type(search_input_selector, input.keyword, {
  replace: true
});
click(search_button_selector);
wait(product_list_selector, {
  timeout: 60000
});
const data = parse();
if (!data.product_urls || data.product_urls.length === 0) {
  dead_page('No products found for the given keyword');
}
console.log(`Found ${data.product_urls.length} products`);
const top_10_products = data.product_urls.slice(0, 10);
for (let product_url of top_10_products) {
  next_stage({
    url: product_url
  });
}










// parser code



// Extract product URLs from the search results page
const base_url = 'https://www.myntra.com';

// Find all product list items
const product_items = $('ul.results-base li[id]');

console.log(`Found ${product_items.length} product items on page`);

const product_urls = [];

// Extract href from each product link
product_items.each(function() {
    const link = $(this).find('a[href*="/buy"]').attr('href');
    if (link) {
        // Convert relative URL to absolute URL
        const absolute_url = link.startsWith('http') ? link : base_url + '/' + link.replace(/^\//, '');
        product_urls.push(absolute_url);
    }
});

console.log(`Extracted ${product_urls.length} product URLs`);

return {
    product_urls: product_urls
};
