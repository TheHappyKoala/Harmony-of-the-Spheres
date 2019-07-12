export default <T>(queryParams: string): Promise<T> => {
  return fetch(
    `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?${queryParams}&format=json`
  ).then(res => {
    if (!res.ok)
      throw new Error(
        `That didn't really work out, now did it? ${res.statusText}`
      );

    return res.json() as Promise<T>;
  });
};
