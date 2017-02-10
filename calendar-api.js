// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
var base = require('./version-2.js');
var utilities = require('./utilities.js');

/**
 * @module calendar
 */

module.exports = {
  /**
   * Used to get events from a calendar.
   * 
   * @param parameters {object} An object containing all of the relevant parameters. Possible values:
   * @param parameters.token {string} The access token.
   * @param [parameters.useMe] {boolean} If true, use the `/Me` segment instead of the `/Users/<email>` segment. This parameter defaults to false and is ignored if the `parameters.user.email` parameter isn't provided (the `/Me` segment is always used in this case).
   * @param [parameters.user.email] {string} The SMTP address of the user. If absent, the `/Me` segment is used in the API URL.
   * @param [parameters.user.timezone] {string} The timezone of the user.
   * @param [parameters.calendarId] {string} The calendar id. If absent, the API calls the `/User/Events` endpoint.
   * @param [parameters.odataParams] {object} An object containing key/value pairs representing OData query parameters. See [Use OData query parameters]{@link https://msdn.microsoft.com/office/office365/APi/complex-types-for-mail-contacts-calendar#UseODataqueryparameters} for details.
   * 
   * @param [callback] {function} A callback function that is called when the function completes. It should have the signature `function (error, result)`.
   * 
   * @example var outlook = require('node-outlook');
   * 
   * // Set the API endpoint to use the v2.0 endpoint
   * outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
   * 
   * // This is the oAuth token 
   * var token = 'eyJ0eXAiOiJKV1Q...';
   * 
   * // Set up oData parameters
   * var queryParams = {
   *   '$select': 'Subject,Start,End',
   *   '$orderby': 'Start/DateTime desc',
   *   '$top': 20
   * };
   * 
   * // Pass the user's email address
   * var userInfo = {
   *   email: 'sarad@contoso.com'
   * };
   * 
   * outlook.calendar.getEvents({token: token, folderId: 'Inbox', odataParams: queryParams, user: userInfo},
   *   function(error, result){
   *     if (error) {
   *       console.log('getEvents returned an error: ' + error);
   *     }
   *     else if (result) {
   *       console.log('getEvents returned ' + result.value.length + ' events.');
   *       result.value.forEach(function(event) {
   *         console.log('  Subject:', event.Subject);
   *         console.log('  Start:', event.Start.DateTime.toString());
   *         console.log('  End:', event.End.DateTime.toString());
   *       });
   *     }
   *   });
   */
  getEvents: function(parameters, callback){
    var userSpec = utilities.getUserSegment(parameters);
    var calendarSpec = parameters.calendarId === undefined ? '' : '/Calendars/' + parameters.calendarId;
    
    var requestUrl = base.apiEndpoint() + userSpec + calendarSpec + '/Events';
    
    var apiOptions = {
      url: requestUrl,
      token: parameters.token,
      user: parameters.user
    };
    
    if (parameters.odataParams !== undefined) {
      apiOptions['query'] = parameters.odataParams;
    }
    
    base.makeApiCall(apiOptions, function(error, response) {
      if (error) {
        if (typeof callback === 'function') {
          callback(error, response);
        }
      }
      else if (response.statusCode !== 200) {
        if (typeof callback === 'function') {
          callback('REST request returned ' + response.statusCode + '; body: ' + JSON.stringify(response.body), response);
        }
      }
      else {
        if (typeof callback === 'function') {
          callback(null, response.body);
        }
      }
    });
  },
  
  /**
   * Used to get a specific event.
   * 
   * @param parameters {object} An object containing all of the relevant parameters. Possible values:
   * @param parameters.token {string} The access token.
   * @param parameters.eventId {string} The Id of the event.
   * @param [parameters.useMe] {boolean} If true, use the `/Me` segment instead of the `/Users/<email>` segment. This parameter defaults to false and is ignored if the `parameters.user.email` parameter isn't provided (the `/Me` segment is always used in this case).
   * @param [parameters.user.email] {string} The SMTP address of the user. If absent, the `/Me` segment is used in the API URL.
   * @param [parameters.user.timezone] {string} The timezone of the user.
   * @param [parameters.odataParams] {object} An object containing key/value pairs representing OData query parameters. See [Use OData query parameters]{@link https://msdn.microsoft.com/office/office365/APi/complex-types-for-mail-contacts-calendar#UseODataqueryparameters} for details.
   * @param [callback] {function} A callback function that is called when the function completes. It should have the signature `function (error, result)`.
   * 
   * @example var outlook = require('node-outlook');
   * 
   * // Set the API endpoint to use the v2.0 endpoint
   * outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
   * 
   * // This is the oAuth token 
   * var token = 'eyJ0eXAiOiJKV1Q...';
   * 
   * // The Id property of the event to retrieve. This could be 
   * // from a previous call to getEvents
   * var eventId = 'AAMkADVhYTYwNzk...';
   * 
   * // Set up oData parameters
   * var queryParams = {
   *   '$select': 'Subject,Start,End'
   * };
   * 
   * // Pass the user's email address
   * var userInfo = {
   *   email: 'sarad@contoso.com'
   * };
   * 
   * outlook.calendar.getEvent({token: token, eventId: eventId, odataParams: queryParams, user: userInfo},
   *   function(error, result){
   *     if (error) {
   *       console.log('getEvent returned an error: ' + error);
   *     }
   *     else if (result) {
   *       console.log('  Subject:', result.Subject);
   *       console.log('  Start:', result.Start.DateTime.toString());
   *       console.log('  End:', result.End.DateTime.toString());
   *     }
   *   });
   */
  getEvent: function(parameters, callback) {
    var userSpec = utilities.getUserSegment(parameters);
    
    var requestUrl = base.apiEndpoint() + userSpec + '/Events/' + parameters.eventId;
    
    var apiOptions = {
      url: requestUrl,
      token: parameters.token,
      user: parameters.user
    };
    
    if (parameters.odataParams !== undefined) {
      apiOptions['query'] = parameters.odataParams;
    }
    
    base.makeApiCall(apiOptions, function(error, response) {
      if (error) {
        if (typeof callback === 'function') {
          callback(error, response);
        }
      }
      else if (response.statusCode !== 200) {
        if (typeof callback === 'function') {
          callback('REST request returned ' + response.statusCode + '; body: ' + JSON.stringify(response.body), response);
        }
      }
      else {
        if (typeof callback === 'function') {
          callback(null, response.body);
        }
      }
    });
  },
  
  /**
   * Create a new event
   * 
   * @param parameters {object} An object containing all of the relevant parameters. Possible values:
   * @param parameters.token {string} The access token.
   * @param parameters.event {object} The JSON-serializable event 
   * @param [parameters.useMe] {boolean} If true, use the `/Me` segment instead of the `/Users/<email>` segment. This parameter defaults to false and is ignored if the `parameters.user.email` parameter isn't provided (the `/Me` segment is always used in this case).
   * @param [parameters.user.email] {string} The SMTP address of the user. If absent, the `/Me` segment is used in the API URL.
   * @param [parameters.user.timezone] {string} The timezone of the user.
   * @param [parameters.calendarId] {string} The calendar id. If absent, the API calls the `/User/Events` endpoint.
   * @param [callback] {function} A callback function that is called when the function completes. It should have the signature `function (error, result)`.
   * 
   * @example var outlook = require('node-outlook');
   * 
   * // Set the API endpoint to use the v2.0 endpoint
   * outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
   * 
   * // This is the oAuth token 
   * var token = 'eyJ0eXAiOiJKV1Q...';
   * 
   * var newEvent = {
   *   "Subject": "Discuss the Calendar REST API",
   *   "Body": {
   *     "ContentType": "HTML",
   *     "Content": "I think it will meet our requirements!"
   *   },
   *   "Start": {
   *     "DateTime": "2016-02-03T18:00:00",
   *     "TimeZone": "Eastern Standard Time"
   *   },
   *   "End": {
   *     "DateTime": "2016-02-03T19:00:00",
   *     "TimeZone": "Eastern Standard Time"
   *   },
   *   "Attendees": [
   *     {
   *       "EmailAddress": {
   *         "Address": "allieb@contoso.com",
   *         "Name": "Allie Bellew"
   *       },
   *       "Type": "Required"
   *     }
   *   ]
   * };
   * 
   * // Pass the user's email address
   * var userInfo = {
   *   email: 'sarad@contoso.com'
   * };
   * 
   * outlook.calendar.createEvent({token: token, event: newEvent, user: userInfo},
   *   function(error, result){
   *     if (error) {
   *       console.log('createEvent returned an error: ' + error);
   *     }
   *     else if (result) {
   *       console.log(JSON.stringify(result, null, 2));
   *     }
   *   });
   */
  createEvent: function(parameters, callback) {
    var userSpec = utilities.getUserSegment(parameters);
    var calendarSpec = parameters.calendarId === undefined ? '' : '/Calendars/' + parameters.calendarId;
    
    var requestUrl = base.apiEndpoint() + userSpec + calendarSpec + '/Events';
    
    var apiOptions = {
      url: requestUrl,
      token: parameters.token,
      user: parameters.user,
      payload: parameters.event,
      method: 'POST'
    };
    
    base.makeApiCall(apiOptions, function(error, response) {
      if (error) {
        if (typeof callback === 'function') {
          callback(error, response);
        }
      }
      else if (response.statusCode !== 201) {
        if (typeof callback === 'function') {
          callback('REST request returned ' + response.statusCode + '; body: ' + JSON.stringify(response.body), response);
        }
      }
      else {
        if (typeof callback === 'function') {
          callback(null, response.body);
        }
      }
    });
  },
  
  /**
   * Update a specific event.
   * 
   * @param parameters {object} An object containing all of the relevant parameters. Possible values:
   * @param parameters.token {string} The access token.
   * @param parameters.eventId {string} The Id of the event.
   * @param parameters.update {object} The JSON-serializable update payload 
   * @param [parameters.useMe] {boolean} If true, use the `/Me` segment instead of the `/Users/<email>` segment. This parameter defaults to false and is ignored if the `parameters.user.email` parameter isn't provided (the `/Me` segment is always used in this case).
   * @param [parameters.user.email] {string} The SMTP address of the user. If absent, the `/Me` segment is used in the API URL.
   * @param [parameters.user.timezone] {string} The timezone of the user.
   * @param [parameters.odataParams] {object} An object containing key/value pairs representing OData query parameters. See [Use OData query parameters]{@link https://msdn.microsoft.com/office/office365/APi/complex-types-for-mail-contacts-calendar#UseODataqueryparameters} for details.
   * @param [callback] {function} A callback function that is called when the function completes. It should have the signature `function (error, result)`.
   * 
   * @example var outlook = require('node-outlook');
   * 
   * // Set the API endpoint to use the v2.0 endpoint
   * outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
   * 
   * // This is the oAuth token 
   * var token = 'eyJ0eXAiOiJKV1Q...';
   * 
   * // The Id property of the event to update. This could be 
   * // from a previous call to getEvents
   * var eventId = 'AAMkADVhYTYwNzk...';
   * 
   * // Update the location
   * var update = {
   *   Location: {
   *     DisplayName: 'Conference Room 2'
   *   }
   * };
   * 
   * // Pass the user's email address
   * var userInfo = {
   *   email: 'sarad@contoso.com'
   * };
   * 
   * outlook.calendar.updateEvent({token: token, eventId: eventId, update: update, user: userInfo},
   *   function(error, result){
   *     if (error) {
   *       console.log('updateEvent returned an error: ' + error);
   *     }
   *     else if (result) {
   *       console.log(JSON.stringify(result, null, 2));
   *     }
   *   });
   */
  updateEvent: function(parameters, callback) {
    var userSpec = utilities.getUserSegment(parameters);
    
    var requestUrl = base.apiEndpoint() + userSpec + '/Events/' + parameters.eventId;
    
    var apiOptions = {
      url: requestUrl,
      token: parameters.token,
      user: parameters.user,
      payload: parameters.update,
      method: 'PATCH'
    };
    
    if (parameters.odataParams !== undefined) {
      apiOptions['query'] = parameters.odataParams;
    }
    
    base.makeApiCall(apiOptions, function(error, response) {
      if (error) {
        if (typeof callback === 'function') {
          callback(error, response);
        }
      }
      else if (response.statusCode !== 200) {
        if (typeof callback === 'function') {
          callback('REST request returned ' + response.statusCode + '; body: ' + JSON.stringify(response.body), response);
        }
      }
      else {
        if (typeof callback === 'function') {
          callback(null, response.body);
        }
      }
    });
  },
  
  /**
   * Delete a specific event.
   * 
   * @param parameters {object} An object containing all of the relevant parameters. Possible values:
   * @param parameters.token {string} The access token.
   * @param parameters.eventId {string} The Id of the event.
   * @param [parameters.useMe] {boolean} If true, use the `/Me` segment instead of the `/Users/<email>` segment. This parameter defaults to false and is ignored if the `parameters.user.email` parameter isn't provided (the `/Me` segment is always used in this case).
   * @param [parameters.user.email] {string} The SMTP address of the user. If absent, the `/Me` segment is used in the API URL.
   * @param [parameters.user.timezone] {string} The timezone of the user.
   * @param [callback] {function} A callback function that is called when the function completes. It should have the signature `function (error, result)`.
   * 
   * @example var outlook = require('node-outlook');
   * 
   * // Set the API endpoint to use the v2.0 endpoint
   * outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
   * 
   * // This is the oAuth token 
   * var token = 'eyJ0eXAiOiJKV1Q...';
   * 
   * // The Id property of the event to delete. This could be 
   * // from a previous call to getEvents
   * var eventId = 'AAMkADVhYTYwNzk...';
   * 
   * // Pass the user's email address
   * var userInfo = {
   *   email: 'sarad@contoso.com'
   * };
   * 
   * outlook.calendar.deleteEvent({token: token, eventId: eventId, user: userInfo},
   *   function(error, result){
   *     if (error) {
   *       console.log('deleteEvent returned an error: ' + error);
   *     }
   *     else if (result) {
   *       console.log('SUCCESS');
   *     }
   *   });
   */
  deleteEvent: function(parameters, callback) {
    var userSpec = utilities.getUserSegment(parameters);
    
    var requestUrl = base.apiEndpoint() + userSpec + '/Events/' + parameters.eventId;
    
    var apiOptions = {
      url: requestUrl,
      token: parameters.token,
      user: parameters.user,
      method: 'DELETE'
    };
    
    if (parameters.odataParams !== undefined) {
      apiOptions['query'] = parameters.odataParams;
    }
    
    base.makeApiCall(apiOptions, function(error, response) {
      if (error) {
        if (typeof callback === 'function') {
          callback(error, response);
        }
      }
      else if (response.statusCode !== 204) {
        if (typeof callback === 'function') {
          callback('REST request returned ' + response.statusCode + '; body: ' + JSON.stringify(response.body), response);
        }
      }
      else {
        if (typeof callback === 'function') {
          callback(null, response.body);
        }
      }
    });
  }
};

/*
  MIT License: 

  Permission is hereby granted, free of charge, to any person obtaining 
  a copy of this software and associated documentation files (the 
  ""Software""), to deal in the Software without restriction, including 
  without limitation the rights to use, copy, modify, merge, publish, 
  distribute, sublicense, and/or sell copies of the Software, and to 
  permit persons to whom the Software is furnished to do so, subject to 
  the following conditions: 

  The above copyright notice and this permission notice shall be 
  included in all copies or substantial portions of the Software. 

  THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND, 
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/