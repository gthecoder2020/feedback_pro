import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [location] = useLocation();
  
  const navItems = [
    { path: "/", icon: "fa-chart-pie", label: "Dashboard" },
    { path: "/qr-codes", icon: "fa-qrcode", label: "QR Codes" },
    { path: "/form-builder", icon: "fa-edit", label: "Forms" },
    { path: "/feedback", icon: "fa-comment-alt", label: "Feedback" },
    { path: "/settings", icon: "fa-cog", label: "Settings" },
  ];
  
  return (
    <nav className="lg:hidden flex justify-around items-center bg-white border-t border-gray-200 py-3">
      {navItems.map((item) => (
        <Link key={item.path} href={item.path}>
          <a className={cn(
            "flex flex-col items-center",
            location === item.path ? "text-primary-600" : "text-gray-500"
          )}>
            <i className={`fas ${item.icon} text-xl`}></i>
            <span className="text-xs mt-1">{item.label}</span>
          </a>
        </Link>
      ))}
    </nav>
  );
}
