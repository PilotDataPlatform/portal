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
const mockUsers = [
  'billy',
  'denny',
  'mark',
  'trump',
  'Timmy Kshlerin',
  'Grant Welch',
  'Mrs. Felipe Hayes',
  'Dr. Julius Yundt',
  'Leland Schmidt',
  'Phillip Koepp',
  'Richard Schroeder',
  'Pedro Kassulke',
  'Inez Heaney',
  'Christina Bosco',
  'Edwin Leannon',
  'Ronnie Stroman',
  'Ernestine Bailey',
  'Ellen Ruecker',
  'Mr. Susie Cummings',
  'Ignacio Keebler',
  'Robyn Pouros',
  'Devin Goldner',
  'Willis Koelpin',
  "Wm O'Reilly",
];
async function mockFetchUserList(username) {
  console.log('fetching based on username: ', username);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!username) {
        resolve([]);
      }
      const res = mockUsers
        .filter((name) => name.toLowerCase().includes(username.toLowerCase()))
        .map((item) => ({ label: item, value: item }));
      resolve(res);
    }, 1000);
  });
}

export { mockFetchUserList };
