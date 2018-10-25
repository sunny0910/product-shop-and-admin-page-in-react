const checkIsAdmin =  (userRoleId) => {
  if (userRoleId === 1) {
      return true;
    }
    return false;
}

export default checkIsAdmin;