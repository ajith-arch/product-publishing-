"use client";

import { Trash2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { productStore, useProductStore } from "@/lib/product/store";

export function SettingsView() {
  const { products, hydrated, storageError } = useProductStore();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Local data</CardTitle>
          <CardDescription>
            Products are saved in this browser only (local storage). They are not shared with other
            browsers, devices or people. Images are never saved.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {storageError && (
            <Alert variant="destructive">
              <AlertDescription>{storageError}</AlertDescription>
            </Alert>
          )}
          <p className="text-sm">
            Saved products:{" "}
            <span className="font-medium tabular-nums">{hydrated ? products.length : "–"}</span>
          </p>
          <Button
            variant="outline"
            className="text-destructive w-fit"
            disabled={!hydrated || products.length === 0}
            onClick={() => {
              if (
                window.confirm(
                  "Delete all saved products from this browser? This cannot be undone.",
                )
              ) {
                productStore.clearAll();
              }
            }}
          >
            <Trash2 />
            Clear all local data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 text-sm sm:grid-cols-[12rem_1fr]">
            <dt className="text-muted-foreground">AI research provider</dt>
            <dd>Not connected (Milestone 4)</dd>
            <dt className="text-muted-foreground">NetSuite</dt>
            <dd>No direct integration. Export a CSV and import it manually.</dd>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
