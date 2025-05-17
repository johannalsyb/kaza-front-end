const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/i,
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
        use: ['@svgr/webpack'],
      },
    ],
  },

  plugins: [
    new SentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "kaza-swap",
      project: "kaza-front-end",
      release: "kaza-front-end@1.0.0",
      include: "./build", // or your actual output folder
      ignore: ["node_modules", "webpack.config.js"],
    }),
  ],
};
