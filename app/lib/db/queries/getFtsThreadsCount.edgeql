with res := (
  select fts::search(discord::Message, <str>$query, language := 'eng')
)
select count(
  distinct res.object.<messages[is Thread]
  filter not exists .draft and not exists .qna
)
