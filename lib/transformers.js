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
//

const async = require('async');

function transformSearchResultArray(array, modules, callback) {

  if (Array.isArray(array) === false) {
    if (typeof array === 'object') {
      array = [array];
    } else {
      return setImmediate(() => callback(new Error('Item transformed must be an array or object')));
    }
  }

  if (typeof modules === 'function'
    || modules == null
    || modules.kinveyEntity == null
    || modules.kinveyEntity.entity == null) {
    if (typeof modules === 'function' && callback == null) {
      callback = modules;
    }

    if (callback !== null) {
      return setImmediate(() => callback(new Error('A valid modules object must be supplied')));
    }
  }

  if (callback == null || typeof callback !== 'function') {
    throw new Error('A callback function must be supplied');
  }

  return async.map(array, (item, cb) => {
    return setImmediate(() => cb(null, transformEntity(item.resource)));
  }, (err, transformedResult) => {
    if (err) {
      return callback(new Error(err));
    }
    return callback(null, transformedResult || []);
  });
}

function transformEntity(entity, modules) {
  if (typeof entity !== 'object') {
    return new Error('The entity must be an object.');
  }

  if (Array.isArray(entity)) {
    return new Error('Arrays are not permitted.  Only a single entity may be supplied.');
  }

  if (entity.id == null) {
    return new Error('No id field (_id) present in the resulting entity');
  }

  if (modules == null || modules.kinveyEntity == null || modules.kinveyEntity.entity == null) {
    return new Error('A valid modules object must be supplied');
  }

  const mappedEntity = modules.kinveyEntity.entity(entity);

  mappedEntity._id = entity.id;
  return mappedEntity;
}

function transformWrite(entity) {
  if (typeof entity !== 'object') {
    return new Error('The entity must be an object.');
  }

  if (Array.isArray(entity)) {
    return new Error('Arrays are not permitted.  Only a single entity may be supplied.');
  }

  if (modules == null || modules.kinveyEntity == null || modules.kinveyEntity.entity == null) {
    return new Error('A valid modules object must be supplied');
  }

  if (entity._id != null) {
    entity.id = entity._id;
  }

  delete entity._id;
  delete entity._kmd;
  delete entity._acl;
  return entity;
}

exports.transformSearchResultArray = transformSearchResultArray;
exports.transformEntity = transformEntity;
exports.transformWrite = transformWrite;