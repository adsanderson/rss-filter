let Parser = require('rss-parser');

/**
 * @type import("@netlify/functions").Handler
 */
exports.handler = async (event, context) => {
    const parser = new Parser();
    const { feed, q } = event.queryStringParameters;
    console.log('feed', feed);
    console.log('query', q);
    try {
        const feed = await parser.parseURL(feed);
        console.log(feed.title);
    } catch (err) {
        console.error('Failed to parse:', err);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello World" }),
    };
};
