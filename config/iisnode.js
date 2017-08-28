// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
// @remove-on-eject-end
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

let startUsage = process.cpuUsage();

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const path = require('path');
const resolveApp = relativePath => path.resolve('./', relativePath);


const reactScriptsDir = resolveApp('node_modules/react-scripts');

// Ensure environment variables are read.
require(path.join(reactScriptsDir,'config/env'));

const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const fs = require('fs-extra');

const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');

const { exec } = require('child_process');

const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const paths = require(path.join(reactScriptsDir,'config/paths'));
const config = require(resolveApp('config/webpack.config.iisnode'));

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

const DEFAULT_PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const appName = require(paths.appPackageJson).name;

// Create a webpack compiler
let compiler = webpack(config);


app.get('/iisnode-react-coldfusion',(req,res) => {
  
  //file clean up - would be nice to be able to put this on process.on('exit')
  fileCleanUp();
  
  const wpMiddleware = webpackDevMiddleware(compiler,{
	noInfo: true, 
	publicPath: config.output.publicPath,
	index: paths.appHtml,
	outputToDisk: true
  });
  
  app.use(wpMiddleware);
	  
  app.use(webpackHotMiddleware(compiler,{
		log: console.log,
		path: '/iisnode-react-coldfusion/webpack_hmr'
  }));
  
  wpMiddleware.waitUntilValid(justGo);	
  
  function justGo(){
    res.redirect('/iisnode-react-coldfusion/index.html'); 
  }
});


const server = app.listen(DEFAULT_PORT,(err) => {
  if(err){
	console.log(err);
  }  
});


function fileCleanUp(){
  //clean up media
  fs.readdir(path.resolve(paths.appPublic,'media'), (err, files) => {
	if(err){
	  console.log(err);
	  return;	
	}
	files.forEach(file => {
	  fs.unlinkSync(path.join(paths.appPublic,'media',file),function(err){
		if(err) return console.log(err);
	  });   
	});
	//remove media directory
	fs.rmdirSync(path.join(paths.appPublic,'media'),function(err){
	 if(err) return console.log(err);
	});
  });

  fs.readdir(path.resolve(paths.appPublic), (err, files) => {
		if(err){
		  console.log(err);
		  return;	
		}
		  
		files.forEach(file => {
		  if(file.indexOf('hot-update') !== -1 || file.indexOf(config.output.filename) !== -1){
			fs.unlink(path.join(paths.appPublic,file),function(err){
					if(err) return console.log(err);
			});   
		  }
		});
  });

}

process.on('exit',()=>{
  fileCleanUp();	
});