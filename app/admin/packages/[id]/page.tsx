import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { PackageEditor } from "@/components/PackageEditor";

export const revalidate = 0;

export default async function AdminPackageDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  const pkg = await db.package.findUnique({
    where: { id: params.id },
    include: {
      seasonalPrices: true,
      versions: {
        orderBy: { versionNumber: "desc" },
      },
    },
  });

  if (!pkg) {
    notFound();
  }

  return <PackageEditor pkg={pkg} currentRole={user.role} />;
}

