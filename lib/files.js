'use strict';

var recursive = require('recursive-readdir'),
    fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    async = require('async'),
    _ = require('lodash');

function writeFile(contents, fileName, callback) {
    mkdirp(path.dirname(fileName), function (err) {
        if(err) {
            callback(err);
        }

        fs.writeFile(fileName, contents, callback);
    });
}

function write(fileHash, destination, callback) {
    var destinationFiles = {};

    _.each(fileHash, function (contents, fileName) {
        destinationFiles[path.join(destination, fileName)] = contents;
    });

    async.forEachOf(destinationFiles, writeFile, callback);
}

function read(callback) {
    var templateDirectory = path.join(__dirname, '../template');
    recursive(templateDirectory, function (recursiveErr, files) {
            if (recursiveErr) {
                callback(recursiveErr);
            }

            async.map(files, fs.readFile, function (readErr, fileContents) {
                var fileHash = {};

                if (readErr) {
                    callback(readErr);
                }

                var basePath = path.join(__dirname, '../');
                _.each(files, function (fileName, key) {

                    fileHash[path.relative(path.join(basePath, '/template'))] = fileContents[key].toString();
                });

                callback(readErr, fileHash);
            });
        }
    )
}

module.exports = {
    read: read,
    write: write
};
