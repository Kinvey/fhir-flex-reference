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

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const should = require('should');
const completeMock = require('../mocks/complete-mock');
const fhirMock = require('../mocks/fhir-client-mock');
const transformersMock = require('../mocks/transformers-mock');
const modulesMock = require('../mocks/modules-mock');

const handler = proxyquire('../../lib/handlers', { './fhir-client': fhirMock, './transformers': transformersMock });

const complete = completeMock.complete;

describe('handlers', () => {
  beforeEach(() => {
    this.transformSearchResultArraySpy = sinon.spy(transformersMock, 'transformSearchResultArray');
    this.transformEntitySpy = sinon.spy(transformersMock, 'transformEntity');
    this.clientReadSpy = sinon.spy(fhirMock, 'read');
    this.clientSearchSpy = sinon.spy(fhirMock, 'search');
    this.clientCreateSpy = sinon.spy(fhirMock, 'create');
    this.clientUpdateSpy = sinon.spy(fhirMock, 'update');
  });

  afterEach(() => {
    this.transformSearchResultArraySpy.restore();
    this.transformEntitySpy.restore();
    this.clientReadSpy.restore();
    this.clientSearchSpy.restore();
    this.clientCreateSpy.restore();
    this.clientUpdateSpy.restore();
    completeMock.completeEmitter.removeAllListeners('done');
  });

  describe('Patient', () => {
    it('should return a single entity', (done) => {
      const context = {
        entityId: '330843'
      };

      completeMock.completeEmitter.on('done', (response) => {
        response.statusCode.should.eql(200);
        Array.isArray(response.body).should.be.false();
        response.body.name[0].family.should.eql('Smith');
        this.clientReadSpy.calledOnce.should.be.true();
        this.transformEntitySpy.calledOnce.should.be.true();
        this.transformEntitySpy.calledAfter(this.clientReadSpy);
        done();
      });

      handler.getPatientById(context, complete, modulesMock);
    });

    it('should be able to query', (done) => {
      const context = {
        query: {
          query: '{ "name": "Smith" }'
        }
      };

      completeMock.completeEmitter.on('done', (response) => {
        response.statusCode.should.eql(200);
        Array.isArray(response.body).should.be.true();
        should.exist(response.body[0].name);
        should.exist(response.body[0].active);
        this.clientSearchSpy.calledOnce.should.be.true();
        this.transformEntitySpy.callCount = response.body.length;
        this.transformSearchResultArraySpy.calledOnce.should.be.true();
        this.transformSearchResultArraySpy.calledAfter(this.clientSearchSpy);
        done();
      });

      handler.getPatientByQuery(context, complete, modulesMock);
    });
  });
});
