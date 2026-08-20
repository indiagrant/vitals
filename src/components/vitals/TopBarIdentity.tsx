import { Eyebrow } from "@/components/ui/Eyebrow";

interface TopBarIdentityProps {
  label: string;
}

/**
 * The "who am I looking at" text on the left of the topbar — an employee's
 * name/role, or the admin all-teams summary. One component, one call site
 * in TopBar, no per-page variants, so it can't drift in size/style between
 * views the way ad-hoc inline JSX could.
 */
export function TopBarIdentity({ label }: TopBarIdentityProps) {
  return <Eyebrow>{label}</Eyebrow>;
}
