export default ({ config }) => {
  return {
    ...config,
    extra: { ...config.extra, VITE_WEB_PORT: process.env.VITE_WEB_PORT || 3000 },
  };
};