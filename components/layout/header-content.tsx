import { getDatabase } from "@/lib/notion";

export async function HeaderContent() {
  const { title, icon } = await getDatabase();

  return (
    <div className="flex items-center">
      <div className="flex items-center space-x-1 text-xl">
        {icon && <span className="text-2xl inline-block mb-1">{icon}</span>}
        <span className="inline-block font-semibold">{title}</span>
      </div>
    </div>
  );
}
