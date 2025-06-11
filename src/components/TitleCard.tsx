import { ReactNode } from "react";

interface TitleCardProps {
  children: ReactNode;
}

export function BaseTitleCard({ children }: TitleCardProps) {
  return <>{children}</>;
}

export function HomeTitleCard({ children }: TitleCardProps) {
  return <BaseTitleCard>{children}</BaseTitleCard>;
}
