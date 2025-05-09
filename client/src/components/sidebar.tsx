import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { 
  PieChart, 
  QrCode, 
  Edit, 
  MessageSquare, 
  LineChart, 
  Image, 
  Store, 
  Users, 
  Settings, 
  Crown, 
  Gift, 
  LogOut 
} from "lucide-react";

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  label: string;
  current?: boolean;
};

function NavItem({ href, icon, label, current }: NavItemProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-lg cursor-pointer",
          current
            ? "bg-primary-50 text-primary-700"
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <span className={`mr-3 ${current ? "text-primary-500" : "text-gray-500"}`}>{icon}</span>
        <span>{label}</span>
      </div>
    </Link>
  );
}

export function Sidebar() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <span className="text-primary-600 text-2xl">
            <MessageSquare size={24} />
          </span>
          <h1 className="font-bold text-xl text-gray-800">AIO Feedback</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        <NavItem
          href="/"
          icon={<PieChart size={18} />}
          label="Dashboard"
          current={location === "/"}
        />
        <NavItem
          href="/qr-codes"
          icon={<QrCode size={18} />}
          label="QR Codes"
          current={location === "/qr-codes"}
        />
        <NavItem
          href="/form-builder"
          icon={<Edit size={18} />}
          label="Form Builder"
          current={location === "/form-builder"}
        />
        <NavItem
          href="/feedback"
          icon={<MessageSquare size={18} />}
          label="Feedback"
          current={location === "/feedback"}
        />
        <NavItem
          href="/analytics"
          icon={<LineChart size={18} />}
          label="Analytics"
          current={location === "/analytics"}
        />
        <NavItem
          href="/media-gallery"
          icon={<Image size={18} />}
          label="Media Gallery"
          current={location === "/media-gallery"}
        />
        <NavItem
          href="/locations"
          icon={<Store size={18} />}
          label="Locations"
          current={location === "/locations"}
        />
        <NavItem
          href="/team"
          icon={<Users size={18} />}
          label="Team"
          current={location === "/team"}
        />

        <div className="pt-4 mt-4 border-t border-gray-200">
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
            Account
          </h3>
          <NavItem
            href="/settings"
            icon={<Settings size={18} />}
            label="Settings"
            current={location === "/settings"}
          />
          <div className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer">
            <span className="mr-3 text-amber-500"><Crown size={18} /></span>
            <span>Upgrade Plan</span>
            <span className="ml-auto bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
              {user?.subscriptionPlan || "Free"}
            </span>
          </div>
          <NavItem
            href="/rewards"
            icon={<Gift size={18} />}
            label="Rewards"
            current={location === "/rewards"}
          />
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
            {user?.businessName?.charAt(0) || "B"}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">
              {user?.businessName || "Your Business"}
            </p>
            <p className="text-xs text-gray-500">{user?.email || "contact@business.com"}</p>
          </div>
          <button 
            className="ml-auto text-gray-400 hover:text-gray-600"
            onClick={() => logoutMutation.mutate()}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
