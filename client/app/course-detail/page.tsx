import { redirect } from "next/navigation";

/**
 * Legacy route. This page used to be a hard-coded copy of the
 * "Floods & Droughts" module; the real, data-driven page lives under
 * /modules/[slug], so keep old links working by redirecting there.
 */
export default function CourseDetails() {
  redirect("/modules/extreme-weather-patterns");
}
