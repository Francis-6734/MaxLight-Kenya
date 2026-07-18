export const ROLES = [
  "SUPER_ADMIN",
  "ADMINISTRATOR",
  "MARKETING_MANAGER",
  "MARKETING_STAFF",
  "SALES_MANAGER",
  "SALES_REPRESENTATIVE",
  "INVENTORY_MANAGER",
  "WAREHOUSE_STAFF",
  "CUSTOMER_SUPPORT",
  "INTERIOR_DESIGNER",
  "PROJECT_MANAGER",
  "FINANCE",
  "HR",
  "CONTENT_EDITOR",
  "SEO_MANAGER",
  "CUSTOMER",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMINISTRATOR: "Administrator",
  MARKETING_MANAGER: "Marketing Manager",
  MARKETING_STAFF: "Marketing Staff",
  SALES_MANAGER: "Sales Manager",
  SALES_REPRESENTATIVE: "Sales Representative",
  INVENTORY_MANAGER: "Inventory Manager",
  WAREHOUSE_STAFF: "Warehouse Staff",
  CUSTOMER_SUPPORT: "Customer Support",
  INTERIOR_DESIGNER: "Interior Designer",
  PROJECT_MANAGER: "Project Manager",
  FINANCE: "Finance",
  HR: "HR",
  CONTENT_EDITOR: "Content Editor",
  SEO_MANAGER: "SEO Manager",
  CUSTOMER: "Customer",
};

/** Roles considered "staff" — anyone who should be able to reach /admin at all. */
export const STAFF_ROLES: Role[] = ROLES.filter((r) => r !== "CUSTOMER");

export function isStaffRole(role: string): boolean {
  return (STAFF_ROLES as string[]).includes(role);
}

// Coarse-grained module permissions. Every staff role can *view* the admin
// area; these gate the destructive/write actions per module. Re-check these
// server-side in every action — never trust a hidden button as the only guard.
const CATALOG_MANAGERS: Role[] = ["SUPER_ADMIN", "ADMINISTRATOR", "INVENTORY_MANAGER"];
const ORDER_MANAGERS: Role[] = ["SUPER_ADMIN", "ADMINISTRATOR", "SALES_MANAGER", "SALES_REPRESENTATIVE", "CUSTOMER_SUPPORT"];
const USER_MANAGERS: Role[] = ["SUPER_ADMIN", "ADMINISTRATOR", "HR"];
const CONTENT_MANAGERS: Role[] = ["SUPER_ADMIN", "ADMINISTRATOR", "MARKETING_MANAGER", "MARKETING_STAFF", "CONTENT_EDITOR"];
const SETTINGS_MANAGERS: Role[] = ["SUPER_ADMIN", "ADMINISTRATOR", "MARKETING_MANAGER", "SEO_MANAGER"];

export function canManageCatalog(role: string): boolean {
  return (CATALOG_MANAGERS as string[]).includes(role);
}

export function canManageOrders(role: string): boolean {
  return (ORDER_MANAGERS as string[]).includes(role);
}

export function canManageUsers(role: string): boolean {
  return (USER_MANAGERS as string[]).includes(role);
}

/** Blog, projects, designers, homepage sections & hero slides. */
export function canManageContent(role: string): boolean {
  return (CONTENT_MANAGERS as string[]).includes(role);
}

/** Site settings, footer links, SEO defaults. */
export function canManageSettings(role: string): boolean {
  return (SETTINGS_MANAGERS as string[]).includes(role);
}
