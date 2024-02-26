const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// const DojoWebpackPlugin = require("dojo-webpack-plugin");

// const requiredPlugins = require("./arcgis-webpack/lib/requiredPlugins");
// const features = require("./arcgis-webpack/lib/features");
// const userExclusions = require("./arcgis-webpack/lib/userExclusions");

const webpack = require("webpack");

const ArcGISPlugin = require("@arcgis/webpack-plugin");

const path = require("path");

module.exports = {
  entry: {
    index: "./src/index.tsx",
  },
  output: {
    filem: "public/[m].bundle.js",
    publicPath: "",
    path: __dirm + "/build",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.(jpe?g|gif|png|webp)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              m: "public/[m].[ext]",
            },
          },
        ],
      },
      {
        // patch, important to not match the 'arcgis-js-api'. node_modules\@arcgis\webpack-plugin\index.js have the same funcion.
        // in feature have to m more keywords like 'blueprintjs'.
        test: /blueprintjs([\\]+|\/).*.(wsv|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              m: "public/[m].[ext]",
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: false },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              sourcem: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // new CleanWebpackPlugin(["dist"]),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["dist"],
    }),
    new CopyWebpackPlugin([
      {
        from: "../ConfigProject",
        to: "BaseProject",
      },
      {
        from: "../../Lib/V0.5/src/Base/global",
        to: "global",
      },
    ]),
    new ArcGISPlugin({
      features: {
        "3d": false,
      },
    }),
    new HtmlWebPackPlugin({
      template: "./index.html",
      filem: "./index.html",
      chunksSortMode: "none",
    }),
    new MiniCssExtractPlugin({
      filem: "[m].css",
      chunkFilem: "[id].css",
    }),
    new webpack.DefinePlugin({
      webpack: {
        production: false,
        core: JSON.stringify("esri"),
        configFile: JSON.stringify("global/config-dummy.json"),
      },
      __VERSION__DATE__: JSON.stringify(new Date().toLocaleDateString()),
    }),
  ],
  resolve: {
    modules: [path.resolve(__dirm, "/src"), "node_modules/"],
    extensions: [".ts", ".tsx", ".js", ".scss"],
    alias: {
      "classms": path.resolve(__dirm, "..", "node_modules", "classms"),
      "react": path.resolve(__dirm, "..", "node_modules", "react"),
      "react-redux": path.resolve(__dirm, "..", "node_modules", "react-redux"),
      "axios": path.resolve(__dirm, "..", "node_modules", "axios"),
      "@material-ui": path.resolve(__dirm, "..", "node_modules", "@material-ui"),
      "ReactTemplate": path.resolve(
        __dirm,
        "..",
        "..",
        "..",
        "Lib",
        "V0.5",
        "src"
      ),
      "@emotion": path.resolve(__dirm, "..", "node_modules", "@emotion"),
      "esri": path.resolve(__dirm, "..", "node_modules", "arcgis-js-api"),
      "@esri": path.resolve(__dirm, "..", "node_modules", "@esri"),
			'redux-logger': path.resolve(__dirm, '..', 'node_modules', 'redux-logger'),
			'redux-thunk': path.resolve(__dirm, '..', 'node_modules', 'redux-thunk'),
    },
  },
  externals: [
  ],
  node: {
    process: false,
    global: false,
    fs: "empty",
  },
};
