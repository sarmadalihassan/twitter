// /* jshint -W014 */
// const mongoose = require('mongoose');
// const util = require('util');
// const redis = require('redis');
// const redisURI = 'redis://localhost:6379';
// const client = redis.createClient(redisURI);
// client.flushall();
// client.hget = util.promisify(client.hget);
// const exec = mongoose.Query.prototype.exec;

// mongoose.Query.prototype.cache = function (options = {}) {
//   this.useCache = true;
//   this.hashKey = JSON.stringify(options.key || '');
//   return this;
// };

// mongoose.Query.prototype.exec = async function () {
//   if (!this.useCache) {
//     return exec.apply(this, arguments);
//   }

//   let key = JSON.stringify(Object.assign({}, this.getFilter()));

//   let cachedValue = await client.hget(this.hashKey, key);

//   if (cachedValue) {
//     const doc = JSON.parse(cachedValue);

//     return Array.isArray(doc)
//       ? doc.map(d => new this.model(d))
//       : new this.model(doc);
//   }

//   const result = await exec.apply(this, arguments);

//   client.hset(this.hashKey, key, JSON.stringify(result));

//   return result;
// };

// module.exports = function (hashKey) {
//   client.del(JSON.stringify(hashKey));
// };
