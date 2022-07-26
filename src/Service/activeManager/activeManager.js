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
const period = 60 * 1000;
class ActiveManager {
    _timeoutId;
    _isActive;
    activate() {
        clearTimeout(this._timeoutId);
        this._isActive = true;
        this._timeoutId = setTimeout(() => {
            this._isActive = false;
        }, period);
    }
    isActive(){
        return this._isActive;  
    }
}

const activeManager = new ActiveManager();
export {activeManager};