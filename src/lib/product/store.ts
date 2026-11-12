"use client";

import { useSyncExternalStore } from "react";
import { z } from "zod";

import { createProductRecord } from "./mock-generator";
import { approve, saveDraft } from "./operations";
import {
  productRecordSchema,
  type Merchandising,
  type ProductContent,
  type ProductInput,
  type ProductRecord,
} from "./schema";

/**
 * Browser-only product store backed by localStorage.
 * Prototype persistence: data lives in this browser only. Replace with a real
 * database when shared access is needed.
 */

const STORAGE_KEY = "pps.products.v1";

type State = { products: ProductRecord[]; hydrated: boolean };

const SERVER_STATE: State = { products: [], hydrated: false };
let state: State = SERVER_STATE;
const listeners = new Set<() => void>();
let storageError: string | null = null;

function emit() {
  for (const l of listeners) l();
}

function hydrate() {
  if (state.hydrated) return;
  let products: ProductRecord[] = [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = z.array(z.unknown()).safeParse(JSON.parse(raw));
      if (parsed.success) {
        products = parsed.data.flatMap((item) => {
          const r = productRecordSchema.safeParse(item);
          return r.success ? [r.data] : [];
        });
      }
    }
  } catch {
    storageError = "Saved products could not be read from this browser.";
  }
  state = { products, hydrated: true };
  emit();
}

function persist(products: ProductRecord[]) {
  state = { ...state, products };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    storageError = null;
  } catch {
    storageError = "Changes could not be saved to browser storage. They will be lost on refresh.";
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  hydrate();
  return () => listeners.delete(listener);
}

function update(id: string, fn: (r: ProductRecord) => ProductRecord) {
  persist(state.products.map((p) => (p.id === id ? fn(p) : p)));
}

function nowIso() {
  return new Date().toISOString();
}

export const productStore = {
  create(input: ProductInput): ProductRecord {
    hydrate();
    const record = createProductRecord(input, crypto.randomUUID(), nowIso());
    persist([record, ...state.products]);
    return record;
  },
  saveDraft(id: string, edited: ProductContent, merchandising: Merchandising) {
    update(id, (r) => saveDraft(r, edited, merchandising, nowIso()));
  },
  approve(id: string, edited: ProductContent, merchandising: Merchandising) {
    const record = state.products.find((p) => p.id === id);
    if (!record) return { ok: false as const, errors: ["Product not found."] };
    const result = approve(record, edited, merchandising, nowIso());
    if (result.ok) update(id, () => result.record);
    return result;
  },
  remove(id: string) {
    persist(state.products.filter((p) => p.id !== id));
  },
  clearAll() {
    persist([]);
  },
};

export function useProductStore() {
  const s = useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  );
  return { ...s, storageError };
}

export function useProduct(id: string) {
  const { products, hydrated } = useProductStore();
  return { product: products.find((p) => p.id === id), hydrated };
}
