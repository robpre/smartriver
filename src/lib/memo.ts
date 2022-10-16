export function memo<R>(fn: () => R): () => R {
  let response: R;

  return () => {
    if (response === undefined) {
      response = fn();
    }

    return response;
  };
}
