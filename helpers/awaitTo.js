const awaitTo = promise =>
  promise
    .then(data => [null, data])
    .catch(err => [err]);

export default awaitTo;