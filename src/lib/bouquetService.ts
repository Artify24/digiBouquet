import { supabase } from "./supabase";
import type { BouquetState } from "../types";

/** Characters used in slug generation — unambiguous, URL-safe */
const SLUG_CHARS = "abcdefghjkmnpqrstuvwxyz23456789";
const SLUG_LENGTH = 7;

/** Generate a random URL-safe slug */
function generateSlug(length = SLUG_LENGTH): string {
  let slug = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (const byte of array) {
    slug += SLUG_CHARS[byte % SLUG_CHARS.length];
  }
  return slug;
}

/**
 * Save a bouquet to Supabase, retrying up to `maxAttempts` on slug collisions.
 * Returns the generated slug on success.
 */
export async function saveBouquet(
  state: BouquetState,
  maxAttempts = 5
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const slug = generateSlug();
    const { message, ...compositionFields } = state;

    const { error } = await supabase.from("bouquets").insert({
      slug,
      message: message || null,
      composition: compositionFields, // flowers, greenery, arrangement, wrap
    });

    if (!error) return slug;

    // 23505 = unique_violation (slug collision); retry
    if ((error as { code?: string }).code !== "23505") {
      throw new Error(`Failed to save bouquet: ${error.message}`);
    }
  }
  throw new Error("Unable to generate a unique slug. Please try again.");
}

/**
 * Fetch a bouquet from Supabase by its slug.
 * Returns null if not found or expired.
 */
export async function getBouquet(slug: string): Promise<BouquetState | null> {
  const { data, error } = await supabase
    .from("bouquets")
    .select("message, composition, expires_at")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) return null;

  const composition = data.composition as Record<string, unknown>;

  return {
    flowers: (composition.flowers as string[]) ?? [],
    greenery: (composition.greenery as string[]) ?? [],
    arrangement: (composition.arrangement as string) ?? "",
    wrap: (composition.wrap as string) ?? "",
    message: data.message ?? "",
  };
}
