const Parser = require('rss-parser');
const xml2js = require('xml2js');

/**
 * @type import("@netlify/functions").Handler
 */
exports.handler = async (event, context) => {
    const parser = new Parser();
    const { feedUri, q } = event.queryStringParameters;
    console.info('feedUri', feedUri);
    console.info('query', q);

    const toItemContainsQuery = (item) => toItemContain(q, item);

    try {
        const feed = await parser.parseURL(feedUri);
        console.info(feed.title);
        console.info('original number of items:', feed.items.length);

        feed.items = feed.items.filter(toItemContainsQuery);
        console.info('new number of items     :', feed.items.length);

        var builder = new xml2js.Builder();
        var xml = builder.buildObject(feed);

        return {
            statusCode: 200,
            body: xml
        };
    } catch (err) {
        console.error('Error:', err)
    }

    return {
        statusCode: 500,
        body: "Error"
    };
};

function toItemContain(q, item) {
    console.info('title', item.title)
    console.info('summary', item.summary)
    return (item.title && item.title.toLowerCase().includes(q.toLowerCase()))
        || (item.summary && item.summary.toLowerCase().includes(q.toLowerCase()));
}
