import type { ComponentType } from "react";
import {
  MartiniIcon,
  DiamondIcon,
  ForkKnifeIcon,
  ConfettiIcon,
  CameraIcon,
  MusicNotesIcon,
  HeartIcon,
  CarIcon,
  CakeIcon,
  ClockIcon,
  type IconProps,
} from "@phosphor-icons/react";

/**
 * Soft / duotone icon set for invitation schedule items.
 * (We standardize on Phosphor duotone — never mix sharp/outline sets.)
 * `iconKey` values are what get stored in invitation data + fieldsSchema.
 */
export const ICON_MAP: Record<string, ComponentType<IconProps>> = {
  cocktail: MartiniIcon,
  rings: DiamondIcon,
  dinner: ForkKnifeIcon,
  fireworks: ConfettiIcon,
  photo: CameraIcon,
  music: MusicNotesIcon,
  heart: HeartIcon,
  car: CarIcon,
  cake: CakeIcon,
  clock: ClockIcon,
};

export const ICON_KEYS = Object.keys(ICON_MAP);

export function ScheduleIcon({
  iconKey,
  ...props
}: { iconKey: string } & IconProps) {
  const Icon = ICON_MAP[iconKey] ?? ICON_MAP.heart;
  return <Icon weight="duotone" {...props} />;
}
