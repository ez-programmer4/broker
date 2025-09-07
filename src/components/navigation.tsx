"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Building, User, LogOut, Home, Settings } from "lucide-react";

export function Navigation() {
  const { data: session } = useSession();

  return (
    <header className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
            <Building className="h-6 w-6 text-white" />
          </div>
          BrokerPlatform
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/properties" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium">
            <Home className="h-4 w-4" />
            Properties
          </Link>
          
          {session?.user ? (
            <div className="flex items-center gap-4">
              {(session.user as any).role === "ADMIN" && (
                <Link href="/admin" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium">
                  <Settings className="h-4 w-4" />
                  Admin
                </Link>
              )}
              
              {(session.user as any).role === "BROKER" && (
                <Link href="/broker" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium">
                  <Building className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="p-1 bg-blue-100 rounded-full">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{session.user.name || session.user.email}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="flex items-center gap-2 border-gray-200 hover:border-red-300 hover:text-red-600 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/register">
                <button className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200">
                  Register
                </button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}