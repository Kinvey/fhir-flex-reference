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

const sdk = require('kinvey-flex-sdk');
const handlers = require ('./lib/handlers');

// Initiate the Flex SDK Service
sdk.service((err, flex) => {
  if (err) {
    console.log('Error initializing the Flex SDK, exiting.');
    throw err;
  }

  const data = flex.data;                               // gets the FlexData object from the service

  // Define Service Objects
  const patient = data.serviceObject('Patient');
  const medication = data.serviceObject('Medication');
  const appointment = data.serviceObject('Appointment');

  // wire up the events that we want to process
  patient.onGetById(handlers.getPatientById);
  patient.onGetByQuery(handlers.getPatientByQuery);
  patient.onInsert(handlers.createEntity);
  patient.onUpdate(handlers.updateEntity);

  medication.onGetById(handlers.getMedicationById);
  medication.onGetByQuery(handlers.getMedicationByQuery);
  medication.onInsert(handlers.createEntity);
  medication.onUpdate(handlers.updateEntity);

  appointment.onGetById(handlers.getAppointmentById);
  appointment.onGetByQuery(handlers.getAppointmentByQuery);
  appointment.onInsert(handlers.createEntity);
  appointment.onUpdate(handlers.updateEntity);
});
