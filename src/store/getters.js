const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  uid: state => state.user.uid,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission: state => state.user.permission,
  isAdmin: state => state.user.isAdmin,
  userInfo: state => state.user.userInfo,
  routes: state => state.permission.routes
}
export default getters
