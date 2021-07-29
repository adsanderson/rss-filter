import type { RequestHandler } from '@sveltejs/kit';
import xml2js from 'xml2js';
import fetch from 'node-fetch';

type Feed = {
	rss: {
		channel: {
			title: string;
			item: {
				title: string[];
				description: string[];
			}[];
		}[];
	};
};

/**
 * @type import("@netlify/functions").Handler
 */
export const get: RequestHandler = async (request) => {
	// const parser = new Parser();

	const feedUri = request.query.get('feedUri');
	const q = request.query.get('q');

	console.info('feedUri', feedUri);
	console.info('query', q);

	const toItemContainsQuery = (item) => toItemContain(q, item);

	try {
		const response = await fetch(feedUri);
		const xmlFeed = await response.text();
		const feed = (await parseFeed(xmlFeed)) as Feed;

		const channel = feed.rss.channel[0];

		console.info('original title:', channel.title);
		channel.title = `${channel.title} - Filtered to ${q}`;
		console.info('new title     :', channel.title);

		console.info('original number of items:', channel.item.length);

		// console.info(channel.item[0])

		channel.item = channel.item.filter(toItemContainsQuery);
		console.info('new number of items     :', channel.item.length);

		const builder = new xml2js.Builder();
		const xml = builder.buildObject(feed);

		return {
			statusCode: 200,
			body: xml
		};
	} catch (err) {
		console.error('Error:', err);
	}

	return {
		statusCode: 500,
		body: 'Error'
	};
};

function toItemContain(q, item) {
	// console.info('title', item.title)
	// console.info('description', item.description)
	return (
		(item.title[0] && item.title[0].toLowerCase().includes(q.toLowerCase())) ||
		(item.description[0] && item.description[0].toLowerCase().includes(q.toLowerCase()))
	);
}

async function parseFeed(xml) {
	return new Promise((resolve) => {
		xml2js.parseString(xml, function (err, result) {
			resolve(result);
		});
	});
}
