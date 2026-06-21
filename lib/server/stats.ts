import { prisma } from "./db";

export type AdminStats = {
  orders: {
    total: number;
    new: number;
    inProgress: number;
    done: number;
    cancelled: number;
    unpaid: number;
    paid: number;
  };
  invitations: {
    total: number;
    published: number;
    totalViews: number;
  };
  templates: {
    total: number;
    published: number;
  };
  revenue: {
    paidOrders: number;
    paidAmountUzs: number;
  };
  topTemplates: Array<{
    templateId: string;
    name: string;
    orderCount: number;
  }>;
};

export async function getAdminStats(): Promise<AdminStats> {
  const [
    orders,
    invitations,
    templates,
    orderGroups,
  ] = await Promise.all([
    prisma.order.findMany({
      select: { status: true, paymentStatus: true, priceAmount: true, currency: true },
    }),
    prisma.invitation.findMany({
      select: { isPublished: true, views: true },
    }),
    prisma.template.findMany({
      select: { isPublished: true, views: true },
    }),
    prisma.order.groupBy({
      by: ["templateId"],
      _count: { _all: true },
      orderBy: { _count: { templateId: "desc" } },
      take: 5,
    }),
  ]);

  const templateIds = orderGroups.map((g) => g.templateId);
  const templateNames = templateIds.length
    ? await prisma.template.findMany({
        where: { id: { in: templateIds } },
        select: { id: true, name: true },
      })
    : [];
  const nameById = new Map(templateNames.map((t) => [t.id, t.name]));

  const paidOrders = orders.filter((o) => o.paymentStatus === "PAID");

  const invitationViews = invitations.reduce((sum, i) => sum + i.views, 0);
  const templatePreviewViews = templates.reduce((sum, t) => sum + t.views, 0);

  return {
    orders: {
      total: orders.length,
      new: orders.filter((o) => o.status === "NEW").length,
      inProgress: orders.filter((o) => o.status === "IN_PROGRESS").length,
      done: orders.filter((o) => o.status === "DONE").length,
      cancelled: orders.filter((o) => o.status === "CANCELLED").length,
      unpaid: orders.filter((o) => o.paymentStatus === "UNPAID").length,
      paid: paidOrders.length,
    },
    invitations: {
      total: invitations.length,
      published: invitations.filter((i) => i.isPublished).length,
      totalViews: invitationViews + templatePreviewViews,
    },
    templates: {
      total: templates.length,
      published: templates.filter((t) => t.isPublished).length,
    },
    revenue: {
      paidOrders: paidOrders.length,
      paidAmountUzs: paidOrders.reduce(
        (sum, o) => sum + (o.currency === "UZS" ? (o.priceAmount ?? 0) : 0),
        0,
      ),
    },
    topTemplates: orderGroups.map((g) => ({
      templateId: g.templateId,
      name: nameById.get(g.templateId) ?? "—",
      orderCount: g._count._all,
    })),
  };
}
