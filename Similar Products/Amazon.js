//interaction code
let url = new URL(input.url);
url.searchParams.set('th', '1');
url.searchParams.set('psc', '1');
if (!/\/dp\//.test(url.toString()))
    bad_input('Input URL is not link to product.');

close_popup('#sp-cc-accept', '#sp-cc-accept');
detect_block({selector: '#captchacharacters'}, {exists: true});
detect_block({selector: '[action="/errors/validateCaptcha"]'}, {exists: true});

navigate(url.href, {referer: 'https://www.google.com/'});
wait_any(['[href="/ref=cs_503_link"]', '#productTitle', '#dpSorryPage',
    '#captchacharacters', '[action="/errors/validateCaptcha"]']);
if (el_exists('[href="/ref=cs_503_link"]'))
    throw Error("Sorry! Something went wrong on our end. Please go back and try again or go to Amazon's home page.");
if (el_exists('#dpSorryPage'))
    throw Error('Failed loading page by Amazon internal error (#dpSorryPage)');

el_exists('#sp_detail2', 10e3);

data.push(...parse())
// START: New code to click the carousel 'next' button
// =======================================================
// const nextButtonSelector = '#sp_detail2 .a-carousel-goto-nextpage';
// const maxClicks = 3; 

// console.log('Checking for related products carousel...');
// data = []
// for (let i = 0; i < maxClicks; i++) {
//     data.push(...parse())
//     console.log(data)
//     // Check if the next button exists and is not disabled (aria-disabled="false")
//     if (el_exists(`${nextButtonSelector}:not([aria-disabled="true"])`)) {
//         console.log(`Clicking carousel next button: Attempt #${i + 1}`);
        
//         // Click the button to load the next set of products
//         click(nextButtonSelector);
        
//         // Wait for 2 seconds to allow the new items to load into the DOM.
//         // You may need to adjust this timing.
//         wait(2000); 
//     } else {
//         // If the button is disabled or gone, we've reached the end of the carousel
//         console.log('Carousel next button not available or disabled. Stopping.');
//         break;
//     }
// }
// =====================================================
// END: New code


// Collect the data after all clicks are performed
return data;



// parser code

const related_products = [];

// The main container for the "Products related to this item" carousel
const carouselSelector = '#sp_detail2';

// Each product is within an 'li' element with the class 'a-carousel-card'
const productSelector = `${carouselSelector} li.a-carousel-card`;

// Select all product cards within the carousel
const productCards = $(productSelector);

// If no product cards are found, return an empty array
if (productCards.length === 0) {
    console.log('No related products found in the carousel.');
    return [];
}

// Iterate over each product card to extract its details
productCards.each((index, element) => {
    const productEl = $(element);
    
    // Skip empty carousel cards if any exist
    if (productEl.find('div[data-asin]').length === 0) {
        return; // 'continue' to the next iteration
    }

    // --- Data Extraction ---

    // 1. Extract the ASIN
    const asin = productEl.find('div[data-asin]').attr('data-asin');

    // 2. Extract Title and URL from the main product link
    const linkElement = productEl.find('a.a-link-normal').first();
    const title = linkElement.attr('title')?.trim();
    const productPath = linkElement.attr('href');
    const url = productPath ? `https://www.amazon.in${productPath}` : null;

    // 3. Extract Image URL
    const imageUrl = productEl.find('img').attr('src');

    // 4. Extract Price and Original Price
    const price = productEl.find('.a-price .a-offscreen').first().text()?.trim();
    const originalPrice = productEl.find('.a-text-price .a-offscreen').text()?.trim();
    
    // 5. Extract Rating and Reviews Count
    const reviewElement = productEl.find('.adReviewLink');
    const ratingText = reviewElement.attr('aria-label');
    
    let rating = null;
    if (ratingText) {
        // Extracts the numeric rating from a string like "3.7 out of 5 stars"
        const ratingMatch = ratingText.match(/(\d\.?\d*)\sout\sof/);
        if (ratingMatch) {
            rating = parseFloat(ratingMatch[1]);
        }
    }
    
    const reviewsCountText = reviewElement.find('.a-color-link').text()?.trim().replace(/,/g, '');
    const reviews_count = reviewsCountText ? parseInt(reviewsCountText, 10) : null;

    // --- Assemble the Product Object ---

    // Only add the product if essential information was found
    if (asin && title) {
        related_products.push({
            asin: asin,
            title: title,
            url: url,
            image_url: imageUrl,
            price: price,
            original_price: originalPrice || null,
            rating: rating,
            reviews_count: reviews_count,
        });
    }
});

// Return the final array of scraped product objects
return related_products;
