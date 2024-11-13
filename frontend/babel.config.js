module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-paper/babel",
      [
        "babel-plugin-inline-import", // Use this plugin to import SVGs as components
        {
          extensions: [".svg"],
        },
      ],
    ],
  };
};
