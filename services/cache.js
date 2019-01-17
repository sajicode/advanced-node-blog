const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const redisUrl = 'redis://127.0.0.1:6379';

const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function() {
	this.useCache = true;
	return this;
};

mongoose.Query.prototype.exec = async function() {
	if (!this.useCache) {
		return exec.apply(this, arguments);
	}
	// create a copy of this.getQuery and add collection property to it
	const key = JSON.stringify(
		Object.assign({}, this.getQuery(), {
			collection: this.mongooseCollection.name
		})
	);

	// see if we have a value for 'key' in redis
	const cacheValue = await client.get(key);

	// if we do, return that
	if (cacheValue) {
		const doc = JSON.parse(cacheValue);

		return Array.isArray(doc) ? doc.map((d) => new this.model(d)) : new this.model(doc);
	}

	// otherwise, issue the query and store result in redis

	const result = await exec.apply(this, arguments);

	// turn result to json before storing in redis
	client.set(key, JSON.stringify(result));

	return result;
};
