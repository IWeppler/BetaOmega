// src/app/(views)/dashboard/[slug]/page.tsx
import { use } from "react";
import { Content } from "../components/Content";

export default function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <Content slug={slug} />;
}
