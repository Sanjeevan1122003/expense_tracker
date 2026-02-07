import { NavLink } from "../components/NavLink";

export default function Sidebar() {
  return (
    <nav className="flex flex-col gap-2 p-4">
      <NavLink
        to="/dashboard"
        className="px-4 py-2 rounded-md text-gray-700 hover:bg-muted"
        activeClassName="bg-primary text-white"
        pendingClassName="opacity-50"
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/reports"
        className="px-4 py-2 rounded-md text-gray-700 hover:bg-muted"
        activeClassName="bg-primary text-white"
      >
        Reports
      </NavLink>

      <NavLink
        to="/settings"
        className="px-4 py-2 rounded-md text-gray-700 hover:bg-muted"
        activeClassName="bg-primary text-white"
      >
        Settings
      </NavLink>
    </nav>
  );
}
