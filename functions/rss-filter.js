const xml2js = require('xml2js');
const fetch = require('node-fetch');

/**
 * @type import("@netlify/functions").Handler
 */
exports.handler = async (event, context) => {
    // const parser = new Parser();
    const { feedUri, q } = event.queryStringParameters;
    console.info('feedUri', feedUri);
    console.info('query', q);


    const toItemContainsQuery = (item) => toItemContain(q, item);

    try {
        const response = await fetch(feedUri)
        const xmlFeed = await response.text()
        const feed = await parseFeed(xmlFeed)

        console.log('feed', feed);

        console.log('title', feed.rss.channel[0])
        // const feed = rss.channel

        // console.info(feed.title);
        // console.info('original number of items:', feed.item.length);

        // feed.items = feed.items.filter(toItemContainsQuery);
        // console.info('new number of items     :', feed.items.length);

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
    console.info('content', item.content)
    return (item.title && item.title.toLowerCase().includes(q.toLowerCase()))
        || (item.content && item.content.toLowerCase().includes(q.toLowerCase()));
}

async function parseFeed(xml) {
    return new Promise(resolve => {
        xml2js.parseString(xml, function (err, result) {
            resolve(result);
        });
    })
}