/*
 * Copyright (C) 2022 Indoc Research
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
const _ = require("lodash");

/**
 * covert a snake case object's keys to camelCase, for JSON from backend
 *
 * @param {object} snake_case_object snake_case object
 * @returns {object} a new object with all camelCase keys
 */
function objectKeysToCamelCase(snake_case_object) {
  var camelCaseObject = _.isArray(snake_case_object) ? [] : {};
  _.forEach(snake_case_object, function(value, key) {
    if (_.isPlainObject(value) || _.isArray(value)) {
      // checks that a value is a plain object or an array - for recursive key conversion
      value = objectKeysToCamelCase(value); // recursively update keys of any values that are also objects
    }
    camelCaseObject[_.camelCase(key)] = value;
  });
  return camelCaseObject;
}

/**
 * covert a camel case object's keys to snake case, for JSON ready to be sent to backend
 *
 * @param {object} camelCaseObject camel case object
 * @returns {object} snake case object
 */
function objectKeysToSnakeCase(camelCaseObject) {
  var snakeCaseObject = _.isArray(camelCaseObject) ? [] : {};
  _.forEach(camelCaseObject, function(value, key) {
    if (_.isPlainObject(value) || _.isArray(value)) {
      // checks that a value is a plain object or an array - for recursive key conversion
      value = objectKeysToSnakeCase(value); // recursively update keys of any values that are also objects
    }
    snakeCaseObject[_.snakeCase(key)] = value;
  });
  return snakeCaseObject;
}

export { objectKeysToCamelCase, objectKeysToSnakeCase };
