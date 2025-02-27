import { getProfile, getDatabase } from "@/lib/notion";
import NotionContent from "@/components/notion/NotionContent";

export default async function ProfilePage() {
  const profile = await getProfile();
  const database = await getDatabase();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* プロフィールヘッダー */}
        <div className="mb-0 text-center">
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background">
              {database.icon &&
                (typeof database.icon === "string" &&
                database.icon.startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={database.icon}
                    alt={database.title || "ブログアイコン"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl bg-background">
                    {database.icon}
                  </div>
                ))}
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            {database.title || "My Blog"}
          </h1>
        </div>

        {/* プロフィールコンテンツ */}
        <div className="prose dark:prose-invert max-w-none mx-auto [&>*]:mx-auto [&>*]:text-center [&_p]:text-center [&_h1]:text-center [&_h2]:text-center [&_h3]:text-center">
          <NotionContent content={profile.content} />
        </div>
      </div>
    </div>
  );
}
