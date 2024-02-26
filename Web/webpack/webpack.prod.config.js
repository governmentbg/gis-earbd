const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.js');
const path = require("path");
const webpack = require("webpack");

module.exports = merge(baseConfig, {
	output: {
		path: path.join(__dirm, "../", "build")
	},
});
module.exports.plugins.unshift(
	new webpack.DefinePlugin({
		'webpack': {
		  production: true,
		  core: JSON.stringify("esri"),
		  configFile: JSON.stringify("/global/config-dummy.json")
		},
		'__VERSION__DATE__': JSON.stringify(new Date().toLocaleDateString())
	})
)