"use client";

import { useSyncExternalStore } from "react";

/**
 * In-memory image store. Files stay in this browser tab as object URLs and are
 * NOT persisted: a page refresh clears them. Real image storage comes later.
 */

export type LocalImage = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
};

export type ProductImages = { images: LocalImage[]; primaryId: string | null };

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const EMPTY: ProductImages = { images: [], primaryId: null };

const byProduct = new Map<string, ProductImages>();
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function toLocalImages(files: File[]): { images: LocalImage[]; rejected: string[] } {
  const images: LocalImage[] = [];
  const rejected: string[] = [];
  for (const f of files) {
    if (!f.type.startsWith("image/")) rejected.push(`${f.name} is not an image.`);
    else if (f.size > MAX_IMAGE_BYTES) rejected.push(`${f.name} is larger than 10 MB.`);
    else
      images.push({
        id: crypto.randomUUID(),
        name: f.name,
        size: f.size,
        type: f.type,
        url: URL.createObjectURL(f),
      });
  }
  return { images, rejected };
}

export function revokeImages(images: LocalImage[]) {
  for (const img of images) URL.revokeObjectURL(img.url);
}

export const imageStore = {
  set(productId: string, value: ProductImages) {
    byProduct.set(productId, value);
    emit();
  },
  delete(productId: string) {
    const v = byProduct.get(productId);
    if (v) revokeImages(v.images);
    byProduct.delete(productId);
    emit();
  },
};

export function useProductImages(productId: string): ProductImages {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => byProduct.get(productId) ?? EMPTY,
    () => EMPTY,
  );
}

/** Keeps `primaryId` valid after images are added or removed. */
export function normalizePrimary(images: LocalImage[], primaryId: string | null): string | null {
  if (primaryId && images.some((i) => i.id === primaryId)) return primaryId;
  return images[0]?.id ?? null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
