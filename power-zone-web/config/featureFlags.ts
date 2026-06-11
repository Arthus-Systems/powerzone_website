/**
 * Site-wide feature flags.
 *
 * These exist for a specific reason: the live customer-facing site needs
 * a slimmer homepage than the full design build, but the full design must
 * stay available for showing to other prospective customers on demand.
 * Flipping a flag to `true` restores the full experience instantly — no
 * code revert, no migration.
 *
 * Both flags below are OFF for the current production launch per the
 * customer meeting decision:
 *
 *   SHOW_INTRO_CONCEPT — the cinematic dashboard intro (ControlPanel,
 *     ignition button, generator startup sounds, value-ramp choreography,
 *     dashboard-slide-up reveal). With this off, all visitors land
 *     directly on the static hero (post-intro state) regardless of
 *     first-visit / return-visit. ControlPanel is not even mounted.
 *
 *   SHOW_CUSTOMER_LOGOS — the "Trusted Across Pakistan" customer logo
 *     wall that currently sits between the hero and PeekProductsSection
 *     as a sticky slide-up reveal. With this off, the hero is a plain
 *     100vh block and PeekProductsSection follows immediately.
 *
 * To restore: flip the relevant flag to `true`. No other code changes
 * needed — the underlying components, assets, and choreography are
 * preserved in their respective files.
 */

export const SHOW_INTRO_CONCEPT = false;
export const SHOW_CUSTOMER_LOGOS = false;
