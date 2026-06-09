import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("foundry/auth/current-user");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
