'use strict';

var shell = require('shelljs'),

    command = 'npm i && npm start';

function getCommand() {
    return command;
}

function run(destination) {
    shell.cd(destination);
    shell.exec(command);
}

module.exports = {
    getCommand: getCommand,
    run: run
};
