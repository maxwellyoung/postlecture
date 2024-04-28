module.exports = function (api) {
  // Caches the configuration based on the NODE_ENV value.
  // The config will be re-evaluated when NODE_ENV changes.
  api.cache(() => process.env.NODE_ENV);

  return {
    presets: ["babel-preset-expo"],
    plugins: [["module:react-native-dotenv"]],
  };
};
