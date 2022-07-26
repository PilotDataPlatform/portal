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
import {store} from '../Redux/store';

/**
 * convert generic function to action creator&dispatcher
 * @param {function | Array<function>} funcs a function or an Array of function to create an redux action.
 * @returns {function | Array<function>} the action dispatcher
 */
export default function reduxActionWrapper(funcs){
    if(Array.isArray(funcs)){
        return funcs.map(item=>helper(item));
    }else{
        return helper(funcs)
    }
}

function helper(func){
    if(typeof func !=='function'){
        throw new Error('You should pass a function')
    }
    return (actionParams)=>{
        store.dispatch(func(actionParams))
    }
}