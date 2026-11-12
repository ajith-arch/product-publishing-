import { PageHeader } from "@/components/layout/page-header";
import { NewProductForm } from "@/components/products/new-product-form";

export default function NewProductPage() {
  return (
    <>
      <PageHeader title="Create Product" description="Generate a new product listing." />
      <NewProductForm />
    </>
  );
}
