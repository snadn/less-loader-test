// replace which import in less, no effect, but webpack@1 is ok
/*
	output is
	```
		body {
			background-color: blue;
		}
		body {
			color: red;
		}

	```
	expect
	```
		body {
			background-color: green;
		}
		body {
			color: red;
		}

	```
*/

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var extractLESS = new ExtractTextPlugin({
	filename: 'a.css',
	allChunks: true
});

module.exports = {
	entry: {
		'a': path.resolve(__dirname, 'a.less')
	},
	output: {
		path: path.resolve(__dirname, 'output'),
		filename: 'a.js'
	},
	module: {
		rules: [{
			test: /\.(less|css)$/,
			use: extractLESS.extract([
				'css-loader',
				'less-loader'
			])
		}]
	},
	plugins: [
		new webpack.NormalModuleReplacementPlugin(/b\.less/, function(opt) {
			console.log(opt)
			var request = opt.request.split('!');
			var oldPath = request.pop();
			var newPath = path.resolve(__dirname, 'c.less');
			request.push(newPath);
			opt.request = request.join('!');
		}),
		extractLESS
	]
};