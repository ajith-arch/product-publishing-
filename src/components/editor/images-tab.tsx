"use client";

import { useState } from "react";
import { Info } from "lucide-react";

import { ImagePicker } from "@/components/products/image-picker";
import { Section } from "@/components/editor/section";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  imageStore,
  normalizePrimary,
  revokeImages,
  toLocalImages,
  useProductImages,
} from "@/lib/product/image-store";
import type { EditorTabProps } from "./types";

export function ImagesTab({ record }: EditorTabProps) {
  const { images, primaryId } = useProductImages(record.id);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <Alert variant="info">
        <Info />
        <AlertDescription>
          Images stay in this browser tab only. They are not saved and are cleared when the page is
          refreshed. Image storage and export handling come in a later milestone.
        </AlertDescription>
      </Alert>

      <Section
        title="Product images"
        description="The primary image is used as the main listing image."
      >
        <ImagePicker
          images={images}
          primaryId={primaryId}
          error={error}
          onAdd={(files) => {
            const { images: added, rejected } = toLocalImages(files);
            const next = [...images, ...added];
            imageStore.set(record.id, {
              images: next,
              primaryId: normalizePrimary(next, primaryId),
            });
            setError(rejected.length ? rejected.join(" ") : null);
          }}
          onRemove={(id) => {
            revokeImages(images.filter((i) => i.id === id));
            const next = images.filter((i) => i.id !== id);
            imageStore.set(record.id, {
              images: next,
              primaryId: normalizePrimary(next, primaryId),
            });
          }}
          onSetPrimary={(id) => imageStore.set(record.id, { images, primaryId: id })}
        />
      </Section>

      <Section title="Suggested image sources">
        <p className="text-muted-foreground text-sm">
          No suggestions. Manufacturer image links will appear here once live research is connected
          (Milestone 4). Suggested links are never treated as verified assets.
        </p>
      </Section>
    </div>
  );
}
