import React from 'react';

import { connect } from "react-redux"

const foo = state => ({
  user: state.user
})

const UserAvatar = connect(foo)(({ user, size }) => (
  <img
    className={`user-avatar ${size || ""}`}
    alt="user avatar"
    src={user.avatar}
  />
));

export default UserAvatar