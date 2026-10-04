import { Droplet, Trash2, Leaf, Fish, Wind, Waves, Pin, type LucideIcon } from "lucide-react";

export interface ObservationCategory {
  id: string;
  label: string;
  emoji: string;
  icon: LucideIcon;
}

export const CATEGORIES: ObservationCategory[] = [
  { id: "water_clarity", label: "Water clarity", emoji: "💧", icon: Droplet },
  { id: "waste", label: "Waste / litter", emoji: "🗑️", icon: Trash2 },
  { id: "algae", label: "Algae / vegetation", emoji: "🌿", icon: Leaf },
  { id: "wildlife", label: "Wildlife", emoji: "🐟", icon: Fish },
  { id: "smell", label: "Unusual smell", emoji: "👃", icon: Wind },
  { id: "water_level", label: "Water level", emoji: "🌊", icon: Waves },
  { id: "unusual", label: "Something unusual", emoji: "📌", icon: Pin },
];

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
