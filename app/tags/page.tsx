import { getAllTags } from "../lib/db/tags";
import TagsPanel from "../ui/TagsPanel";

export default async function Tags() {
  const tags = await getAllTags();

  return <TagsPanel tags={tags} />;
}
