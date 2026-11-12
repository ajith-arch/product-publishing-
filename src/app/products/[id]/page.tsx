import { ProductEditorPage } from "@/components/editor/product-editor-page";

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  return <ProductEditorPage id={id} tab={typeof tab === "string" ? tab : undefined} />;
}
