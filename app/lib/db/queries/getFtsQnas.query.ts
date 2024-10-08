// GENERATED by @edgedb/generate v0.5.4

import type {Executor} from "edgedb";

export type GetFtsQnasArgs = {
  readonly "query": string;
  readonly "offset": number;
  readonly "limit": number;
};

export type GetFtsQnasReturns = Array<{
  "id": string;
  "title": string;
  "question": string;
  "linkedTags": Array<{
    "name": string;
    "disabled": boolean | null;
  }>;
  "score": number;
}>;

export function getFtsQnas(client: Executor, args: GetFtsQnasArgs): Promise<GetFtsQnasReturns> {
  return client.query(`\
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
limit <int16>$limit;`, args);

}
