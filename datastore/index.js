const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((error, counterString) => {
    if (error) {
      throw ('[ERROR] cannot get next unique id');
    } else {
      var fileName = exports.dataDir + '/' + counterString + '.txt';
      fs.writeFile(fileName, text, (err) => {
        if (err) {
          throw ('[ERROR] cannot create file');
        } else {
          callback(null, {id: counterString, text: text});
        }
      });
    }
  });
};

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, (id + '.txt'));
  fs.readFile(filePath, 'latin1', (err, data) => {
    var fileInfo = {id: id, text: data};
    if (err) {
      callback(err, fileInfo);
    } else {
      callback(null, fileInfo);
    }
  });
};

var readOneAsync = Promise.promisify(exports.readOne);

exports.readAll = (callback) => {
  var todoList = [];
  fs.readdir(exports.dataDir, (err, files) => {
    Promise.all(files.map(function(file) {
      return readOneAsync(file.slice(0, file.length - 4));
    }))
      .then((files) => {
        files.forEach((file) => {
          todoList.push({
            id: file.id,
            text: file.text
          });
        });
        callback(null, todoList);
      });
  });
};

exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, (id + '.txt'));
  fs.stat(filePath, (err, data) => {
    if (err) {
      callback(err, {id: id, text: text});
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          throw ('[ERROR] cannot update file');
        } else {
          callback(null, {id: id, text: text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var filePath = path.join(exports.dataDir, (id + '.txt'));
  fs.unlink(filePath, (err) => {
    callback(err);
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
