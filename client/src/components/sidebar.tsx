import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type NavItemProps = {
  href: string;
  icon: string;
  label: string;
  current?: boolean;
};

function NavItem({ href, icon, label, current }: NavItemProps) {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-lg",
          current
            ? "bg-primary-50 text-primary-700"
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <i className={`fas ${icon} mr-3 ${current ? "text-primary-500" : "text-gray-500"}`}></i>
        <span>{label}</span>
      </a>
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
            <i className="fas fa-comments"></i>
          </span>
          <h1 className="font-bold text-xl text-gray-800">AIO Feedback</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        <NavItem
          href="/"
          icon="fa-chart-pie"
          label="Dashboard"
          current={location === "/"}
        />
        <NavItem
          href="/qr-codes"
          icon="fa-qrcode"
          label="QR Codes"
          current={location === "/qr-codes"}
        />
        <NavItem
          href="/form-builder"
          icon="fa-edit"
          label="Form Builder"
          current={location === "/form-builder"}
        />
        <NavItem
          href="/feedback"
          icon="fa-comment-alt"
          label="Feedback"
          current={location === "/feedback"}
        />
        <NavItem
          href="/analytics"
          icon="fa-chart-line"
          label="Analytics"
          current={location === "/analytics"}
        />
        <NavItem
          href="/media-gallery"
          icon="fa-image"
          label="Media Gallery"
          current={location === "/media-gallery"}
        />
        <NavItem
          href="/locations"
          icon="fa-store"
          label="Locations"
          current={location === "/locations"}
        />
        <NavItem
          href="/team"
          icon="fa-users"
          label="Team"
          current={location === "/team"}
        />

        <div className="pt-4 mt-4 border-t border-gray-200">
          <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
            Account
          </h3>
          <NavItem
            href="/settings"
            icon="fa-cog"
            label="Settings"
            current={location === "/settings"}
          />
          <a
            href="#"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <i className="fas fa-crown mr-3 text-amber-500"></i>
            <span>Upgrade Plan</span>
            <span className="ml-auto bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
              {user?.subscriptionPlan || "Free"}
            </span>
          </a>
          <NavItem
            href="/rewards"
            icon="fa-gift"
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
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}
