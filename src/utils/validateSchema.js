// const util = require('util');

function validateSchema(schema, obj) {
  let errorMsg;

  // console.log('obj', util.inspect(obj));
  try {
    schema.validate(obj);
  } catch (err) {
    errorMsg = err.toString();
  }

  if (errorMsg) {
    //  console.log('error in validate schema errorMsg >>>', errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
  return {
    success: true,
    data: obj,
  };
}

module.exports = validateSchema;
