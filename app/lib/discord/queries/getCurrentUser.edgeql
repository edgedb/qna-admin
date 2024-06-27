select (global current_moderator) {
  email,
  account: {
    name, user_id
  }
}