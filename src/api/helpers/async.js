export default promise =>
  promise
    .then(result => ({
      error: null,
      result,
    }))
    .catch(err => ({
      error: err,
    }));
