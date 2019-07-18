export default (
  url: string,
  options?: { [x: string]: any },
  expiry = 2592000000
) => {
  const cached = localStorage.getItem(url);
  const timeStampKey = `${url}:timestamp`;
  const cacheDate = localStorage.getItem(timeStampKey);

  if (cached !== null && cacheDate !== null) {
    if (Date.now() - parseFloat(cacheDate) < expiry) {
      return Promise.resolve(new Response(new Blob([cached])).json());
    } else {
      localStorage.removeItem(cached);
      localStorage.removeItem(timeStampKey);
    }
  }

  return fetch(url, options).then(response => {
    if (response.status === 200) {
      response
        .clone()
        .text()
        .then(content => {
          localStorage.setItem(url, content);
          localStorage.setItem(timeStampKey, Date.now().toString());
        });
    } else throw new Error(response.status.toString());

    return response.json();
  });
};
