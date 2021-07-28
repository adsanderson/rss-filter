const Parser = require('rss-parser');
const xml2js = require('xml2js');

/**
 * @type import("@netlify/functions").Handler
 */
exports.handler = async (event, context) => {
    const parser = new Parser();
    const { feedUri, q } = event.queryStringParameters;
    console.log('feedUri', feedUri);
    console.log('query', q);

    try {
        const feed = await parser.parseURL(feedUri);
        console.log(feed.title);
        console.log('original number of items:', feed.items.length);

        feed.items = feed.items.filter(toItemContainsQuery);
        console.log('new number of items     :', feed.items.length);

        var builder = new xml2js.Builder();
        var xml = builder.buildObject(feed);

        return {
            statusCode: 200,
            body: xml
        };
    } catch (err) {
        console.log('Error:', err)
    }

    return {
        statusCode: 500,
        body: "Error"
    };
};

function toItemContainsQuery(item) {
    return item.title.toLowerCase().includes(q.toLowerCase())
        || item.summary.toLowerCase().includes(q.toLowerCase());
}
