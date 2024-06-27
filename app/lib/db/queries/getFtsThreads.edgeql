with res := (
  select fts::search(discord::Message, <str>$query, language := 'eng')
),
messages := (
  select res.object order by res.score desc
)
select distinct messages.<messages[is Thread] {
  id,
  messages: {
    content,
    created_at,
  } limit 5,
}
filter not exists .draft and not exists .qna
offset <int32>$offset
limit <int16>$limit;
