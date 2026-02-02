import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Bot, 
  BarChart3, 
  MessageSquare, 
  Rocket,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { cn } from './ui/utils';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Knowledge Base', href: '/knowledge-base/demo', icon: FileText },
    { name: 'Chatbot Settings', href: '/config/demo', icon: Bot },
    { name: 'Preview Chatbot', href: '/preview/demo', icon: MessageSquare },
    { name: 'Deploy', href: '/deploy/demo', icon: Rocket },
    { name: 'Analytics', href: '/analytics/demo', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 transition-transform duration-200 z-40',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl text-white">BotCraft AI</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href.split('/')[1] === 'dashboard' ? '/dashboard' : `/${item.href.split('/')[1]}`);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-700 space-y-2">
            <Link to="/profile">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-700/50"
              >
                <User className="w-5 h-5 mr-3" />
                Profile
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => logout()}
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}