import Parser from 'rss-parser';

const parser = new Parser();

/**
 * @type import("@netlify/functions").Handler
 */
const handler = async (event, context) => {
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

export { handler };
