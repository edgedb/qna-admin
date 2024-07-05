import { getTags } from "../lib/db/tags";
import TagsPanel from "../ui/TagsPanel";

export default async function Tags() {
  const tags = await getTags();

  return <TagsPanel tags={tags} />;
}
