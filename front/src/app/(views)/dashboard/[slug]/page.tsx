import { use } from "react";
import { Content } from "@/features/books/Content";

export default function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <Content slug={slug} />;
}
