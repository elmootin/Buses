import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { BookingPage } from './pages/BookingPage';
import { LoginPage } from './pages/LoginPage';
import { LoyaltyPage } from './pages/LoyaltyPage';
import { PromotionsPage } from './pages/PromotionsPage';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-blanco-crema flex flex-col">
          <Routes>
            {/* Public routes with header/footer */}
            <Route path="/" element={
              <>
                <Header />
                <main className="flex-1">
                  <HomePage />
                </main>
                <Footer />
              </>
            } />
            <Route path="/search" element={
              <>
                <Header />
                <main className="flex-1">
                  <SearchPage />
                </main>
                <Footer />
              </>
            } />
            <Route path="/search-results" element={
              <>
                <Header />
                <main className="flex-1">
                  <SearchResultsPage />
                </main>
                <Footer />
              </>
            } />
            <Route path="/booking" element={
              <>
                <Header />
                <main className="flex-1">
                  <BookingPage />
                </main>
                <Footer />
              </>
            } />
            <Route path="/promotions" element={
              <>
                <Header />
                <main className="flex-1">
                  <PromotionsPage />
                </main>
                <Footer />
              </>
            } />
            <Route path="/loyalty" element={
              <>
                <Header />
                <main className="flex-1">
                  <LoyaltyPage />
                </main>
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <Header />
                <main className="flex-1 py-16">
                  <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-azul-oscuro mb-8">Sobre NORTEEXPRESO</h1>
                    <div className="max-w-4xl mx-auto">
                      <p className="text-xl text-gris-suave mb-8">
                        Con más de 30 años de experiencia, somos la empresa líder especializada en conectar 
                        Lima con las maravillas del norte del Perú. Nuestro compromiso es brindar un servicio 
                        seguro, cómodo y puntual a todos nuestros pasajeros.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                          <h3 className="text-xl font-bold text-azul-oscuro mb-4">Nuestra Misión</h3>
                          <p className="text-gris-suave">
                            Conectar a las personas con los destinos más hermosos del norte peruano, 
                            ofreciendo un servicio de transporte seguro y confortable.
                          </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                          <h3 className="text-xl font-bold text-azul-oscuro mb-4">Nuestra Visión</h3>
                          <p className="text-gris-suave">
                            Ser la empresa de transporte preferida para descubrir el norte del Perú, 
                            reconocida por nuestra excelencia en el servicio.
                          </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                          <h3 className="text-xl font-bold text-azul-oscuro mb-4">Nuestros Valores</h3>
                          <p className="text-gris-suave">
                            Seguridad, puntualidad, comodidad y compromiso con la satisfacción 
                            de nuestros pasajeros en cada viaje.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Header />
                <main className="flex-1 py-16">
                  <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-azul-oscuro mb-8">Contacto</h1>
                    <div className="max-w-2xl mx-auto">
                      <p className="text-xl text-gris-suave mb-8">
                        Estamos aquí para ayudarte. Contáctanos por cualquiera de estos medios.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                          <h3 className="text-xl font-semibold text-azul-oscuro mb-4">Teléfono</h3>
                          <p className="text-gris-suave">+51 1 234-5678</p>
                          <p className="text-sm text-gris-suave mt-2">Atención 24/7</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                          <h3 className="text-xl font-semibold text-azul-oscuro mb-4">Email</h3>
                          <p className="text-gris-suave">info@norteexpreso.com</p>
                          <p className="text-sm text-gris-suave mt-2">Respuesta en 24h</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
                <Footer />
              </>
            } />

            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected admin routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Booking confirmation */}
            <Route path="/booking-confirmation" element={
              <>
                <Header />
                <main className="flex-1 py-16">
                  <div className="container mx-auto px-4 text-center">
                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
                      <div className="text-6xl mb-6">✅</div>
                      <h1 className="text-3xl font-bold text-azul-oscuro mb-4">
                        ¡Reserva Confirmada!
                      </h1>
                      <p className="text-xl text-gris-suave mb-8">
                        Tu pasaje al norte del Perú ha sido reservado exitosamente. 
                        Recibirás un email con los detalles de tu viaje.
                      </p>
                      <button
                        onClick={() => window.location.href = '/'}
                        className="bg-azul-oscuro text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
                      >
                        Volver al Inicio
                      </button>
                    </div>
                  </div>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;