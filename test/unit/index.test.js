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

if (process.env.NODE_ENV == null) {
  process.env.NODE_ENV = 'test';
}

const proxyquire = require('proxyquire');
const handlersMock = require('../mocks/handlers-mock');
const flexMock = require('../mocks/flex-sdk-mock');
const should = require('should');

describe('flex sdk configuration', () => {
  beforeEach((done) => {
    proxyquire('../../index', { './lib/handlers': handlersMock, 'kinvey-flex-sdk': flexMock });
    setImmediate(done);
  });

  it('should register three service objects', () => {
    (Object.keys(flexMock.serviceObjects)).length.should.eql(3);
  });

  describe('patient service object', () => {
    it('should include the Patient Service Object', () => {
      should.exist(flexMock.serviceObjects.Patient);
      flexMock.serviceObjects.Patient.serviceObjectName.should.eql('Patient');
    });

    it('should register a onGetById Handler', () => {
      should.exist(flexMock.serviceObjects.Patient.onGetById);
      flexMock.serviceObjects.Patient.eventMap.onGetById.should.be.a.Function();
      flexMock.serviceObjects.Patient.eventMap.onGetById.name.should.eql('getPatientById');
    });

    it('should register a onGetByQuery Handler', () => {
      should.exist(flexMock.serviceObjects.Patient.onGetByQuery);
      flexMock.serviceObjects.Patient.eventMap.onGetByQuery.should.be.a.Function();
      flexMock.serviceObjects.Patient.eventMap.onGetByQuery.name.should.eql('getPatientByQuery');
    });

    it('should register an onInsert Handler', () => {
      should.exist(flexMock.serviceObjects.Patient.onInsert);
      flexMock.serviceObjects.Patient.eventMap.onInsert.should.be.a.Function();
      flexMock.serviceObjects.Patient.eventMap.onInsert.name.should.eql('createEntity');
    });

    it('should register an onUpdate Handler', () => {
      should.exist(flexMock.serviceObjects.Patient.onUpdate);
      flexMock.serviceObjects.Patient.eventMap.onUpdate.should.be.a.Function();
      flexMock.serviceObjects.Patient.eventMap.onUpdate.name.should.eql('updateEntity');
    });
  });

  describe('medication service object', () => {
    it('should include the Medication Service Object', () => {
      should.exist(flexMock.serviceObjects.Medication);
      flexMock.serviceObjects.Medication.serviceObjectName.should.eql('Medication');
    });

    it('should register a onGetById Handler', () => {
      should.exist(flexMock.serviceObjects.Medication.onGetById);
      flexMock.serviceObjects.Medication.eventMap.onGetById.should.be.a.Function();
      flexMock.serviceObjects.Medication.eventMap.onGetById.name.should.eql('getMedicationById');
    });

    it('should register a onGetByQuery Handler', () => {
      should.exist(flexMock.serviceObjects.Medication.onGetByQuery);
      flexMock.serviceObjects.Medication.eventMap.onGetByQuery.should.be.a.Function();
      flexMock.serviceObjects.Medication.eventMap.onGetByQuery.name.should.eql('getMedicationByQuery');
    });

    it('should register an onInsert Handler', () => {
      should.exist(flexMock.serviceObjects.Medication.onInsert);
      flexMock.serviceObjects.Medication.eventMap.onInsert.should.be.a.Function();
      flexMock.serviceObjects.Medication.eventMap.onInsert.name.should.eql('createEntity');
    });

    it('should register an onUpdate Handler', () => {
      should.exist(flexMock.serviceObjects.Medication.onUpdate);
      flexMock.serviceObjects.Medication.eventMap.onUpdate.should.be.a.Function();
      flexMock.serviceObjects.Medication.eventMap.onUpdate.name.should.eql('updateEntity');
    });
  });

  describe('appointment service object', () => {
    it('should include the Appointment Service Object', () => {
      should.exist(flexMock.serviceObjects.Appointment);
      flexMock.serviceObjects.Appointment.serviceObjectName.should.eql('Appointment');
    });

    it('should register a onGetById Handler', () => {
      should.exist(flexMock.serviceObjects.Appointment.onGetById);
      flexMock.serviceObjects.Appointment.eventMap.onGetById.should.be.a.Function();
      flexMock.serviceObjects.Appointment.eventMap.onGetById.name.should.eql('getAppointmentById');
    });

    it('should register a onGetByQuery Handler', () => {
      should.exist(flexMock.serviceObjects.Appointment.onGetByQuery);
      flexMock.serviceObjects.Appointment.eventMap.onGetByQuery.should.be.a.Function();
      flexMock.serviceObjects.Appointment.eventMap.onGetByQuery.name.should.eql('getAppointmentByQuery');
    });

    it('should register an onInsert Handler', () => {
      should.exist(flexMock.serviceObjects.Appointment.onInsert);
      flexMock.serviceObjects.Appointment.eventMap.onInsert.should.be.a.Function();
      flexMock.serviceObjects.Appointment.eventMap.onInsert.name.should.eql('createEntity');
    });

    it('should register an onUpdate Handler', () => {
      should.exist(flexMock.serviceObjects.Appointment.onUpdate);
      flexMock.serviceObjects.Appointment.eventMap.onUpdate.should.be.a.Function();
      flexMock.serviceObjects.Appointment.eventMap.onUpdate.name.should.eql('updateEntity');
    });
  });
});
