with res := (
  select fts::search(QNADraft, <str>$query, language := 'eng')
)
select count(res.object)