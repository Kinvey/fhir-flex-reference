/**
 * Copyright (c) 2017 Kinvey Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

const responses = require('../fixtures/json-data');

exports.read = function read(resource, item, callback) {
  if (resource === 'Patient' && item === '330843') {
    return setImmediate(callback(null, responses.getPatientByIdResponse));
  }
  return null;
};

exports.search = function search(resource, query, callback) {
  if (resource === 'Patient' && Object.keys(query).length === 1 && query.name === 'Smith') {
    return setImmediate(callback(null, responses.getPatientByQueryResponse));
  }
  return null;
};

exports.create = (entity, callback) => {

};

exports.update = (entity, callback) => {

};

