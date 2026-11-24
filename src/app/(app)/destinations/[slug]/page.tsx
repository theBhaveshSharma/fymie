import { DESTINATION_HUBS } from "@/lib/types";
import DestinationHubClient from "./DestinationHubClient";

export function generateStaticParams() {
  return DESTINATION_HUBS.map((hub) => ({ slug: hub.slug }));
}

export default function DestinationHubPage() {
  return <DestinationHubClient />;
}
