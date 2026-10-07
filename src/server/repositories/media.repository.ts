import "server-only";
import { BaseRepository } from "./base.repository";
import type { MediaAsset } from "@/types/domain";
import type { Database } from "@/types/database";
import { AppError } from "@/lib/errors";

export type CreateMediaAssetInput = Database["public"]["Tables"]["media_assets"]["Insert"];
export type UpdateMediaAssetInput = Database["public"]["Tables"]["media_assets"]["Update"];

export class MediaRepository extends BaseRepository {
  private inMemoryAssets: MediaAsset[] = [];

  /**
   * Saves a newly uploaded and verified media asset record.
   */
  async createMediaAsset(input: CreateMediaAssetInput): Promise<MediaAsset> {
    if (!this.isConfigured) {
      const asset: MediaAsset = {
        ...input,
        id: `media-${Date.now()}`,
        alt_text: input.alt_text ?? null,
        is_decorative: input.is_decorative ?? false,
        focal_point: input.focal_point ?? null,
        variants: input.variants ?? null,
        width: input.width ?? null,
        height: input.height ?? null,
        uploaded_by: input.uploaded_by ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.inMemoryAssets.unshift(asset);
      return asset;
    }

    const { data, error } = await this.serviceClient
      .from("media_assets")
      .insert(input)
      .select()
      .single();

    if (error || !data) {
      throw new AppError("INTERNAL_ERROR", "Failed to create media asset record.", {
        status: 500,
        details: error?.message,
      });
    }

    return data;
  }

  /**
   * Retrieves a media asset by ID.
   */
  async getMediaAssetById(id: string): Promise<MediaAsset | null> {
    if (!this.isConfigured) {
      return this.inMemoryAssets.find((a) => a.id === id) ?? null;
    }

    const { data, error } = await this.serviceClient
      .from("media_assets")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new AppError("INTERNAL_ERROR", "Error fetching media asset.", {
        status: 500,
        details: error.message,
      });
    }

    return data;
  }

  /**
   * Lists media assets with optional pagination.
   */
  async listMediaAssets(options: {
    limit?: number;
    offset?: number;
  } = {}): Promise<{ assets: MediaAsset[]; total: number }> {
    if (!this.isConfigured) {
      const total = this.inMemoryAssets.length;
      const offset = options.offset ?? 0;
      const limit = options.limit ?? 24;
      return {
        assets: this.inMemoryAssets.slice(offset, offset + limit),
        total,
      };
    }

    const query = this.serviceClient
      .from("media_assets")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (options.limit) {
      query.limit(options.limit);
    }
    if (options.offset) {
      query.range(options.offset, options.offset + (options.limit ?? 24) - 1);
    }

    try {
      const { data, error, count } = await query;

      if (error) {
        return { assets: [], total: 0 };
      }

      return {
        assets: data ?? [],
        total: count ?? 0,
      };
    } catch {
      return { assets: [], total: 0 };
    }
  }

  /**
   * Updates metadata for a media asset (alt text, decorative flag, focal point).
   */
  async updateMediaAsset(
    id: string,
    input: UpdateMediaAssetInput
  ): Promise<MediaAsset> {
    if (!this.isConfigured) {
      const idx = this.inMemoryAssets.findIndex((a) => a.id === id);
      if (idx === -1) {
        throw new AppError("NOT_FOUND", "Media asset not found or update failed.", { status: 404 });
      }
      this.inMemoryAssets[idx] = {
        ...this.inMemoryAssets[idx],
        ...input,
        updated_at: new Date().toISOString(),
      } as MediaAsset;
      return this.inMemoryAssets[idx];
    }

    const { data, error } = await this.serviceClient
      .from("media_assets")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      throw new AppError("NOT_FOUND", "Media asset not found or update failed.", {
        status: 404,
        details: error?.message,
      });
    }

    return data;
  }

  /**
   * Checks whether a media asset is currently in use across products or portfolio projects.
   */
  async checkMediaUsage(id: string): Promise<{ inUse: boolean; locations: string[] }> {
    if (!this.isConfigured) {
      return { inUse: false, locations: [] };
    }

    const locations: string[] = [];

    // Check products
    const { data: products } = await this.serviceClient
      .from("products")
      .select("name")
      .eq("cover_media_id", id);

    if (products && products.length > 0) {
      products.forEach((p) => locations.push(`Product: ${p.name}`));
    }

    // Check portfolio projects
    const { data: projects } = await this.serviceClient
      .from("portfolio_projects")
      .select("title")
      .eq("cover_media_id", id);

    if (projects && projects.length > 0) {
      projects.forEach((prj) => locations.push(`Project: ${prj.title}`));
    }

    return {
      inUse: locations.length > 0,
      locations,
    };
  }

  /**
   * Deletes a media asset if not currently referenced in published content (SEC-006, ADMIN-006).
   */
  async deleteMediaAsset(id: string): Promise<void> {
    if (!this.isConfigured) {
      this.inMemoryAssets = this.inMemoryAssets.filter((a) => a.id !== id);
      return;
    }

    const usage = await this.checkMediaUsage(id);
    if (usage.inUse) {
      throw new AppError(
        "CONFLICT",
        `Cannot delete media asset because it is currently in use: ${usage.locations.join(", ")}`,
        { status: 409 }
      );
    }

    const { error } = await this.serviceClient.from("media_assets").delete().eq("id", id);

    if (error) {
      throw new AppError("INTERNAL_ERROR", "Failed to delete media asset record.", {
        status: 500,
        details: error.message,
      });
    }
  }
}

export const mediaRepository = new MediaRepository();
