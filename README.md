# FHIR API Reference Flex Connector

## Introduction

Kinvey's native API format is JSON over HTTP.  Many healthcare APIs, use the FHIR standard for transmitting health-related data.
This project is a reference Flex Connector for connecting to FHIR-based APIs.  

## Installation

To use this connector, clone this GitHub repository, and install the associated dependencies:

```npm install```

The DLC can either be deployed to the FlexService Runtime, or run locally.  To run locally, you must have node.js
v6.x or greater.  Execute:

```node .```

## Dependencies

This Flex Connector uses the following dependencies, in addition to the `kinvey-flex-sdk`:

* *async:* The async.js module is used managing concurrency in transforming data
* *soap:* A library for consuming SOAP APIs
* *fhir-json-client:* Used for connecting to FHIR APIs and returning the results as JSON

## Testing

This reference connector contains sample automated tests, both unit and integration.  To run the tests, execute:

```npm test```

## Overview

The Flex Connector implements three methods associated with the Kinvey FlexData API:

* onGetAll
* onGetById
* onGetCount

The service objects and handlers are defined in the `index.js` file.  The handlers are loaded seperately from `lib/handlers`.  This separation is done for two purposes:
 a) to increase modularity and reusability of code
 b) to facilitate unit testing

```
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
```

The handlers then perform two steps for every request:
1) Make a request to `lib/fhir-client` for processing the FHIR call and converting the response to JSON
2) Remove the context root and transform the result into valid Kinvey entities `transformers.js`

For example, for `onGetById`, the handler makes a call to the `fhir-client`:

```fhir.read(resource, id, (err, result) => {```

The FHIR Client calls the API, gets the result, and converts the result to JSON:

```
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
```

Finally, the transformer is called to return the result:

```
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
```

After transforming, we complete the flex request and return the results to the request pipeline for further processing:

```
return complete().setBody(result).ok().next();
```