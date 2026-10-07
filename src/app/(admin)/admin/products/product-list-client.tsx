"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/domain";
import { archiveProductAction, deleteProductAction } from "@/server/actions/product.actions";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/link-button";
import { Button } from "@/components/ui/button";

interface ProductListClientProps {
  products: Product[];
}

export function ProductListClient({ products }: ProductListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleArchive = (product: Product) => {
    if (!confirm(`Are you sure you want to archive '${product.name}'? It will no longer be visible publicly.`)) {
      return;
    }

    startTransition(async () => {
      try {
        await archiveProductAction(product.id);
        router.refresh();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Failed to archive product.");
      }
    });
  };

  const handleDelete = (product: Product) => {
    if (product.slug === "henu-os") {
      alert("The flagship HENU OS product cannot be deleted.");
      return;
    }

    if (!confirm(`PERMANENT ACTION: Delete product '${product.name}'? This cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteProductAction(product.id);
        router.refresh();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Failed to delete product.");
      }
    });
  };

  return (
    <div className="overflow-x-auto border border-border-default rounded-lg bg-surface-primary shadow-subtle">
      <table className="w-full text-left text-sm" aria-label="Ecosystem Products Table">
        <thead className="bg-surface-secondary/60 text-xs font-mono uppercase tracking-wider text-ink-muted border-b border-border-default">
          <tr>
            <th scope="col" className="px-6 py-4">Product Name</th>
            <th scope="col" className="px-6 py-4">Slug</th>
            <th scope="col" className="px-6 py-4">Status</th>
            <th scope="col" className="px-6 py-4">Development</th>
            <th scope="col" className="px-6 py-4">Variant</th>
            <th scope="col" className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default font-sans">
          {products.map((product) => {
            const isFlagship = product.slug === "henu-os";

            return (
              <tr key={product.id} className="hover:bg-surface-secondary/20 transition-colors">
                <td className="px-6 py-4 font-medium text-ink-primary">
                  <div className="flex items-center gap-2">
                    <span>{product.name}</span>
                    {isFlagship && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase bg-primary text-primary-on rounded">
                        Flagship
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-ink-muted truncate max-w-xs">{product.tagline}</div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-ink-secondary">
                  /products/{product.slug}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      product.status === "published"
                        ? "success"
                        : product.status === "draft"
                        ? "warning"
                        : "neutral"
                    }
                    size="sm"
                  >
                    {product.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-ink-secondary">
                  {product.status_label}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-ink-secondary">
                  {product.template_variant}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/api/preview?path=/products/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-ink-secondary hover:text-ink-primary font-mono focus-visible:outline-focus-ring px-2 py-1 rounded"
                    >
                      Preview
                    </Link>

                    <LinkButton
                      href={`/admin/products/${product.id}`}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </LinkButton>

                    {product.status === "published" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleArchive(product)}
                        className="text-status-warning hover:bg-status-warning/10"
                      >
                        Archive
                      </Button>
                    )}

                    {!isFlagship && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleDelete(product)}
                        className="text-status-error hover:bg-status-error/10"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
