const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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

exports.readAll = (callback) => {
  var todoList = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw('[ERROR] cannot read directory');
    } else {
      for (var i = 0; i < files.length; i++) {
        var todo = {
          id: files[i].slice(0, files[i].length - 4),
          text: files[i].slice(0, files[i].length - 4)
        };
        todoList.push(todo);
      }
      callback(null, todoList);
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
