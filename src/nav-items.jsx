import { Home, PlayCircle, BookOpen, Settings as SettingsIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import Game from "./pages/Game.jsx";
import Rules from "./pages/Rules.jsx";
import Settings from "./pages/Settings.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Game",
    to: "/game",
    icon: <PlayCircle className="h-4 w-4" />,
    page: <Game />,
  },
  {
    title: "Rules",
    to: "/rules",
    icon: <BookOpen className="h-4 w-4" />,
    page: <Rules />,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: <SettingsIcon className="h-4 w-4" />,
    page: <Settings />,
  },
];