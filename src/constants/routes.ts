export const PATH_CREATE_STAFF = '/staff'
export const PATH_GET_STAFF_PAGINATION = '/staff/pagination'
export const PATH_GET_ONE_STAFF = '/staff/:staffId'
export const PATH_USER = '/user'
export const PATH_GET_USER = '/user/:username'
export const PATH_CHANGE_PASSWORD = '/user/change_password'
export const PATH_GET_USER_PAGINAtION = '/user/pagination'
export const PATH_LOGIN = '/login'
export const PATH_CREATE_MENU_OPTION = '/menu_options'
export const PATH_GET_MENU_OPTION_WITH_PERMISSIONS =
  '/menu_options/get_with_permission'
export const PATH_GET_USER_MENU_OPTIONS = '/menu_options/:username'
export const PATH_GET_ROLE_PAGINATION = '/role/pagination'
export const PATH_CREATE_UPDATE_ROLE = '/role'
export const PATH_GET_PERMISSIONS_PAGINATION = '/permissions/pagination'
export const PATH_CREATE_UPDATE_MODULE = '/module'
export const PATH_GET_PAGINATED_MODULES = '/module/pagination'
export const PATH_CREATE_OR_UPDATE_MODULE_MEMBERS = '/module/members'
// Goals
export const PATH_CREATE_GOAL = '/goal'
export const PATH_GET_GOAL_PAGINATION = '/goal/pagination'
export const PATH_ASSIGN_GOAL_STAFF = '/goal/assign/staff'
export const PATH_ASSIGN_GOAL_MODULE = '/goal/assign/module'
export const PATH_POST_GOAL_PROGRESS = '/goal/progress'
export const PATH_GET_GOAL_SUMMARY_STAFF =
  '/goal/summary/staff/:staffId/:periodId'
export const PATH_GET_GOAL_SUMMARY_MODULE =
  '/goal/summary/module/:moduleId/:periodId'
export const PATH_GET_GOAL_SUMMARY_MODULE_PAGINATION =
  '/goal/summary/module/pagination'
export const PATH_GET_GOALS_BY_MODULE = '/goal/module/:moduleId'

// Competencies
export const PATH_GET_COMPETENCIES = '/competency'

// Evaluations
export const PATH_CREATE_EVALUATION = '/evaluation'
export const PATH_UPDATE_EVALUATION = '/evaluation/:evaluationId'
export const PATH_GET_EVALUATION = '/evaluation/:evaluationId'
export const PATH_GET_EVALUATION_PAGINATION = '/evaluation/pagination'

// Dashboard
export const PATH_GET_DASHBOARD_SUMMARY = '/dashboard/summary'
export const PATH_GET_DASHBOARD_ACTIVITY = '/dashboard/activity'
