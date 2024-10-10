const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const path = require('path');
  // eslint-disable-next-line no-undef
  const config = getDefaultConfig(path.resolve(__dirname));

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  return config;
})();
