import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  
  return (
    <header className="lg:hidden bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-primary-600 text-xl">
          <i className="fas fa-comments"></i>
        </span>
        <h1 className="font-bold text-gray-800">All-in-One Feedback</h1>
      </div>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-bars"></i>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </header>
  );
}
