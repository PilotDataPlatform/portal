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
import { MANIFEST_ATTR_TYPE } from '../../../Views/Project/Settings/Tabs/manifest.values';
import i18n from '../../../i18n';
export function validateForm(attrForm, manifest) {
  const maxHave = manifest.attributes.filter((attr) => !attr.optional);
  for (let attr of maxHave) {
    if (!attrForm[attr.name]) {
      return {
        valid: false,
        err: `${i18n.t('formErrorMessages:manifestAttrsForm.attr.required')}`,
      };
    }
  }
  for (let attr of manifest.attributes) {
    if (
      attr.type === MANIFEST_ATTR_TYPE.TEXT &&
      attrForm[attr.name] &&
      attrForm[attr.name].length > 100
    ) {
      return {
        valid: false,
        err: `${i18n.t('formErrorMessages:manifestAttrsForm.attr.text')}`,
      };
    }
  }
  return {
    valid: true,
    err: null,
  };
}
