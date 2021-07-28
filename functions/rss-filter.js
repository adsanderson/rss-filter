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

    const feed = await parser.parseURL(feedUri);
    console.log(feed.title);
    console.log('original number of items:', feed.items.length);

    feed.items = feed.items.filter(item => item.title.toLowerCase().includes(q.toLowerCase()));
    console.log('new number of items     :', feed.items.length);

    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);

    return {
        statusCode: 200,
        body: xml
    };
};
