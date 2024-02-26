const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const webpack = require("webpack");

const ArcGISPlugin = require("@arcgis/webpack-plugin");

const path = require("path");

module.exports = {
	entry: {
		//index: ["./src/Base/css_from_esri_sample/main.scss", "@dojo/framework/shim/Promise", "./src/Lite/index.tsx"]
		index: "./src/Lite/index.tsx"
	},
	output: {
		filem: "public/[m].bundle.js",
		publicPath: "",
		path: __dirm + '/build'
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				options: {
					transpileOnly: true
				}
			},
			{
				test: /\.(jpe?g|gif|png|webp)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							m: "public/[m].[ext]"
						},
					},
				]
			},
			{// patch, important to not match the 'arcgis-js-api'. node_modules\@arcgis\webpack-plugin\index.js have the same funcion.
				// in feature have to m more keywords like 'blueprintjs'.
				test: /\.(wsv|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				use: [
					{
						loader: "file-loader",
						options: {
							m: "public/[m].[ext]"
						},
					},
				]
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: "html-loader",
						options: { minimize: false }
					}
				],
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
			},
			{
				test: /\.less$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							sourcem: true,
						},
					},
				]
			}
		]
	},
	plugins: [
		// new CleanWebpackPlugin(["dist"]),
		new CleanWebpackPlugin({
			cleanAfterEveryBuildPatterns: ['dist']
		}),
		new CopyWebpackPlugin(
			[
				{
					from: "../../Specific/BaseProject-v0.6",
					to: "BaseProject"
				},
				{
					from: "src/global",
					to: "global"
				}
			]
		),
		new ArcGISPlugin({
			// useDefaultAssetLoaders: true,
			// userDefinedExcludes: [],
			// globalContext: path.join(__dirm, "node_modules", "arcgis-js-api"),
			// buildEnvironment: {
			// 	root: "node_modules"
			// },
			features: {
				"3d": false
			}

		}),
		new HtmlWebPackPlugin({
			template: "./src/index.html",
			filem: "./index.html",
			chunksSortMode: "none"
		}),
		new MiniCssExtractPlugin({
			filem: "[m].css",
			chunkFilem: "[id].css"
		}),
		new webpack.DefinePlugin({
			'webpack': {
				production: true,
				core: JSON.stringify("esri"),
				configFile: JSON.stringify("/global/config-dummy.json")
			},
			'__VERSION__DATE__': JSON.stringify(new Date().toLocaleDateString())
		}),
	],
	resolve: {
		modules: [path.resolve(__dirm, "/src"), "node_modules/"],
		extensions: [".ts", ".tsx", ".js", ".scss"]
	}
};
