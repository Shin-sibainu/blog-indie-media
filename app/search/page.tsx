import { getAllPosts } from "@/lib/notion";
import { SearchContent } from "./search-content";

export default async function SearchPage() {
  const initialPosts = await getAllPosts();

  return <SearchContent initialPosts={initialPosts} />;
}
