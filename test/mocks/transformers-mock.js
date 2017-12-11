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

const should = require('should');
const responses = require('../fixtures/json-data');

function transformSearchResultArray(array, modules, callback) {
  Array.isArray(array).should.be.true();
  array.length.should.be.greaterThan(1);
  const entity = array[0];
  should.exist(entity.name);
  should.exist(entity.name[0].family);
  should.exist(modules);
  should.exist(modules.kinveyEntity.entity);
  modules.kinveyEntity.entity.should.be.a.Function();
  array.should.eql(responses.getPatientByQueryResponse.entry);
  callback(null, array);
}

function transformEntity(entity, modules) {
  Array.isArray(entity).should.be.false();
  should.exist(entity.id);
  should.not.exist(entity._id);
  should.not.exist(entity._kmd);
  should.not.exist(entity._acl);
  return entity;
}

exports.transformSearchResultArray = transformSearchResultArray;
exports.transformEntity = transformEntity;