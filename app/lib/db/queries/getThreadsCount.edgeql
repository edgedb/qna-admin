
select count(
  discord::Thread
  filter not exists .draft and not exists .qna
)


