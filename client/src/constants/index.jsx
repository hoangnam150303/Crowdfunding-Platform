// navlinks.tsx
import {
  LayoutDashboard,
  Megaphone,
  CreditCard,
  Wallet,
  User,
  LogOut,
} from "lucide-react";

export const navlinks = [
  {
    name: "dashboard",
    icon: LayoutDashboard, 
    link: "/",
  },
  {
    name: "campaign",
    icon: Megaphone,
    link: "/create-campaign",
  },
  {
    name: "payment",
    icon: CreditCard,
    link: "/",
  },
  {
    name: "withdraw",
    icon: Wallet,
    link: "/",
  },
  {
    name: "profile",
    icon: User,
    link: "/profile",
  },
  {
    name: "logout",
    icon: LogOut,
    link: "/",
  },
];
