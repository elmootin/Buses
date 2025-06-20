import React, { useState } from 'react';
import { Plus, Search, Bus, PenTool as Tool, CheckCircle, AlertCircle } from 'lucide-react';

interface BusData {
  codigo: number;
  placa: string;
  fabricante: string;
  num_asientos: number;
  estado: string;
  ultimo_mantenimiento: string;
  proximo_mantenimiento: string;
  kilometraje: number;
}

export function BusesManager() {
  const [buses, setBuses] = useState<BusData[]>([
    {
      codigo: 1,
      placa: 'ABC-123',
      fabricante: 'Mercedes Benz',
      num_asientos: 40,
      estado: 'Operativo',
      ultimo_mantenimiento: '2024-01-01',
      proximo_mantenimiento: '2024-04-01',
      kilometraje: 125000
    },
    {
      codigo: 2,
      placa: 'DEF-456',
      fabricante: 'Scania',
      num_asientos: 44,
      estado: 'Operativo',
      ultimo_mantenimiento: '2024-01-05',
      proximo_mantenimiento: '2024-04-05',
      kilometraje: 98000
    },
    {
      codigo: 3,
      placa: 'GHI-789',
      fabricante: 'Volvo',
      num_asientos: 36,
      estado: 'Mantenimiento',
      ultimo_mantenimiento: '2024-01-10',
      proximo_mantenimiento: '2024-01-15',
      kilometraje: 87000
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showNewBusModal, setShowNewBusModal] = useState(false);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Operativo':
        return 'bg-green-100 text-green-800';
      case 'Mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'Fuera de Servicio':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'Operativo':
        return CheckCircle;
      case 'Mantenimiento':
        return Tool;
      case 'Fuera de Servicio':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const isMantenimientoProximo = (fechaProximoMantenimiento: string) => {
    const hoy = new Date();
    const fechaMantenimiento = new Date(fechaProximoMantenimiento);
    const diferenciaDias = Math.ceil((fechaMantenimiento.getTime() - hoy.getTime()) / (1000 * 3600 * 24));
    return diferenciaDias <= 7;
  };

  const filteredBuses = buses.filter(bus =>
    bus.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.fabricante.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-azul-oscuro">Gestión de Buses</h1>
            <p className="mt-1 text-sm text-gris-suave">
              Administra la flota de vehículos y su mantenimiento
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setShowNewBusModal(true)}
              className="bg-azul-oscuro text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Registrar Bus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-azul-oscuro">
                {buses.filter(b => b.estado === 'Operativo').length}
              </h3>
              <p className="text-sm text-gris-suave">Operativos</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Tool className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-azul-oscuro">
                {buses.filter(b => b.estado === 'Mantenimiento').length}
              </h3>
              <p className="text-sm text-gris-suave">En Mantenimiento</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-azul-oscuro">
                {buses.filter(b => isMantenimientoProximo(b.proximo_mantenimiento)).length}
              </h3>
              <p className="text-sm text-gris-suave">Mantenimiento Próximo</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bus className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-azul-oscuro">
                {buses.length}
              </h3>
              <p className="text-sm text-gris-suave">Total Buses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
              placeholder="Buscar por placa, fabricante o estado..."
            />
          </div>
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro">
            <option value="">Todos los estados</option>
            <option value="Operativo">Operativo</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Fuera de Servicio">Fuera de Servicio</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro">
            <option value="">Todos los fabricantes</option>
            <option value="Mercedes Benz">Mercedes Benz</option>
            <option value="Scania">Scania</option>
            <option value="Volvo">Volvo</option>
          </select>
        </div>
      </div>

      {/* Buses Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mantenimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kilometraje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBuses.map((bus) => {
                const EstadoIcon = getEstadoIcon(bus.estado);
                const mantenimientoProximo = isMantenimientoProximo(bus.proximo_mantenimiento);

                return (
                  <tr key={bus.codigo} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Bus className="h-8 w-8 text-azul-oscuro mr-3" />
                        <div>
                          <div className="text-sm font-medium text-azul-oscuro">
                            {bus.placa}
                          </div>
                          <div className="text-sm text-gris-suave">
                            {bus.fabricante}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-azul-oscuro">
                        {bus.num_asientos} asientos
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <EstadoIcon className="h-5 w-5 mr-2" />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(bus.estado)}`}>
                          {bus.estado}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-azul-oscuro">
                          Último: {new Date(bus.ultimo_mantenimiento).toLocaleDateString('es-PE')}
                        </div>
                        <div className={`text-sm ${mantenimientoProximo ? 'text-red-600 font-semibold' : 'text-gris-suave'}`}>
                          Próximo: {new Date(bus.proximo_mantenimiento).toLocaleDateString('es-PE')}
                          {mantenimientoProximo && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              Urgente
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-azul-oscuro">
                        {bus.kilometraje.toLocaleString()} km
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-azul-oscuro hover:text-primary-600">
                          Ver
                        </button>
                        <button className="text-amarillo-dorado hover:text-yellow-600">
                          Editar
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          Mantenimiento
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}