const getFilename = (uri: string) => {
  const index: number = uri.lastIndexOf('/');

  return uri.substring(index + 1, uri.length);
};

export default getFilename;
