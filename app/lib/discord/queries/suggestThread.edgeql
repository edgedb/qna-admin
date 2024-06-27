with
  messageContent := json_array_unpack(<json>$messages),
  authors := (
    id := <str>messageContent["author"]["id"],
    username := <str>messageContent["author"]["username"]
  ),
  users := (
    for user in (distinct ({
      authors,
      (id := <str>$suggestorId, username := <str>$suggestorName)
    }))
    union (
      insert discord::User {
        user_id := user.id,
        name := user.username,
      }
      unless conflict on .user_id else (
        select discord::User
      )
    )
  ),
  messages := (
    for message in messageContent
    union (
      insert discord::Message {
        message_id := <str>message["id"],
        content := <str>message["content"],
        author := (
          select users filter .user_id = <str>message["author"]["id"]
        )
      }
      unless conflict on .message_id else (select discord::Message)
    )
  ),
  suggested_by := (select users filter .user_id = <str>$suggestorId),
  thread := (insert discord::Thread {
    thread_id := <str>$threadId,
    messages := messages,
    suggested_by := suggested_by
  } unless conflict on .thread_id else (select discord::Thread))
select thread {
  id,
  thread_id, 
  messages: {
    content,
    author: {
      name,
    }
  },
  suggested_by: {
    name,
    user_id
  },
}