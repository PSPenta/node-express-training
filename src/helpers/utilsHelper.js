/**
 * Creates formatted response.
 * 
 * @param {String} errMsg
 * @param {Boolean} successStatus
 * @param {Array or Object} data
 * @param {Boolean} paginated
 * 
 * @returns {Object}
 */
exports.responseObj = (errMsg, successStatus, data, paginated) => {
  const responseObj = {
    'success': successStatus || false,
    'error': errMsg || null,
    'data': data || null
  };

  if (errMsg) {
    return responseObj;
  }

  if (paginated) {
    responseObj.data = data.docs;
    responseObj.page = data.page ? data.page : 1;
    responseObj.totalDocs = data.totalDocs ? data.totalDocs : data.total;
    responseObj.limit = data.limit;
    responseObj.totalPages = data.totalPages ? data.totalPages : data.pages;
    responseObj.hasPrevPage = data.hasPrevPage ? data.hasPrevPage : (data.page > 1 ? true : false);
    responseObj.hasNextPage = data.hasNextPage ? data.hasNextPage : (!data.page || data.page < data.pages ? true : false);
    responseObj.prevPage = data.prevPage ? data.prevPage : (data.page > 1 ? data.page : null);
    responseObj.nextPage = data.nextPage ? data.nextPage : (!data.page || data.page < data.pages ? (data.page ? data.page : 2) : null);
  } else {
    responseObj.data = data.docs || data;
  }

  return responseObj;
};
