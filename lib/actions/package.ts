"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { getCurrentUser } from "../auth";

export async function updateSeasonalPrices(
  packageId: string,
  prices: Array<{
    id?: string;
    seasonName: string;
    startMonth: number;
    endMonth: number;
    priceInr: number;
  }>
) {
  const user = await getCurrentUser();

  // Validate for negative or zero prices
  for (const p of prices) {
    if (p.priceInr <= 0) {
      throw new Error("Price must be greater than zero.");
    }
  }

  // Transactionally update seasonal prices
  await db.$transaction(async (tx) => {
    // Delete existing prices for package
    await tx.seasonalPrice.deleteMany({
      where: { packageId },
    });

    // Create new prices
    for (const p of prices) {
      await tx.seasonalPrice.create({
        data: {
          packageId,
          seasonName: p.seasonName,
          startMonth: p.startMonth,
          endMonth: p.endMonth,
          priceInr: p.priceInr,
          taxIncluded: true,
        },
      });
    }

    // Record activity log
    await tx.activityLog.create({
      data: {
        userRole: user.role,
        userName: user.name,
        action: "PRICE_UPDATE",
        details: `Updated seasonal rates for package ${packageId}`,
      },
    });
  });

  revalidatePath(`/packages`);
  revalidatePath(`/admin/packages/${packageId}`);
  return { success: true };
}

export async function createPackageVersion(
  packageId: string,
  data: {
    title: string;
    durationDays: number;
    hotelStandard: string;
    destinations: string[];
    itinerary: Array<{ day: number; title: string; description: string }>;
    inclusions: string[];
    exclusions: string[];
    changeSummary: string;
    publishImmediately?: boolean;
  }
) {
  const user = await getCurrentUser();

  const currentPkg = await db.package.findUnique({
    where: { id: packageId },
    include: { versions: { orderBy: { versionNumber: "desc" }, take: 1 } },
  });

  if (!currentPkg) throw new Error("Package not found");

  const nextVersionNumber = (currentPkg.versions[0]?.versionNumber || 0) + 1;

  const newVersion = await db.packageVersion.create({
    data: {
      packageId,
      versionNumber: nextVersionNumber,
      title: data.title,
      durationDays: data.durationDays,
      hotelStandard: data.hotelStandard,
      destinations: JSON.stringify(data.destinations),
      itineraryJson: JSON.stringify(data.itinerary),
      inclusionsJson: JSON.stringify({
        inclusions: data.inclusions,
        exclusions: data.exclusions,
      }),
      changeSummary: data.changeSummary || `Version ${nextVersionNumber} revision`,
      authorRole: user.role,
      authorName: user.name,
    },
  });

  // If publishing or admin update
  if (data.publishImmediately) {
    await db.package.update({
      where: { id: packageId },
      data: {
        title: data.title,
        durationDays: data.durationDays,
        hotelStandard: data.hotelStandard,
        destinations: JSON.stringify(data.destinations),
        activeVersionId: newVersion.id,
        status: "PUBLISHED",
      },
    });
  }

  await db.activityLog.create({
    data: {
      userRole: user.role,
      userName: user.name,
      action: data.publishImmediately ? "PACKAGE_PUBLISHED" : "VERSION_SAVED",
      details: `Saved version v${nextVersionNumber} for ${packageId} (${data.changeSummary})`,
    },
  });

  revalidatePath(`/packages`);
  revalidatePath(`/admin/packages/${packageId}`);
  revalidatePath(`/admin/packages/${packageId}/history`);
  return { success: true, versionId: newVersion.id };
}

export async function rollbackToVersion(packageId: string, targetVersionId: string) {
  const user = await getCurrentUser();

  const targetVersion = await db.packageVersion.findUnique({
    where: { id: targetVersionId },
  });

  if (!targetVersion || targetVersion.packageId !== packageId) {
    throw new Error("Target version does not exist.");
  }

  await db.package.update({
    where: { id: packageId },
    data: {
      title: targetVersion.title,
      durationDays: targetVersion.durationDays,
      hotelStandard: targetVersion.hotelStandard,
      destinations: targetVersion.destinations,
      activeVersionId: targetVersion.id,
      status: "PUBLISHED",
    },
  });

  await db.activityLog.create({
    data: {
      userRole: user.role,
      userName: user.name,
      action: "ROLLBACK",
      details: `Restored ${packageId} to version v${targetVersion.versionNumber} ("${targetVersion.changeSummary}")`,
    },
  });

  revalidatePath(`/packages`);
  revalidatePath(`/admin/packages/${packageId}`);
  revalidatePath(`/admin/packages/${packageId}/history`);
  return { success: true };
}

