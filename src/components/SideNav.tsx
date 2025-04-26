"use client"
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { useContext, createContext, useState } from "react";
import { ReactNode } from "react";

// Sidebar Context
const SidebarContext = createContext({ expanded: true });

// Sidebar Component
export default function Sidebar({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 bg-gray-900 text-white border-r border-gray-800 shadow-lg transition-all duration-300 ease-in-out overflow-hidden
        ${expanded ? "w-72" : "w-0"}`}
    >
      <nav className="h-full flex flex-col">
        <div className="p-4 pb-2 flex justify-between items-center bg-gray-800">
          <div className={`font-bold text-2xl transition-all text-indigo-400 ${expanded ? "opacity-100" : "opacity-0 w-0"}`}>
            EduElite
          </div>
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3 overflow-y-auto bg-gray-900">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t border-gray-800 flex p-3 bg-gray-800">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt="User avatar"
            className="w-10 h-10 rounded-full"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-56 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-white">John Doe</h4>
              <span className="text-xs text-gray-400">johndoe@gmail.com</span>
            </div>
            <MoreVertical size={20} className="text-gray-300" />
          </div>
        </div>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-indigo-700 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }
      `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${expanded ? "w-56 ml-3" : "w-0"}`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-red-500 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}
      {!expanded && (
        <div
          className={`
            absolute left-0 top-0 mt-1 ml-12 rounded-md px-2 py-1
            bg-gray-800 text-white text-sm shadow-lg
            invisible opacity-0 translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </li>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active: boolean;
  alert?: boolean;
}

// Example Layout Wrapper (to demonstrate full collapse)
export function AppLayout({ children, sidebarContent }: { children: ReactNode; sidebarContent: ReactNode }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar>{sidebarContent}</Sidebar>
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          expanded ? "ml-72" : "ml-0"
        } bg-gray-100`}
      >
        {children}
      </main>
    </div>
  );
}