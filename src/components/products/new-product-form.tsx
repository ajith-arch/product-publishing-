"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2, Sparkles } from "lucide-react";

import { Field, describedBy } from "@/components/products/field";
import { ImagePicker } from "@/components/products/image-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  imageStore,
  revokeImages,
  toLocalImages,
  type LocalImage,
} from "@/lib/product/image-store";
import { productInputSchema, type ProductInput } from "@/lib/product/schema";
import { productEditHref } from "@/lib/product/routes";
import { productStore } from "@/lib/product/store";

export function NewProductForm() {
  const router = useRouter();
  const [images, setImages] = useState<LocalImage[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const handedOff = useRef(false);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  // Release previews if the user leaves without generating.
  useEffect(
    () => () => {
      if (!handedOff.current) revokeImages(imagesRef.current);
    },
    [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productInputSchema),
    defaultValues: { sku: "", internalId: "", productName: "" },
  });

  const onSubmit = handleSubmit((values) => {
    const record = productStore.create(values);
    imageStore.set(record.id, { images, primaryId: images[0]?.id ?? null });
    handedOff.current = true;
    router.push(productEditHref(record.id));
  });

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>
          Identifiers are saved exactly as entered and are never changed by AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="sku" label="SKU" required error={errors.sku?.message}>
              <Input
                id="sku"
                placeholder="e.g. 41000529749"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={!!errors.sku}
                aria-describedby={describedBy("sku", { error: errors.sku })}
                {...register("sku")}
              />
            </Field>
            <Field
              id="internalId"
              label="NetSuite Internal ID"
              required
              error={errors.internalId?.message}
              hint="Digits only, as shown in NetSuite."
            >
              <Input
                id="internalId"
                inputMode="numeric"
                placeholder="Enter Internal ID"
                autoComplete="off"
                aria-invalid={!!errors.internalId}
                aria-describedby={describedBy("internalId", {
                  error: errors.internalId,
                  hint: true,
                })}
                {...register("internalId")}
              />
            </Field>
          </div>

          <Field id="productName" label="Product Name" required error={errors.productName?.message}>
            <Input
              id="productName"
              placeholder="e.g. APPLE 24-INCH IMAC RETINA 4.5K M6 12C CPU 12C GPU"
              autoComplete="off"
              aria-invalid={!!errors.productName}
              aria-describedby={describedBy("productName", { error: errors.productName })}
              {...register("productName")}
            />
          </Field>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-medium">
              Product Images <span className="text-muted-foreground font-normal">(optional)</span>
            </legend>
            <ImagePicker
              images={images}
              error={imageError}
              onAdd={(files) => {
                const { images: added, rejected } = toLocalImages(files);
                setImages((prev) => [...prev, ...added]);
                setImageError(rejected.length ? rejected.join(" ") : null);
              }}
              onRemove={(id) => {
                setImages((prev) => {
                  const gone = prev.filter((i) => i.id === id);
                  revokeImages(gone);
                  return prev.filter((i) => i.id !== id);
                });
              }}
            />
          </fieldset>

          <div className="flex flex-col gap-3 border-t pt-5">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:self-start"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Generate Product Information
            </Button>
            <p className="text-muted-foreground flex items-start gap-1.5 text-xs">
              <Info className="mt-px size-3.5 shrink-0" aria-hidden />
              Prototype: this creates placeholder content from a mock generator. Live AI research is
              not connected yet (Milestone 4).
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
