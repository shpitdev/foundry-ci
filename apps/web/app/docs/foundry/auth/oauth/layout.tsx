import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("foundry/auth/oauth");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
