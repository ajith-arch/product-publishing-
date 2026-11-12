"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatBytes, type LocalImage } from "@/lib/product/image-store";
import { cn } from "@/lib/utils";

export function ImagePicker({
  images,
  primaryId,
  onAdd,
  onRemove,
  onSetPrimary,
  error,
}: {
  images: LocalImage[];
  primaryId?: string | null;
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
  onSetPrimary?: (id: string) => void;
  error?: string | null;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onAdd(Array.from(e.dataTransfer.files));
        }}
        className={cn(
          "text-muted-foreground flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center text-sm transition-colors",
          "has-[input:focus-visible]:ring-ring/50 has-[input:focus-visible]:ring-[3px]",
          dragging ? "border-brand bg-accent" : "hover:bg-muted/60",
        )}
      >
        <ImagePlus className="size-6" aria-hidden />
        <span>
          <span className="text-foreground font-medium">Choose images</span> or drag them here
        </span>
        <span className="text-xs">PNG, JPG, WebP or GIF · up to 10 MB each · optional</span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            onAdd(Array.from(e.target.files ?? []));
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
      </label>

      {error && (
        <p role="alert" className="text-destructive text-xs">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img) => {
            const isPrimary = primaryId === img.id;
            return (
              <li
                key={img.id}
                className={cn(
                  "bg-card overflow-hidden rounded-lg border",
                  isPrimary && onSetPrimary && "ring-brand ring-2",
                )}
              >
                <div className="bg-muted relative aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local object URL */}
                  <img src={img.url} alt={img.name} className="size-full object-contain" />
                  {isPrimary && onSetPrimary && (
                    <span className="bg-brand absolute top-2 left-2 rounded px-1.5 py-0.5 text-[11px] font-medium text-white">
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 p-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium" title={img.name}>
                      {img.name}
                    </p>
                    <p className="text-muted-foreground text-[11px]">{formatBytes(img.size)}</p>
                  </div>
                  {onSetPrimary && !isPrimary && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      aria-label={`Set ${img.name} as primary image`}
                      title="Set as primary"
                      onClick={() => onSetPrimary(img.id)}
                    >
                      <Star />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive size-7"
                    aria-label={`Remove ${img.name}`}
                    title="Remove"
                    onClick={() => onRemove(img.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
