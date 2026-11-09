import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { VersionHistoryView } from "@/components/VersionHistoryView";

export const revalidate = 0;
export const runtime = "edge";

export default async function PackageHistoryPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  const pkg: any = await db.package.findUnique({
    where: { id: params.id },
    include: {
      versions: {
        orderBy: { versionNumber: "desc" },
      },
    },
  });

  if (!pkg) {
    notFound();
  }

  return (
    <VersionHistoryView
      pkg={pkg}
      versions={pkg.versions}
      activeVersionId={pkg.activeVersionId}
      currentRole={user.role}
    />
  );
}

