const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  entry: path.join(__dirname, "playground/main.ts"),
  devServer: {
    contentBase: path.join(__dirname, "playground"),
    compress: true,
    host: '127.0.0.1',
    port: 9000
  },
  module: {
    rules: [
      {
        exclude: [/node_modules/],
        test: /\.tsx?$/,
        use: ["ts-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css"]
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      title: "Development"
    })
  ],
  target: "web",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "playground/dist")
  }
};
