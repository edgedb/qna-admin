with res := (
  select fts::search(QNA, <str>$query, language := 'eng')
)
select count(res.object)