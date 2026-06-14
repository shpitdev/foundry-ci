import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("foundry/auth/client-credentials");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
