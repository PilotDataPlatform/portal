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
var roleMap = {
    site_admin: "Platform Administrator",
    admin: "Project Administrator",
    member: "Member",
    contributor: "Project Contributor",
    uploader: "Project Contributor",
    visitor: "Visitor",
    collaborator: "Project Collaborator"
}

/**
 * Transfer role for rendering
 * @param {*} role 
 */
function formatRole(role) {
    return roleMap[role]
}

/**
 * Convert uploader role to contributor
 * @param {*} role 
 */
function convertRole(role) {
    return role === 'uploader' ? 'contributor' : role
}

export { formatRole, convertRole }
