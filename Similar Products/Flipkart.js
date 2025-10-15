//interaction code

// Navigate to Flipkart homepage
navigate(input.url);

// Wait for the page to load - wait for product links to appear
wait('a[href]', {
  timeout: 30000
});

// Scroll to load more content
scroll_to('bottom');

// Parse the page to extract all product URLs
const data = parse();

// Collect all URLs using next_stage
for (let url of data.urls) {
  next_stage({
    url: url
  });
}

// Use collect to finalize the data collection






// parser code




// Extract all product links from the page
const base_url = 'https://www.flipkart.com';

// Function to convert relative URLs to absolute URLs
const to_absolute_url = (href) => {
    try {
        if (href.startsWith('http')) {
            return href;
        }
        return new URL(href, base_url).href;
    } catch (e) {
        return null;
    }
};

// Collect all unique product URLs
let product_urls = new Set();

// Method 1: Find all links with /p/ (individual product pages)
$('a[href*="/p/"]').each(function() {
    const href = $(this).attr('href');
    if (href) {
        const absolute_url = to_absolute_url(href);
        if (absolute_url) {
            product_urls.add(absolute_url);
        }
    }
});

// Method 2: Find all links with /pr? (product listing pages)
$('a[href*="/pr?"]').each(function() {
    const href = $(this).attr('href');
    if (href) {
        const absolute_url = to_absolute_url(href);
        if (absolute_url) {
            product_urls.add(absolute_url);
        }
    }
});

// Method 3: Find category links (mobiles, cameras, etc.)
$('a[href*="/mobiles/"], a[href*="/cameras/"], a[href*="/jewellery/"], a[href*="/furniture/"], a[href*="/audio-video/"]').each(function() {
    const href = $(this).attr('href');
    if (href) {
        const absolute_url = to_absolute_url(href);
        if (absolute_url) {
            product_urls.add(absolute_url);
        }
    }
});

// Method 4: Find store links
$('a[href*="-store"]').each(function() {
    const href = $(this).attr('href');
    if (href) {
        const absolute_url = to_absolute_url(href);
        if (absolute_url) {
            product_urls.add(absolute_url);
        }
    }
});

// Convert Set to Array
const urls = Array.from(product_urls);

console.log(`Found ${urls.length} unique product URLs`);

return {
    urls: urls
};
