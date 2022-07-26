/*
 * Copyright (C) 2022 Indoc Research
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
const logFolderBase = './src/Test/Log';
const path = require('path');
const fs = require('fs');
const pino = require('pino');

function reduxLog(moduleName) {
    const logFolder = path.resolve(logFolderBase, moduleName);
    if (!fs.existsSync(logFolder)) {
        fs.mkdirSync(logFolder, { recursive: true });
    };
    const reduxLogPath = path.resolve(logFolder, 'redux.log');
    fs.openSync(reduxLogPath, 'w');
    const fileLogger = require('pino')(pino.destination(reduxLogPath));
    return (state) => {
        fileLogger.info(state);
    }
}

function screenShot(getPage, moduleName) {
    const page = getPage();
    const screenShotFolder = path.resolve(logFolderBase, moduleName, 'screenShot');
    if (!fs.existsSync(screenShotFolder)) {
        fs.mkdirSync(screenShotFolder, { recursive: true });
    } else {
        fs.readdir(screenShotFolder, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(screenShotFolder, file), err => {
                    if (err) throw err;
                });
            }
        });
    };
    return (fileName) => {
        page.screenshot({
            path: path.resolve(screenShotFolder, fileName + '.png')
        })
    }
}


function apiLog(moduleName) {
    const logFolder = path.resolve(logFolderBase, moduleName);
    if (!fs.existsSync(logFolder)) {
        fs.mkdirSync(logFolder, { recursive: true });
    };
    const apiLogPath = path.resolve(logFolder, 'api.log');
    fs.openSync(apiLogPath, 'w');
    const fileLogger = require('pino')(pino.destination(apiLogPath));
    return (info) => {
        fileLogger.info(info);
    }
}

module.exports = { reduxLog, screenShot, apiLog }
