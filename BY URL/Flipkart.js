
//interaction code


navigate(input.url);
collect(parse());






// parser code



// Helper function to extract text safely
function getText(selector) {
    return $(selector).text().trim() || null;
}

// Helper function to extract number from text
function extractNumber(text) {
    if (!text) return null;
    const match = text.replace(/,/g, '').match(/\d+/);
    return match ? parseInt(match[0]) : null;
}

// Helper function to extract price
function extractPrice(text) {
    if (!text) return null;
    const match = text.replace(/,/g, '').match(/₹(\d+)/);
    return match ? new Money(parseInt(match[1]), 'INR') : null;
}

// Extract product title
const product_title = getText('span.VU-ZEz') || getText('h1._6EBuvT');

// Extract brand
const brand = getText('span.mEh187');

// Extract prices
const current_price = extractPrice(getText('div.Nx9bqj'));
const original_price = extractPrice(getText('div.yRaY8j'));

// Extract discount
const discount_percentage = getText('div.UkUFwK span') || getText('div.UkUFwK');

// Extract rating - get the first rating number
const ratingText = getText('div.XQDdHH');
const rating = ratingText ? parseFloat(ratingText.match(/\d+(\.\d+)?/)?.[0]) : null;

// Extract rating count from the ratings and reviews text
const ratingsText = getText('span.Wphh3N span');
let rating_count = null;
if (ratingsText) {
    const match = ratingsText.match(/(\d{1,2},?\d{1,2},?\d{3})\s+ratings/);
    if (match) {
        rating_count = parseInt(match[1].replace(/,/g, ''));
    }
}

// Extract available colors
const available_colors = $('div.V3Zflw.QX54-Q.E1E-3Z.dpZEpc').toArray().map(el => $(el).text().trim()).filter(color => color);

// Extract available sizes
const available_sizes = $('li[id*="swatch"][id*="size"] a').toArray().map(el => $(el).text().trim()).filter(size => size);

// Extract product images
const product_images = $('img._0DkuPH').toArray().map(el => {
    const src = $(el).attr('src');
    return src ? new Image(src) : null;
}).filter(img => img);

// Extract seller name - get the first span inside sellerName
const seller_name = $('#sellerName span').first().text().trim() || 'MENSABRANDS';

// Extract highlights from specifications
const highlights = [];
$('div.sBVJqn .row').toArray().forEach(row => {
    const key = $(row).find('._9NUIO9').text().trim();
    const value = $(row).find('.-gXFvC').text().trim();
    if (key && value) {
        if (key === 'Fit') highlights.push(`Fit: ${value}`);
        if (key === 'Pattern') highlights.push(`Pattern: ${value}`);
        if (key === 'Fabric') highlights.push(`Fabric: ${value}`);
    }
});

// Extract specifications from the product details section
const specifications = [];
const generalSpecs = [];
const fabricSpecs = [];

$('div.sBVJqn .row').toArray().forEach(row => {
    const key = $(row).find('._9NUIO9').text().trim();
    const value = $(row).find('.-gXFvC').text().trim();
    if (key && value) {
        if (['Pattern', 'Suitable For', 'Closure', 'Collar', 'Hem', 'Reversible'].includes(key)) {
            generalSpecs.push({ key, value });
        } else if (['Fabric', 'Fabric Care', 'Sleeve'].includes(key)) {
            fabricSpecs.push({ key, value });
        }
    }
});

if (generalSpecs.length > 0) {
    specifications.push({
        specification_name: "General",
        specification_details: generalSpecs
    });
}

if (fabricSpecs.length > 0) {
    specifications.push({
        specification_name: "Fabric",
        specification_details: fabricSpecs
    });
}

// Extract delivery info
const delivery_info = getText('div.hVvnXm') || 'Delivery by 10 Oct, Friday';

// Extract return policy
const return_policy = getText('div.YhUgfO') || '10 Days Return Policy';

// Extract reviews
const reviews = $('div.RHRPPX.lUqdSE').toArray().slice(0, 5).map(el => {
    const reviewerName = $(el).find('span.BdKevg').text().trim() || 'Anonymous';
    const reviewText = $(el).parent().find('div._11pzQk').text().trim() || '';
    const reviewerType = $(el).find('span:contains("Certified Buyer")').length > 0 ? 'Certified Buyer' : '';
    const helpfulVotes = parseInt($(el).find('span.tl9VpF').first().text().replace(/,/g, '')) || 0;
    
    return {
        reviewer_name: reviewerName,
        review_text: reviewText,
        reviewer_type: reviewerType,
        helpful_votes: helpfulVotes
    };
}).filter(review => review.reviewer_name || review.review_text);

// Extract questions and answers
const questions_answers = $('div.BZMA\\+t.lUqdSE').toArray().slice(0, 5).map(el => {
    const questionText = $(el).find('span:contains("Q:")').parent().text().replace('Q:', '').trim();
    const answerText = $(el).find('span:contains("A:")').parent().text().replace('A:', '').trim();
    
    return {
        question: questionText,
        answer: answerText
    };
}).filter(qa => qa.question && qa.answer);

return {
    product_title,
    brand,
    current_price,
    original_price,
    discount_percentage,
    rating,
    rating_count,
    // available_colors,
    // available_sizes,
    product_images,
    // seller_name,
    // highlights,
    // specifications,
    // delivery_info,
    // return_policy,
    // reviews,
    // questions_answers
};