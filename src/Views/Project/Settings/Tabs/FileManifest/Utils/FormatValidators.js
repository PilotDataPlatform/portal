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
import { trimString } from '../../../../../../Utility';
import i18n from '../../../../../../i18n';
export function validateManifestName(manifestName, manifestList) {
  if (!manifestName) {
    return {
      valid: false,
      err: `${i18n.t('formErrorMessages:manifestSettings.manifestName.empty')}`,
    };
  }
  let manifestNameTrim = trimString(manifestName);
  const specialChars = ['\\', '/', ':', '?', '*', '<', '>', '|', '"', "'"];
  if (manifestNameTrim.length === 0 || manifestNameTrim.length > 32) {
    return {
      valid: false,
      err: `${i18n.t(
        'formErrorMessages:manifestSettings.manifestName.length',
      )}`,
    };
  }
  for (let char of specialChars) {
    if (manifestNameTrim.indexOf(char) !== -1) {
      return {
        valid: false,
        err: `${i18n.t(
          'formErrorMessages:manifestSettings.manifestName.format',
        )}`,
      };
    }
  }
  const duplicate = manifestList.find((v) => v.name === manifestNameTrim);
  if (duplicate) {
    return {
      valid: false,
      err: `${i18n.t(
        'formErrorMessages:manifestSettings.manifestName.existent',
      )}`,
    };
  }
  return {
    valid: true,
    err: null,
  };
}

export function validateAttributeName(attributeName, otherAttrs) {
  if (!attributeName) {
    return {
      valid: false,
      err: `${i18n.t(
        'formErrorMessages:manifestSettings.attributeName.empty',
      )}`,
    };
  }
  let attributeNameTrim = trimString(attributeName);
  if (!attributeNameTrim) {
    return {
      valid: false,
      err: `${i18n.t(
        'formErrorMessages:manifestSettings.attributeName.empty',
      )}`,
    };
  }
  if (attributeNameTrim.length === 0 || attributeNameTrim.length > 32) {
    return {
      valid: false,
      err: `${i18n.t(
        'formErrorMessages:manifestSettings.attributeName.length',
      )}`,
    };
  }
  if (!/^[A-Za-z0-9]+$/i.test(attributeNameTrim)) {
    return {
      valid: false,
      err: `${i18n.t(
        'formErrorMessages:manifestSettings.attributeName.format',
      )}`,
    };
  }
  const existentAttr = otherAttrs.find((x) => x.name === attributeNameTrim);
  if (existentAttr) {
    return {
      valid: false,
      err: `${i18n.t(
        'formErrorMessages:manifestSettings.attributeName.existent',
      )}`,
    };
  }
  return {
    valid: true,
    err: null,
  };
}

export function validateAttrValue(attributeVal) {
  if (!attributeVal) {
    return {
      valid: false,
      err: `${i18n.t(
        'formErrorMessages:manifestSettings.attributeValue.length',
      )}`,
    };
  }
  let attributeValTrim = trimString(attributeVal);
  if (attributeValTrim.length === 0 || attributeValTrim.length > 32) {
    return {
      valid: false,
      err: `${i18n.t(
        'formErrorMessages:manifestSettings.attributeValue.length',
      )}`,
    };
  }
  if (!/^[A-Za-z0-9_!%&/()=?*+#.;-]+$/i.test(attributeValTrim)) {
    return {
      valid: false,
      err: `${i18n.t(
        'formErrorMessages:manifestSettings.attributeValue.format',
      )}`,
    };
  }
  return {
    valid: true,
    err: null,
  };
}
