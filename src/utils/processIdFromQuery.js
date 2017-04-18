const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

function processIdFromQuery(queryObj) {
  const query = queryObj;
  let ids;

  if (query.id) {
    query.id = Array.isArray(query.id) ? query.id : [query.id];
  }
  if (Array.isArray(query.id)) {
    ids = query.id.map(e => ObjectId(e));
  }
  return (ids) ? { _id: { $in: ids } } : {};
}

module.exports = processIdFromQuery;
