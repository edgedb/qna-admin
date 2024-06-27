with res := (
  select fts::search(QNA, <str>$query, language := 'eng')
)
select res.object {
  id, 
  title,
  question,
  linkedTags: {
    name,
    disabled
  },
  score := res.score
} 
order by res.score desc
offset <int32>$offset
limit <int16>$limit;