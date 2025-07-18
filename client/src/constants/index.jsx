import dashboard from "../assets/dashboard.svg";
import payment from "../assets/payment.svg";
import withdraw from "../assets/withdraw.svg";
import profile from "../assets/profile.svg";
import speaker from "../assets/speaker.svg";
import logout from "../assets/logout.svg";

export const navlinks = [
  {
    name: "dashboard",
    imageUrl: dashboard,
    link: "/",
  },
  {
    name: "campaign",
    imageUrl: speaker,
    link: "/create-campaign",
  },
  {
    name: "payment",
    imageUrl: payment,
    link: "/",
  },
  {
    name: "withdraw",
    imageUrl: withdraw,
    link: "/",
  },
  {
    name: "profile",
    imageUrl: profile,
    link: "/profile",
  },
  {
    name: "logout",
    imageUrl: logout,
    link: "/",
  },
];
