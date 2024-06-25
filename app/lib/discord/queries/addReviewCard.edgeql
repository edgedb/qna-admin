with
  thread := (select discord::Thread filter .id = <uuid>$threadId)
update thread
set {
  review_card := (
    insert discord::ReviewCard {
      message_id := <str>$messageId,
      thread_id := <str>$reviewThreadId,
    }
  )
}