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
function waitClickRefresh(it,testTitle,getPage){
    it(testTitle,async ()=>{
        const page = getPage();
        await page.waitForSelector('#refresh_modal_refresh',{timeout:6*60*1000});
        await page.waitForTimeout(6000);
        await page.click('#refresh_modal_refresh');
    })
};

module.exports = {waitClickRefresh}