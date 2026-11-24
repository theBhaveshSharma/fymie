import { SEED_CIRCLES } from "@/lib/types";
import CircleDetailClient from "./CircleDetailClient";

export function generateStaticParams() {
  return SEED_CIRCLES.map((circle) => ({ slug: circle.slug }));
}

export default function CircleDetailPage() {
  return <CircleDetailClient />;
}
