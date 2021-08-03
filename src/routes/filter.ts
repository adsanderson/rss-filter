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
		console.time('fetch feed');
		const response = await fetch(feedUri);
		const xmlFeed = await response.text();
		console.timeEnd('fetch feed');
		console.time('parse feed');
		const feed = (await parseFeed(xmlFeed)) as Feed;
		console.timeEnd('parse feed');
		const channel = feed.rss.channel[0];

		console.info('original title:', channel.title);
		channel.title = `${channel.title} - Filtered to ${q}`;
		console.info('new title     :', channel.title);

		console.info('original number of items:', channel.item.length);

		// console.info(channel.item[0])

		console.time('filter feed');
		channel.item = channel.item.filter(toItemContainsQuery);
		console.timeEnd('filter feed');
		console.info('new number of items     :', channel.item.length);

		const builder = new xml2js.Builder();
		const xml = builder.buildObject(feed);

		const minutes_30 = 60 * 30;

		const headers = {
			'Cache-Control': `max-age=${minutes_30}, s-max-age=${minutes_30 * 2}`,
			'Content-Type': 'application/xml'
		};

		return {
			statusCode: 200,
			headers,
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
	const query = new RegExp(q, 'i');
	return (
		(item.title[0] && query.test(item.title[0])) ||
		(item.description[0] && query.test(item.description[0]))
	);
}

async function parseFeed(xml) {
	return new Promise((resolve) => {
		xml2js.parseString(xml, function (err, result) {
			resolve(result);
		});
	});
}
