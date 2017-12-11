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

const fhir = require('./fhir-client');
const transformers = require('./transformers');

/* This module contains the handlers for each flex data method.  Each handler:
 * 1) Makes a request to an external service via a client
 * 2) Transforms the result, if necessary
 * 3) Returns the result via the completion handler
 */

function _sendTransformedResponse(entity, complete, modules) {
  const transformedEntity = transformers.transformEntity(entity, modules);
  const response = complete().setBody(transformedEntity);

  return transformedEntity instanceof Error ? response.runtimeError().done() : response.ok().next();
}

function _read(resource, id, complete, modules) {
  fhir.read(resource, id, (err, result) => {
    if(err) {
      const statusCode = err.statusCode;
      delete err.statusCode;
      const response = complete().setBody(err);

      switch (statusCode) {
        case 404:
          response.notFound();
          break;
        case 400:
          response.badRequest();
          break;
        case 401:
          response.unauthorized();
          break;
        case 403:
          response.forbidden();
          break;
        case 405:
          response.notAllowed();
          break;
        default:
          response.runtimeError();
      }
      return response.done();
    }

    return _sendTransformedResponse(result, complete, modules);
  });
}

function _search(resource, query, complete, modules) {
  let parsedQuery;

  if (query && typeof query === 'string') {
    try {
      parsedQuery = JSON.parse(query);
    } catch (e) {
      return complete().setBody(e).runtimeError().done();
    }
  }

  fhir.search(resource, parsedQuery, (err, result) => {
    if(err) {

      const statusCode = err.statusCode;
      delete err.statusCode;
      const response = complete().setBody(err);

      switch (statusCode) {
        case 404:
          response.notFound();
          break;
        case 400:
          response.badRequest();
          break;
        case 401:
          response.unauthorized();
          break;
        case 403:
          response.forbidden();
          break;
        case 405:
          response.notAllowed();
          break;
        default:
          response.runtimeError();
      }
      return response.done();
    }

    return transformers.transformSearchResultArray(result.entry || [], modules, (err, transformedResult) => {
      if (err) {
        return complete().setBody(err).runtimeError().done();
      }
      return complete().setBody(transformedResult).ok().next();
    });
  });
}

function _create(body, complete, modules) {
  fhir.create(body, (err, result) => {
    if (err) {
      return complete().setBody(err).runtimeError().done();
    }

    return _sendTransformedResponse(result, complete, modules);
  });
}

function _update(body, complete, modules) {
  fhir.update(body, (err, result) => {
    if (err) {
      return complete().setBody(err).runtimeError().done();
    }

    return _sendTransformedResponse(result, complete, modules);
  });
}

function createEntity(context, complete, modules) {
  const transformedRequestBody = transformers.transformWrite(context.body);

  if (transformedRequestBody instanceof Error) {
    return complete().setBody(transformedRequestBody).runtimeError().done();
  }

  return _create(transformedRequestBody, complete, modules);
}

function updateEntity(context, complete, modules) {
  const transformedRequestBody = transformers.transformWrite(context.body);

  if (transformedRequestBody instanceof Error) {
    return complete().setBody(transformedRequestBody).runtimeError().done();
  }

  return _update(transformedRequestBody, complete, modules);
}

function getPatientById(context, complete, modules) {
  return _read('Patient', context.entityId, complete, modules);
}

function getPatientByQuery(context, complete, modules) {
  return _search('Patient', context.query.query, complete, modules);
}

function getMedicationById(context, complete, modules) {
  return _read('Medication', context.entityId, complete);
}

function getMedicationByQuery(context, complete, modules) {
  return _search('Medication', context.query.query, complete, modules);
}

function getAppointmentById(context, complete, modules) {
  return _read('Appointment', context.entityId, complete);
}

function getAppointmentByQuery(context, complete, modules) {
  return _read('Appointment', context.query.query, complete, modules);
}

exports.getPatientById = getPatientById;
exports.getPatientByQuery = getPatientByQuery;
exports.createEntity = createEntity;
exports.updateEntity = updateEntity;

exports.getMedicationById = getMedicationById;
exports.getMedicationByQuery = getMedicationByQuery;

exports.getAppointmentById = getAppointmentById;
exports.getAppointmentByQuery = getAppointmentByQuery;
