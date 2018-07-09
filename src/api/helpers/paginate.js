export default (results, total, limit, offset, page) => {
  const result = {
    results,
    total,
    limit,
  };

  if (page !== undefined) {
    result.page = page;
    result.pages = Math.ceil(total / limit) || 1;
    return result;
  }

  if (offset !== undefined) {
    result.offset = offset;
  }

  return result;
};
