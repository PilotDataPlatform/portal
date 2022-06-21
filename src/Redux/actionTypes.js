export const ADD_DATASET_LIST = 'ADD_DATASET_LIST';

export const SET_DATASET_LIST = 'SET_DATASET_LIST';

export const CLEAN_DATASET_LIST = 'CLEAN_DATASET_LIST';

export const SET_USER_LIST = 'SET_USER_LIST';

export const SET_TAGS = 'SET_TAGS';

export const SET_METADATAS = 'SET_METADATAS';

export const SET_PERSONAL_DATASET_ID = 'SET_PERSONAL_DATASET_ID';

export const SET_CONTAINERS_PERMISSION = 'SET_CONTAINERS_PERMISSION';

export const SET_USER_ROLE = 'SET_USER_ROLE';

export const SET_UPLOAD_LIST = 'SET_UPLOAD_LIST';

export const APPEND_UPLOAD_LIST = 'APPEND_UPLOAD_LIST';

export const UPDATE_UPLOAD_LIST_ITEM = 'UPDATE_UPLOAD_LIST_ITEM';

export const SET_UPLOAD_INDICATOR = 'SET_UPLOAD_INDICATOR';

export const USER_LOGOUT = 'USER_LOGOUT';

export const SET_TOKEN_AUTO_REFRESH = 'SET_TOKEN_AUTO_REFRESH';

export const APPEND_DOWNLOAD_LIST = 'APPEND_DOWNLOAD_LIST';

export const REMOVE_DOWNLOAD_LIST = 'REMOVE_DOWNLOAD_LIST';

export const CLEAR_DOWNLOAD_LIST = 'CLEAR_DOWNLOAD_LIST';

export const UPDATE_COPY2CORE_LIST = 'UPDATE_COPY2CORE_LIST';
export const UPDATE_DATASET_LIST = 'UPDATE_DATASET_LIST';

export const UPDATE_CLEAR_ID = 'UPDATE_CLEAR_ID';

export const SET_IS_LOGIN = 'SET_IS_LOGIN';

export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_SUCCESS_NUM = 'SET_SUCCESS_NUM';
export const SET_DOWNLOAD_CLEAR_ID = 'SET_DOWNLOAD_CLEAR_ID';

export const SET_PANEL_ACTIVE_KEY = 'SET_PANEL_ACTIVE_KEY';

export const UPDATE_DOWNLOAD_ITEM = 'UPDATE_DOWNLOAD_ITEM';

export const SET_DOWNLOAD_LIST = 'SET_DOWNLOAD_LIST';

export const SET_CURRENT_PROJECT_PROFILE = 'SET_CURRENT_PROJECT_PROFILE';
export const SET_CURRENT_PROJECT_SYSTEM_TAGS =
  'SET_CURRENT_PROJECT_SYSTEM_TAGS';
export const SET_CURRENT_PROJECT_TREE = 'SET_CURRENT_PROJECT_TREE';
export const SET_CURRENT_PROJECT_TREE_VFOLDER =
  'SET_CURRENT_PROJECT_TREE_VFOLDER';
export const SET_CURRENT_PROJECT_TREE_GREEN_ROOM =
  'SET_CURRENT_PROJECT_TREE_GREEN_ROOM';
export const SET_CURRENT_PROJECT_TREE_CORE = 'SET_CURRENT_PROJECT_TREE_CORE';
export const SET_CURRENT_PROJECT_ACTIVE_PANE =
  'SET_CURRENT_PROJECT_ACTIVE_PANE';
export const CLEAR_CURRENT_PROJECT = 'CLEAR_CURRENT_PROJECT';
export const TRIGGER_EVENT = 'TRIGGER_EVENT';
export const SET_EMAIL = 'SET_EMAIL';

export const SET_IS_KEYCLOAK_READY = 'SET_IS_KEYCLOAK_READY';
export const SET_IS_RELEASE_NOTE_SHOWN = 'SET_IS_RELEASE_NOTE_SHOWN';

export const SET_DELETE_LIST = 'SET_DELETE_LIST';
export const UPDATE_DELETE_LIST = 'UPDATE_DELETE_LIST';

export const SET_UPLOAD_FILE_MANIFEST = 'SET_UPLOAD_FILE_MANIFEST';

export const SET_SELECTED_FILES = 'SET_SELECTED_FILES';
export const SET_SELECTED_FILES_KEYS = 'SET_SELECTED_FILE_KEYS';
export const CLEAN_FILES_SELECTION = 'CLEAN_FILES_SELECTION';
export const SET_FOLDER_ROUTING = 'SET_FOLDER_ROUTING';
export const SET_TABLE_RESET = 'SET_TABLE_RESET';
export const SHOW_SERVICE_REQUEST_RED_DOT = 'SHOW_SERVICE_REQUEST_RED_DOT';
export const SET_USER_STATUS = 'SET_USER_STATUS';
export const SET_PROJECT_WORKBENCH = 'SET_PROJECT_WORKBENCH';

export const SET_CANVAS_PAGE = 'SET_CANVAS_PAGE';

export const DATASET_DATA = {
  SET_TREE_DATA: 'DATASET_DATA.SET_TREE_DATA',
  SET_SELECTED_DATA: 'DATASET_DATA.SET_SELECTED_DATA',
  SET_MODE: 'DATASET_DATA.SET_MODE',
  SET_HIGHLIGHTED: 'DATASET_DATA.SET_HIGHLIGHTED',
  SET_PREVIEW_FILE: 'DATASET_DATA.SET_PREVIEW_FILE',
  SET_SELECTED_DATA_POS: 'SET_SELECTED_DATA_POS',
  CLEAR_DATA: 'CLEAR_DATA',
  SET_TREE_LOADING: 'SET_TREE_LOADING',
  RESET_TREE_KEY: 'RESET_TREE_KEY',
};

export const MY_DATASET_LIST = {
  SET_DATASETS: 'MY_DATASET_LIST.SET_DATASETS',
  SET_LOADING: 'MY_DATASET_LIST.SET_LOADING',
  SET_TOTAL: 'MY_DATASET_LIST.SET_TOTAL',
};

export const DATASET_INFO = {
  SET_BASIC_INFO: 'DATASET_INFO.SET_BASIC_INFO',
  SET_PROJECT_NAME: 'DATASET_INFO.SET_PROJECT_NAME',
  SET_LOADING: 'DATASET_INFO.SET_LOADING',
  SET_HAS_INIT: 'DATASET_INFO.SET_HAS_INIT',
  SET_VERSION: 'SET_VERSION',
  SET_FILE_MOVE_TIMES: 'SET_FILE_MOVE_TIMES',
};

export const DATASET_FILE_OPERATION = {
  SET_MOVE: 'DATASET_FILE_OPERATION.SET_MOVE',
  SET_IMPORT: 'DATASET_FILE_OPERATION.SET_IMPORT',
  SET_RENAME: 'DATASET_FILE_OPERATION.SET_RENAME',
  SET_DELETE: 'DATASET_FILE_OPERATION.SET_DELETE',
  SET_LOADING_STATUS: {
    IMPORT: 'DATASET_FILE_OPERATION.SET_LOADING_STATUS.IMPORT',
    RENAME: 'DATASET_FILE_OPERATION.SET_LOADING_STATUS.RENAME',
    MOVE: 'DATASET_FILE_OPERATION.SET_LOADING_STATUS.MOVE',
    DELETE: 'DATASET_FILE_OPERATION.SET_LOADING_STATUS.DELETE',
  },
};

export const SCHEMA_TEMPLATES = {
  UPDATE_DEFAULT_SCHEMA_LIST: 'UPDATE_DEFAULT_SCHEMA_LIST',
  UPDATE_DEFAULT_SCHEMA_TEMPLATE_LIST: 'UPDATE_DEFAULT_SCHEMA_TEMPLATE_LIST',
  SET_DEFAULT_SCHEMA_ACTIVE_KEY: 'SET_DEFAULT_SCHEMA_ACTIVE_KEY',
  SET_CUSTOM_SCHEMA_ACTIVE_KEY: 'SET_CUSTOM_SCHEMA_ACTIVE_KEY',
  ADD_DEFAULT_OPEN_TAB: 'ADD_DEFAULT_OPEN_TAB',
  UPDATE_DEFAULT_OPEN_TAB: 'UPDATE_DEFAULT_OPEN_TAB',
  CLEAR_DEFAULT_OPEN_TAB: 'CLEAR_DEFAULT_OPEN_TAB',
  ADD_CUSTOM_OPEN_TAB: 'ADD_CUSTOM_OPEN_TAB',
  REMOVE_DEFAULT_OPEN_TAB: 'REMOVE_DEFAULT_OPEN_TAB',
  REMOVE_CUSTOM_OPEN_TAB: 'REMOVE_CUSTOM_OPEN_TAB',
  SET_SCHEMA_TYPES: 'SET_SCHEMA_TYPES',
  SWITCH_TEMPLATE_MANAGER_MODE: 'SWITCH_TEMPLATE_MANAGER_MODE',
  SHOW_TEMPLATES_DROPDOWN_LIST: 'SHOW_TEMPLATES_DROPDOWN_LIST',
  SET_PREVIEW_SCHEMA_GEID: 'SET_PREVIEW_SCHEMA_GEID',
};

export const FILE_EXPLORER_TABLE = {
  ADD: 'FILE_EXPLORER_TABLE.ADD',
  REMOVE: 'FILE_EXPLORER_TABLE.REMOVE',
  REFRESH_TABLE: 'REFRESH_TABLE',
  SET_LOADING: 'FILE_EXPLORER_TABLE.SET_LOADING',
  SET_CURRENT_PLUGIN: 'FILE_EXPLORER_TABLE.SET_CURRENT_PLUGIN',
  SET_DATA: 'FILE_EXPLORER_TABLE.SET_DATA',
  SET_ROUTE: 'FILE_EXPLORER_TABLE.SET_ROUTE',
  SET_PAGE: 'FILE_EXPLORER_TABLE.SET_PAGE',
  SET_PAGE_SIZE: 'FILE_EXPLORER_TABLE.SET_PAGE_SIZE',
  SET_TOTAL: 'FILE_EXPLORER_TABLE.SET_TOTAL',
  SET_SORT_BY: 'FILE_EXPLORER_TABLE.SET_SORT_BY',
  SET_SORT_ORDER: 'FILE_EXPLORER_TABLE.SET_SORT_ORDER',
  SET_FILTER: 'FILE_EXPLORER_TABLE.SET_FILTER',
  SET_SELECTION: 'FILE_EXPLORER_TABLE.SET_SELECTION',
  SET_DATA_ORIGINAL: 'FILE_EXPLORER_TABLE.SET_DATA_ORIGINAL',
  SET_COLUMNS_COMP_MAP: 'FILE_EXPLORER_TABLE.SET_COLUMNS_COMP_MAP',
  SET_PROPERTY_RECORD: 'FILE_EXPLORER_TABLE.SET_PROPERTY_RECORD',
  SET_SIDE_PANEL_OPEN: 'SET_SIDE_PANEL_OPEN',
  SET_SOURCE_TYPE: 'FILE_EXPLORER_TABLE.SET_SOURCE_TYPE',
  SET_CURRENT_GEID: 'FILE_EXPLORER_TABLE.SET_CURRENT_GEID',
  SET_HARD_REFRESH_KEY: 'FILE_EXPLORER_TABLE.SET_HARD_REFRESH_KEY',
};

export const COPY_REQUEST = {
  SET_REQ_LIST: 'SET_REQ_LIST',
  SET_ACTIVE_REQ: 'SET_ACTIVE_REQ',
  SET_STATUS: 'SET_STATUS',
  SET_PAGINATION: 'SET_PAGINATION',
};

export const NOTIFICATIONS = {
  SET_ACTIVE_NOTIFICATION: 'SET_ACTIVE_NOTIFICATION',
  SET_CREATE_NEW_NOTIFICATION_LIST_ITEM__STATUS:
    'SET_CREATE_NEW_NOTIFICATION_LIST_ITEM__STATUS',
  SET_USER_NOTIFICATIONS: 'SET_USER_NOTIFICATIONS',
  SET_NOTIFICATION_LIST: 'SET_NOTIFICATION_LIST',
  SET_UPDATE_NOTIFICATION_TIMES: 'SET_UPDATE_NOTIFICATION_TIMES',
  SET_EDIT_NOTIFICATION: 'SET_EDIT_NOTIFICATION',
};

export const SET_VIRTUAL_FOLDER_OPERATION = 'SET_VIRTUAL_FOLDER_OPERATION';
