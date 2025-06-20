import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Bus, 
  Users, 
  MapPin, 
  Calendar, 
  CreditCard,
  Settings,
  TrendingUp,
  Clock,
  Shield
} from 'lucide-react';

// Admin components
import { AdminOverview } from '../components/admin/AdminOverview';
import { ViajesManager } from '../components/admin/ViajesManager';
import { BusesManager } from '../components/admin/BusesManager';
import { RutasManager } from '../components/admin/RutasManager';
import { PasajesManager } from '../components/admin/PasajesManager';
import { PersonalManager } from '../components/admin/PersonalManager';

export function AdminDashboard() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3, current: location.pathname === '/admin' },
    { name: 'Viajes', href: '/admin/viajes', icon: Calendar, current: location.pathname === '/admin/viajes' },
    { name: 'Buses', href: '/admin/buses', icon: Bus, current: location.pathname === '/admin/buses' },
    { name: 'Rutas', href: '/admin/rutas', icon: MapPin, current: location.pathname === '/admin/rutas' },
    { name: 'Pasajes', href: '/admin/pasajes', icon: CreditCard, current: location.pathname === '/admin/pasajes' },
    { name: 'Personal', href: '/admin/personal', icon: Users, current: location.pathname === '/admin/personal' },
  ];

  return (
    <div className="min-h-screen bg-blanco-crema">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow bg-azul-oscuro overflow-y-auto">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-800">
              <Bus className="h-8 w-8 text-amarillo-dorado" />
              <span className="ml-2 text-xl font-bold text-white">NORTEEXPRESO</span>
            </div>
            <div className="mt-5 flex-1 flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.current
                        ? 'bg-amarillo-dorado text-azul-oscuro'
                        : 'text-gray-300 hover:bg-primary-600 hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        item.current ? 'text-azul-oscuro' : 'text-gray-400 group-hover:text-gray-300'
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <Routes>
                <Route path="/" element={<AdminOverview />} />
                <Route path="/viajes" element={<ViajesManager />} />
                <Route path="/buses" element={<BusesManager />} />
                <Route path="/rutas" element={<RutasManager />} />
                <Route path="/pasajes" element={<PasajesManager />} />
                <Route path="/personal" element={<PersonalManager />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}