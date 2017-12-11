// /**
//  * Copyright (c) 2017 Kinvey Inc.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
//  * in compliance with the License. You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software distributed under the License
//  * is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
//  * or implied. See the License for the specific language governing permissions and limitations under
//  * the License.
//  */

const Client = require('fhir-json-client');

const client = new Client('http://test.fhir.org/r3/');

function _parseResponse(err, response, item, callback) {
  if (err != null) {
    return callback(err);
  } else if (response != null && response.statusCode > 299) {
    return callback(response)
  } else {
    return callback(err, item);
  }
}

exports.read = function read(resource, item, callback) {
  client.read(resource, item, (err, response, item) => {
    _parseResponse(err, response, item, callback);
  });
};

exports.search = (resource, query, callback) => {
  client.search(resource, query, (err, response, item) => {
    _parseResponse(err, response, item, callback);
  });
};

exports.create = (entity, callback) => {
  client.create(entity, (err, response, item) => {
    _parseResponse(err, response, item, callback);
  });
};

exports.update = (entity, callback) => {
  client.update(entity, (err, response, item) => {
    _parseResponse(err, response, item, callback);
  });
};
