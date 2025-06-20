import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, CreditCard, CheckCircle, AlertCircle, UserCheck, Baby, FileText } from 'lucide-react';
import { Viaje, SearchFilters, Cliente } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PassengerData extends Partial<Cliente> {
  edad?: number;
  genero?: 'M' | 'F';
  esmenor?: boolean;
  tutor_nombre?: string;
  tutor_dni?: string;
  permiso_notarial?: boolean;
}

export function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { viaje, filters } = location.state as { viaje: Viaje; filters: SearchFilters };
  
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengerData, setPassengerData] = useState<PassengerData[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  if (!viaje || !filters) {
    navigate('/search');
    return null;
  }

  // Simulación de asientos ocupados con género
  const occupiedSeatsData = {
    2: { gender: 'M', name: 'Juan P.' },
    5: { gender: 'F', name: 'María G.' },
    8: { gender: 'M', name: 'Carlos M.' },
    12: { gender: 'F', name: 'Ana R.' },
    15: { gender: 'M', name: 'Luis S.' },
    18: { gender: 'F', name: 'Carmen L.' },
    23: { gender: 'M', name: 'Pedro H.' },
    27: { gender: 'F', name: 'Rosa T.' },
    31: { gender: 'M', name: 'Miguel A.' }
  };

  // Generar distribución de asientos
  const generateSeats = () => {
    const seats = [];
    const totalSeats = viaje.bus.num_asientos;
    
    for (let i = 1; i <= totalSeats; i++) {
      const occupiedData = occupiedSeatsData[i as keyof typeof occupiedSeatsData];
      seats.push({
        number: i,
        isOccupied: !!occupiedData,
        isSelected: selectedSeats.includes(i),
        occupiedBy: occupiedData
      });
    }
    return seats;
  };

  const handleSeatClick = (seatNumber: number) => {
    const seat = generateSeats().find(s => s.number === seatNumber);
    if (seat?.isOccupied) return;

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
    } else if (selectedSeats.length < filters.pasajeros) {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handlePassengerDataChange = (index: number, field: keyof PassengerData, value: string | number | boolean) => {
    const newData = [...passengerData];
    if (!newData[index]) newData[index] = {};
    newData[index] = { ...newData[index], [field]: value };
    
    // Verificar si es menor de edad
    if (field === 'edad') {
      const edad = value as number;
      newData[index].esmenor = edad < 18;
    }
    
    setPassengerData(newData);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    // Simulación de procesamiento de pago
    setTimeout(() => {
      setLoading(false);
      navigate('/booking-confirmation', {
        state: {
          viaje,
          selectedSeats,
          passengerData,
          totalAmount: selectedSeats.length * viaje.ruta.costo_referencial
        }
      });
    }, 2000);
  };

  const canProceedToStep2 = selectedSeats.length === filters.pasajeros;
  const canProceedToStep3 = passengerData.length === filters.pasajeros && 
    passengerData.every(p => {
      const basicDataComplete = p.nombre && p.apellidos && p.dni && p.edad && p.genero;
      if (!p.esmenor) return basicDataComplete;
      
      // Para menores, verificar tutor o permiso
      return basicDataComplete && (
        (p.tutor_nombre && p.tutor_dni) || p.permiso_notarial
      );
    });
  const canConfirm = paymentMethod && canProceedToStep3;

  return (
    <div className="min-h-screen bg-blanco-crema py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Progress Bar */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-azul-oscuro">Reservar Pasaje</h1>
              <div className="text-sm text-gris-suave">
                Paso {step} de 3
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= stepNumber ? 'bg-azul-oscuro text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`flex-1 h-2 rounded ${
                      step > stepNumber ? 'bg-azul-oscuro' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={step >= 1 ? 'text-azul-oscuro font-medium' : 'text-gray-500'}>
                Seleccionar Asientos
              </span>
              <span className={step >= 2 ? 'text-azul-oscuro font-medium' : 'text-gray-500'}>
                Datos de Pasajeros
              </span>
              <span className={step >= 3 ? 'text-azul-oscuro font-medium' : 'text-gray-500'}>
                Pago
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Seat Selection */}
              {step === 1 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-azul-oscuro mb-6">
                    Selecciona {filters.pasajeros} {filters.pasajeros === 1 ? 'asiento' : 'asientos'}
                  </h2>
                  
                  <div className="mb-6">
                    <div className="flex items-center space-x-6 text-sm flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span>Disponible</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-azul-oscuro rounded flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span>Seleccionado</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs">♂</span>
                        </div>
                        <span>Ocupado (Hombre)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs">♀</span>
                        </div>
                        <span>Ocupado (Mujer)</span>
                      </div>
                    </div>
                  </div>

                  {/* Bus Layout */}
                  <div className="bg-gray-100 rounded-lg p-6">
                    <div className="text-center mb-4 text-sm font-medium text-gris-suave">
                      🚗 Conductor
                    </div>
                    <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                      {generateSeats().map((seat) => (
                        <button
                          key={seat.number}
                          onClick={() => handleSeatClick(seat.number)}
                          disabled={seat.isOccupied}
                          className={`w-12 h-12 rounded text-sm font-medium transition-all relative group ${
                            seat.isOccupied
                              ? seat.occupiedBy?.gender === 'M'
                                ? 'bg-blue-500 text-white cursor-not-allowed'
                                : 'bg-pink-500 text-white cursor-not-allowed'
                              : seat.isSelected
                              ? 'bg-azul-oscuro text-white'
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                          title={seat.isOccupied ? `Ocupado por ${seat.occupiedBy?.name}` : `Asiento ${seat.number}`}
                        >
                          {seat.isOccupied ? (
                            seat.occupiedBy?.gender === 'M' ? '♂' : '♀'
                          ) : (
                            seat.number
                          )}
                          
                          {seat.isOccupied && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {seat.occupiedBy?.name}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!canProceedToStep2}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        canProceedToStep2
                          ? 'bg-azul-oscuro text-white hover:bg-primary-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Passenger Data */}
              {step === 2 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-azul-oscuro mb-6">
                    Datos de los Pasajeros
                  </h2>
                  
                  <div className="space-y-6">
                    {selectedSeats.map((seatNumber, index) => (
                      <div key={seatNumber} className="border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-azul-oscuro mb-4 flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          Pasajero {index + 1} - Asiento {seatNumber}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nombres *
                            </label>
                            <input
                              type="text"
                              value={passengerData[index]?.nombre || ''}
                              onChange={(e) => handlePassengerDataChange(index, 'nombre', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Apellidos *
                            </label>
                            <input
                              type="text"
                              value={passengerData[index]?.apellidos || ''}
                              onChange={(e) => handlePassengerDataChange(index, 'apellidos', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              DNI *
                            </label>
                            <input
                              type="text"
                              value={passengerData[index]?.dni || ''}
                              onChange={(e) => handlePassengerDataChange(index, 'dni', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
                              maxLength={8}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Edad *
                            </label>
                            <input
                              type="number"
                              value={passengerData[index]?.edad || ''}
                              onChange={(e) => handlePassengerDataChange(index, 'edad', parseInt(e.target.value))}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
                              min={1}
                              max={120}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Género *
                            </label>
                            <select
                              value={passengerData[index]?.genero || ''}
                              onChange={(e) => handlePassengerDataChange(index, 'genero', e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
                              required
                            >
                              <option value="">Seleccionar</option>
                              <option value="M">Masculino</option>
                              <option value="F">Femenino</option>
                            </select>
                          </div>
                        </div>

                        {/* Sección para menores de edad */}
                        {passengerData[index]?.esmenor && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                            <div className="flex items-center mb-3">
                              <Baby className="h-5 w-5 text-yellow-600 mr-2" />
                              <h4 className="font-medium text-yellow-800">
                                Menor de edad - Documentación requerida
                              </h4>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name={`minor_option_${index}`}
                                    checked={!passengerData[index]?.permiso_notarial}
                                    onChange={() => handlePassengerDataChange(index, 'permiso_notarial', false)}
                                    className="mr-2"
                                  />
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Viaja con tutor/familiar
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name={`minor_option_${index}`}
                                    checked={passengerData[index]?.permiso_notarial || false}
                                    onChange={() => handlePassengerDataChange(index, 'permiso_notarial', true)}
                                    className="mr-2"
                                  />
                                  <FileText className="h-4 w-4 mr-1" />
                                  Tiene permiso notarial
                                </label>
                              </div>
                              
                              {!passengerData[index]?.permiso_notarial && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Nombre del tutor/familiar *
                                    </label>
                                    <input
                                      type="text"
                                      value={passengerData[index]?.tutor_nombre || ''}
                                      onChange={(e) => handlePassengerDataChange(index, 'tutor_nombre', e.target.value)}
                                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      DNI del tutor/familiar *
                                    </label>
                                    <input
                                      type="text"
                                      value={passengerData[index]?.tutor_dni || ''}
                                      onChange={(e) => handlePassengerDataChange(index, 'tutor_dni', e.target.value)}
                                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azul-oscuro focus:border-azul-oscuro"
                                      maxLength={8}
                                      required
                                    />
                                  </div>
                                </div>
                              )}
                              
                              {passengerData[index]?.permiso_notarial && (
                                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                  <p className="text-sm text-blue-800">
                                    <strong>Importante:</strong> Debe presentar el permiso notarial original al momento del viaje.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!canProceedToStep3}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        canProceedToStep3
                          ? 'bg-azul-oscuro text-white hover:bg-primary-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-azul-oscuro mb-6">
                    Método de Pago
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'visa', name: 'Tarjeta de Crédito/Débito', icon: CreditCard, description: 'Visa, Mastercard, American Express' },
                      { id: 'yape', name: 'Yape', icon: CreditCard, description: 'Pago rápido y seguro' },
                      { id: 'plin', name: 'Plin', icon: CreditCard, description: 'Transferencia instantánea' },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === method.id
                            ? 'border-azul-oscuro bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <method.icon className="h-6 w-6 text-azul-oscuro mr-3" />
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gris-suave">{method.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      onClick={handleConfirmBooking}
                      disabled={!canConfirm || loading}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                        canConfirm && !loading
                          ? 'bg-amarillo-dorado text-azul-oscuro hover:bg-yellow-500'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-azul-oscuro"></div>
                          <span>Procesando...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          <span>Confirmar Reserva</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Trip Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h3 className="text-lg font-bold text-azul-oscuro mb-4">
                  Resumen del Viaje
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-azul-oscuro">Ruta:</span>
                    </div>
                    <div className="text-sm text-gris-suave">
                      {viaje.ruta.origen} → {viaje.ruta.destino}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-azul-oscuro">Fecha:</span>
                    </div>
                    <div className="text-sm text-gris-suave">
                      {format(new Date(viaje.fecha_hora_salida), 'EEEE, d MMMM yyyy', { locale: es })}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-azul-oscuro">Horario:</span>
                    </div>
                    <div className="text-sm text-gris-suave">
                      Salida: {format(new Date(viaje.fecha_hora_salida), 'HH:mm')}
                      <br />
                      Llegada: {format(new Date(viaje.fecha_hora_llegada_estimada), 'HH:mm')}
                    </div>
                  </div>
                  
                  {selectedSeats.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-azul-oscuro">Asientos:</span>
                      </div>
                      <div className="text-sm text-gris-suave">
                        {selectedSeats.sort((a, b) => a - b).join(', ')}
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-azul-oscuro">
                        {selectedSeats.length} {selectedSeats.length === 1 ? 'Pasajero' : 'Pasajeros'}:
                      </span>
                      <span className="font-medium">
                        S/ {(selectedSeats.length * viaje.ruta.costo_referencial).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-gris-suave">
                      S/ {viaje.ruta.costo_referencial.toFixed(2)} x {selectedSeats.length}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold text-azul-oscuro">
                      <span>Total:</span>
                      <span>S/ {(selectedSeats.length * viaje.ruta.costo_referencial).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}