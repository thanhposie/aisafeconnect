import React, { useState, useEffect, useMemo } from 'react'
import {
  Plane,
  MapPin,
  Calendar,
  Users,
  ArrowLeftRight,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Sun,
  Moon,
  Info,
  User,
  Phone,
  Mail,
  Compass,
  Coffee,
  Briefcase,
  Wifi,
  Tv,
  Check,
  Search,
  Filter,
  Shield,
  Activity,
  MessageSquare,
  Lock,
  ArrowLeft
} from 'lucide-react'

// Mock Airport database
interface Airport {
  code: string
  city: string
  name: string
  country: string
}

const airports: Airport[] = [
  { code: 'SGN', city: 'Ho Chi Minh City', name: 'Tan Son Nhat International Airport', country: 'Vietnam' },
  { code: 'HAN', city: 'Ha Noi', name: 'Noi Bai International Airport', country: 'Vietnam' },
  { code: 'DAD', city: 'Da Nang', name: 'Da Nang International Airport', country: 'Vietnam' },
  { code: 'CXR', city: 'Nha Trang', name: 'Cam Ranh International Airport', country: 'Vietnam' },
  { code: 'PQC', city: 'Phu Quoc', name: 'Phu Quoc International Airport', country: 'Vietnam' },
  { code: 'SIN', city: 'Singapore', name: 'Changi Airport', country: 'Singapore' },
  { code: 'NRT', city: 'Tokyo', name: 'Narita International Airport', country: 'Japan' },
  { code: 'ICN', city: 'Seoul', name: 'Incheon International Airport', country: 'South Korea' },
  { code: 'LHR', city: 'London', name: 'Heathrow Airport', country: 'United Kingdom' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle Airport', country: 'France' }
]

// Mock Airlines
interface Airline {
  id: string
  name: string
  logoColor: string
  alliance: string
  rating: number
}

const airlines: Airline[] = [
  { id: 'SF', name: 'SkyFlow Airways', logoColor: 'from-violet-600 to-indigo-600', alliance: 'SkyTeam', rating: 4.9 },
  { id: 'VN', name: 'Vietnam Airlines', logoColor: 'from-teal-600 to-emerald-600', alliance: 'SkyTeam', rating: 4.7 },
  { id: 'VJ', name: 'VietJet Air', logoColor: 'from-red-500 to-amber-500', alliance: 'None', rating: 3.8 },
  { id: 'QH', name: 'Bamboo Airways', logoColor: 'from-emerald-700 to-sky-700', alliance: 'None', rating: 4.4 }
]

// Flight interface
interface Flight {
  id: string
  flightNumber: string
  airline: Airline
  from: Airport
  to: Airport
  departureTime: string
  arrivalTime: string
  duration: number // in minutes
  stops: number
  price: number
  aircraft: string
  terminal: string
  gate: string
  baggageAllowance: string
}

// Generate flights based on departure & destination
const generateFlightsForRoute = (from: Airport, to: Airport, dateStr: string): Flight[] => {
  if (from.code === to.code) return []

  const seed = from.code.charCodeAt(0) + to.code.charCodeAt(0) + new Date(dateStr).getDate()
  const list: Flight[] = []

  // Generate 4-7 flights
  const flightCount = 4 + (seed % 4)

  for (let i = 0; i < flightCount; i++) {
    const airlineIndex = (seed + i) % airlines.length
    const airline = airlines[airlineIndex]
    
    // Set up departure hour
    const depHour = (6 + (i * 3) + (seed % 3)) % 24
    const depMin = (i * 15) % 60
    const departureTime = `${depHour.toString().padStart(2, '0')}:${depMin.toString().padStart(2, '0')}`

    // Calculate duration based on distance mock
    let duration = 75 // SGN-HAN base
    if (from.country !== to.country) {
      duration = 180 + ((seed + i) % 6) * 60 // international
    } else if (from.code === 'SGN' && to.code === 'HAN' || from.code === 'HAN' && to.code === 'SGN') {
      duration = 120
    } else if (from.code === 'DAD' || to.code === 'DAD') {
      duration = 75
    }

    const arrTotalMin = depHour * 60 + depMin + duration
    const arrHour = Math.floor(arrTotalMin / 60) % 24
    const arrMin = arrTotalMin % 60
    const arrivalTime = `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`

    const stops = (duration > 150 && (i % 3 === 0)) ? 1 : 0
    
    // Calculate base price
    let basePrice = 50 + (duration * 0.4)
    if (airline.id === 'VJ') basePrice *= 0.75 // VietJet cheaper
    if (airline.id === 'SF') basePrice *= 1.25 // SkyFlow premium
    if (airline.id === 'VN') basePrice *= 1.15 // Vietnam Airlines

    // Apply seed modification
    basePrice = Math.round(basePrice + ((seed + i) % 15) * 5)

    const aircrafts = ['Boeing 787-9 Dreamliner', 'Airbus A350-900', 'Airbus A321neo', 'Boeing 737 MAX 9']
    const aircraft = aircrafts[(seed + i) % aircrafts.length]

    list.push({
      id: `${from.code}-${to.code}-${airline.id}-${i}-${dateStr}`,
      flightNumber: `${airline.id}-${100 + (seed % 100) + i * 7}`,
      airline,
      from,
      to,
      departureTime,
      arrivalTime,
      duration,
      stops,
      price: basePrice,
      aircraft,
      terminal: `T${1 + (i % 2)}`,
      gate: `${String.fromCharCode(65 + (i % 4))}${10 + (i * 2)}`,
      baggageAllowance: airline.id === 'VJ' ? '7kg Carry-on' : '7kg Carry-on + 23kg Checked'
    })
  }

  return list.sort((a, b) => a.price - b.price)
}

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [step, setStep] = useState<'search' | 'results' | 'booking' | 'seats' | 'payment' | 'ticket' | 'tracker'>('search')
  
  // Search parameters
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway')
  const [departureCode, setDepartureCode] = useState('SGN')
  const [destinationCode, setDestinationCode] = useState('HAN')
  const [departDate, setDepartDate] = useState('2026-07-10')
  const [returnDate, setReturnDate] = useState('2026-07-17')
  const [passengerCount, setPassengerCount] = useState(1)
  const [cabinClass, setCabinClass] = useState<'Economy' | 'Business' | 'First'>('Economy')

  // Search Results
  const [flights, setFlights] = useState<Flight[]>([])
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  
  // Filter settings
  const [maxPriceFilter, setMaxPriceFilter] = useState(600)
  const [stopsFilter, setStopsFilter] = useState<'all' | 'direct' | '1stop'>('all')
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure'>('price')

  // Seat map state
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  
  // Passenger Form State
  const [passengerName, setPassengerName] = useState('')
  const [passengerEmail, setPassengerEmail] = useState('')
  const [passengerPhone, setPassengerPhone] = useState('')
  const [passengerPassport, setPassengerPassport] = useState('')
  const [mealPreference, setMealPreference] = useState('standard')
  const [extraBaggage, setExtraBaggage] = useState(0) // in kg extra
  const [travelInsurance, setTravelInsurance] = useState(false)

  // Payment Form State
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCVV, setCardCVV] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)

  // Tracker State
  const [trackerFlightNumber, setTrackerFlightNumber] = useState('SF-102')
  const [searchedTrackerFlight, setSearchedTrackerFlight] = useState<any>(null)

  // Feedback notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Hello! I am your SkyFlow Assistant. How can I help you book your flight today?' }
  ])
  const [chatInput, setChatInput] = useState('')

  // Show notification assistant helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  // Handle Dark mode toggle
  useEffect(() => {
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      root.style.backgroundColor = '#020617' // slate-950
    } else {
      root.classList.remove('dark')
      root.style.backgroundColor = '#f8fafc' // slate-50
    }
  }, [darkMode])

  // Get current departure and destination objects
  const departureAirport = useMemo(() => airports.find(a => a.code === departureCode) || airports[0], [departureCode])
  const destinationAirport = useMemo(() => airports.find(a => a.code === destinationCode) || airports[1], [destinationCode])

  // Handle Swap locations
  const handleSwapLocations = () => {
    const temp = departureCode
    setDepartureCode(destinationCode)
    setDestinationCode(temp)
    showToast('Swapped departure and destination', 'info')
  }

  // Handle Flight Search Action
  const handleSearchFlights = (e: React.FormEvent) => {
    e.preventDefault()
    if (departureCode === destinationCode) {
      showToast('Departure and destination cannot be the same.', 'error')
      return
    }
    
    // Generate flight listings
    const generated = generateFlightsForRoute(departureAirport, destinationAirport, departDate)
    setFlights(generated)

    // Reset filters
    const maxVal = Math.max(...generated.map(f => f.price), 500)
    setMaxPriceFilter(maxVal + 50)
    setStopsFilter('all')
    setSortBy('price')
    
    setStep('results')
    showToast(`Found ${generated.length} flights matching your search`, 'success')
  }

  // Sort and filter flights
  const filteredFlights = useMemo(() => {
    let result = [...flights]

    // Filter by price
    result = result.filter(f => f.price <= maxPriceFilter)

    // Filter by stops
    if (stopsFilter === 'direct') {
      result = result.filter(f => f.stops === 0)
    } else if (stopsFilter === '1stop') {
      result = result.filter(f => f.stops === 1)
    }

    // Sort
    if (sortBy === 'price') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'duration') {
      result.sort((a, b) => a.duration - b.duration)
    } else if (sortBy === 'departure') {
      result.sort((a, b) => a.departureTime.localeCompare(b.departureTime))
    }

    return result
  }, [flights, maxPriceFilter, stopsFilter, sortBy])

  // Generate deterministic seat map status based on flight ID
  const seatMapLayout = useMemo(() => {
    if (!selectedFlight) return { rows: [], occupied: new Set<string>() }
    const occupied = new Set<string>()
    const seed = selectedFlight.flightNumber.charCodeAt(3) || 5
    
    // Total 20 rows. Economy: 7 to 20, Business: 3 to 6, First Class: 1 to 2
    // Let's populate mock occupied seats deterministically
    const columns = ['A', 'B', 'C', 'D', 'E', 'F']
    for (let r = 1; r <= 20; r++) {
      columns.forEach(col => {
        const hash = (r * seed + col.charCodeAt(0)) % 10
        if (hash < 4) { // ~40% occupied
          occupied.add(`${r}${col}`)
        }
      })
    }
    return {
      rows: Array.from({ length: 20 }, (_, i) => i + 1),
      occupied
    }
  }, [selectedFlight])

  // Calculate pricing dynamics
  const seatPriceAddon = (seatId: string) => {
    const row = parseInt(seatId)
    if (row <= 2) return 150 // First Class seat cost addon
    if (row <= 6) return 75  // Business Class seat cost addon
    if (row <= 10) return 25 // Economy Preferred seat cost addon
    return 0
  }

  const seatClass = (row: number) => {
    if (row <= 2) return 'First'
    if (row <= 6) return 'Business'
    return 'Economy'
  }

  const handleSeatClick = (seatId: string, row: number) => {
    const currentClass = seatClass(row)
    if (cabinClass !== currentClass) {
      showToast(`Please select a seat within your booked cabin class (${cabinClass}) or change booking.`, 'error')
      return
    }

    if (seatMapLayout.occupied.has(seatId)) {
      showToast('This seat is already occupied.', 'error')
      return
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId))
    } else {
      if (selectedSeats.length >= passengerCount) {
        showToast(`You can only select up to ${passengerCount} seat(s) for your passengers.`, 'info')
        // Swap or replace the first selected seat
        setSelectedSeats([seatId])
      } else {
        setSelectedSeats(prev => [...prev, seatId])
      }
    }
  }

  // Calculate invoice
  const pricing = useMemo(() => {
    if (!selectedFlight) return { base: 0, seatAddon: 0, baggage: 0, insurance: 0, tax: 0, total: 0 }
    
    let basePrice = selectedFlight.price
    if (cabinClass === 'Business') basePrice *= 1.8
    if (cabinClass === 'First') basePrice *= 3.0

    const baseSum = basePrice * passengerCount
    const seatAddonSum = selectedSeats.reduce((sum, seat) => sum + seatPriceAddon(seat), 0)
    const baggageSum = extraBaggage * 1.5
    const insuranceSum = travelInsurance ? 25 * passengerCount : 0
    const taxSum = (baseSum + seatAddonSum) * 0.12 // 12% Vat/Airport Tax

    return {
      base: baseSum,
      seatAddon: seatAddonSum,
      baggage: baggageSum,
      insurance: insuranceSum,
      tax: Math.round(taxSum),
      total: Math.round(baseSum + seatAddonSum + baggageSum + insuranceSum + taxSum)
    }
  }, [selectedFlight, cabinClass, passengerCount, selectedSeats, extraBaggage, travelInsurance])

  // Payment process simulation
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardNumber || !cardHolder || !cardExpiry || !cardCVV) {
      showToast('Please fill out all payment details.', 'error')
      return
    }

    setPaymentLoading(true)
    setTimeout(() => {
      setPaymentLoading(false)
      setStep('ticket')
      showToast('Payment successful! Your e-tickets have been generated.', 'success')
    }, 2500)
  }

  // Tracker simulation
  const handleTrackFlight = (e: React.FormEvent) => {
    e.preventDefault()
    const num = trackerFlightNumber.toUpperCase().trim()
    if (!num) return

    // Generate mock active flight status
    const statusCodes = ['Delayed', 'On Time', 'Boarding', 'Departed', 'Scheduled']
    const airportsList = ['SGN', 'HAN', 'DAD', 'SIN', 'NRT', 'LHR']
    const fromAirport = airportsList[num.charCodeAt(0) % airportsList.length]
    let toAirport = airportsList[(num.charCodeAt(0) + 2) % airportsList.length]
    if (fromAirport === toAirport) toAirport = airportsList[(num.charCodeAt(0) + 1) % airportsList.length]

    const status = statusCodes[num.charCodeAt(num.length - 1) % statusCodes.length]
    const percent = status === 'Departed' ? 65 : status === 'Boarding' ? 0 : status === 'On Time' ? 0 : 0

    setSearchedTrackerFlight({
      flightNumber: num,
      airline: airlines[num.charCodeAt(1) % airlines.length].name,
      logoColor: airlines[num.charCodeAt(1) % airlines.length].logoColor,
      from: airports.find(a => a.code === fromAirport) || airports[0],
      to: airports.find(a => a.code === toAirport) || airports[1],
      depTime: '14:20',
      arrTime: '16:30',
      status,
      gate: `G${num.charCodeAt(num.length - 1) % 15 + 1}`,
      altitude: status === 'Departed' ? '34,000 ft' : '0 ft',
      speed: status === 'Departed' ? '820 km/h' : '0 km/h',
      progress: percent
    })
    showToast('Flight tracking details loaded.', 'success')
  }

  // chatbot chat submit
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userText = chatInput
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }])
    setChatInput('')

    // Generate smart response mock
    setTimeout(() => {
      let botText = "I'm not sure about that. Can you please rephrase? You can ask me to help you book a ticket, check flight statuses, or inquire about baggage rules."
      const lower = userText.toLowerCase()
      if (lower.includes('hello') || lower.includes('hi')) {
        botText = 'Hi there! Welcome to SkyFlow support. Ready to assist with your booking today!'
      } else if (lower.includes('baggage') || lower.includes('luggage')) {
        botText = 'Our standard economy ticket includes 7kg carry-on. You can purchase additional luggage allowances of up to 40kg during checkout!'
      } else if (lower.includes('cancel') || lower.includes('refund')) {
        botText = 'Flight cancellations can be requested up to 24 hours before departure. Refunds depend on your ticket class; First and Business classes feature complimentary cancellation.'
      } else if (lower.includes('price') || lower.includes('cheap')) {
        botText = 'Our lowest prices start around $50 on short routes. VietJet offers competitive low-cost flight tickets, while SkyFlow Airways provides premium business amenities!'
      } else if (lower.includes('book') || lower.includes('flight')) {
        botText = 'To search flights, fill in your departure and destination cities in our search widget on the main dashboard, select your date, and hit "Find Flights"!'
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: botText }])
    }, 800)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl backdrop-blur-xl ${
            notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
            notification.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
            'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
          }`}>
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {notification.type === 'info' && <Info className="w-5 h-5" />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-white/70'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setStep('search')}>
            <div className="bg-gradient-to-tr from-violet-600 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 text-white">
              <Plane className="w-6 h-6 transform -rotate-45" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-violet-500 to-indigo-400 bg-clip-text text-transparent">SKYFLOW</span>
              <span className="block text-[10px] font-semibold text-slate-500 tracking-wider">PREMIUM AIRLINES</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button 
              onClick={() => setStep('search')} 
              className={`hover:text-violet-500 transition-colors ${step === 'search' || step === 'results' ? 'text-violet-500' : 'text-slate-400 dark:text-slate-300'}`}
            >
              Book Flights
            </button>
            <button 
              onClick={() => {
                setStep('tracker')
                if (!searchedTrackerFlight) {
                  // Preload standard tracker
                  setTrackerFlightNumber('SF-102')
                  handleTrackFlight({ preventDefault: () => {} } as any)
                }
              }} 
              className={`hover:text-violet-500 transition-colors ${step === 'tracker' ? 'text-violet-500' : 'text-slate-400 dark:text-slate-300'}`}
            >
              Flight Tracker
            </button>
            <a href="#offers" className="text-slate-400 dark:text-slate-300 hover:text-violet-500 transition-colors">Offers</a>
            <a href="#destinations" className="text-slate-400 dark:text-slate-300 hover:text-violet-500 transition-colors">Destinations</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-colors ${darkMode ? 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-amber-400' : 'border-slate-200 bg-white hover:bg-slate-100 text-indigo-600'}`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={() => {
                setStep('tracker')
                setTrackerFlightNumber('SF-102')
                handleTrackFlight({ preventDefault: () => {} } as any)
              }} 
              className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md shadow-indigo-600/10 hover:shadow-indigo-500/20"
            >
              Check Status
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Step: Flight Search Form */}
        {step === 'search' && (
          <div className="space-y-12">
            
            {/* Hero Brand Section */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-800/40 bg-gradient-to-b from-indigo-950/20 to-slate-900/40 backdrop-blur-xl p-8 md:p-16">
              <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none" style={{ backgroundImage: "url('/hero.png')" }}></div>
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 max-w-2xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Premium Flight Experience
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-white">
                  The Art of Flight. <br />
                  <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">Redefined.</span>
                </h1>
                <p className="text-lg text-slate-300 font-medium">
                  Experience premium cabin services, real-time ticket customization, and advanced live route monitoring. Let SkyFlow carry you across the skies.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800/60">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Free Cancelation within 24h</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800/60">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>Real-time GPS Tracking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Search Widget */}
            <div className="relative -mt-16 md:-mt-24 z-20">
              <div className={`p-6 md:p-8 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all ${darkMode ? 'bg-slate-900/80 border-slate-800/80 shadow-slate-950/50' : 'bg-white/90 border-slate-200/80 shadow-slate-200/50'}`}>
                
                {/* Trip Type Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6 mb-6 border-slate-700/30">
                  <div className="flex bg-slate-800/30 p-1.5 rounded-xl border border-slate-700/20">
                    <button
                      onClick={() => setTripType('oneway')}
                      className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tripType === 'oneway' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      One Way
                    </button>
                    <button
                      onClick={() => setTripType('roundtrip')}
                      className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tripType === 'roundtrip' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Round Trip
                    </button>
                  </div>

                  <div className="flex gap-4">
                    {/* Cabin Class Selection */}
                    <select
                      value={cabinClass}
                      onChange={(e) => setCabinClass(e.target.value as any)}
                      className={`bg-slate-800/20 text-sm font-semibold rounded-xl px-4 py-2.5 border transition-all ${darkMode ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-800'}`}
                    >
                      <option value="Economy">Economy</option>
                      <option value="Business">Business Class</option>
                      <option value="First">First Class</option>
                    </select>

                    {/* Passenger Count Selection */}
                    <div className={`flex items-center gap-2 bg-slate-800/20 text-sm font-semibold rounded-xl px-4 py-2.5 border ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                      <Users className="w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min="1"
                        max="9"
                        value={passengerCount}
                        onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
                        className="w-8 bg-transparent text-center border-none focus:outline-none focus:ring-0 text-white font-bold"
                      />
                      <span className="text-slate-400">Pax</span>
                    </div>
                  </div>
                </div>

                {/* Form Inputs */}
                <form onSubmit={handleSearchFlights} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* From Airport */}
                  <div className="relative group md:col-span-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">From Departure</label>
                    <div className="flex items-center">
                      <div className="absolute left-3 text-slate-400 group-hover:text-indigo-400 transition-colors">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <select
                        value={departureCode}
                        onChange={(e) => setDepartureCode(e.target.value)}
                        className={`w-full pl-11 pr-4 py-4 rounded-xl border text-base font-bold transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                          darkMode ? 'bg-slate-800/40 border-slate-700/60 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        {airports.map(airport => (
                          <option key={airport.code} value={airport.code}>
                            {airport.city} ({airport.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="block text-[11px] text-slate-500 mt-1 italic pl-1 truncate">
                      {departureAirport.name}
                    </span>
                  </div>

                  {/* Swap Button */}
                  <div className="flex items-center justify-center md:h-20 md:col-span-1">
                    <button
                      type="button"
                      onClick={handleSwapLocations}
                      className="p-3.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-violet-400 hover:text-white transition-all transform hover:rotate-180 duration-300 shadow-md"
                      title="Swap cities"
                    >
                      <ArrowLeftRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* To Airport */}
                  <div className="relative group md:col-span-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">To Destination</label>
                    <div className="flex items-center">
                      <div className="absolute left-3 text-slate-400 group-hover:text-indigo-400 transition-colors">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <select
                        value={destinationCode}
                        onChange={(e) => setDestinationCode(e.target.value)}
                        className={`w-full pl-11 pr-4 py-4 rounded-xl border text-base font-bold transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                          darkMode ? 'bg-slate-800/40 border-slate-700/60 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        {airports.map(airport => (
                          <option key={airport.code} value={airport.code}>
                            {airport.city} ({airport.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="block text-[11px] text-slate-500 mt-1 italic pl-1 truncate">
                      {destinationAirport.name}
                    </span>
                  </div>

                  {/* Departure Dates */}
                  <div className={`relative group ${tripType === 'roundtrip' ? 'md:col-span-2' : 'md:col-span-5'}`}>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Departure Date</label>
                    <div className="flex items-center">
                      <div className="absolute left-3 text-slate-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <input
                        type="date"
                        value={departDate}
                        onChange={(e) => setDepartDate(e.target.value)}
                        className={`w-full pl-11 pr-4 py-4 rounded-xl border text-base font-bold transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                          darkMode ? 'bg-slate-800/40 border-slate-700/60 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Return Date */}
                  {tripType === 'roundtrip' && (
                    <div className="relative group md:col-span-3">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Return Date</label>
                      <div className="flex items-center">
                        <div className="absolute left-3 text-slate-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className={`w-full pl-11 pr-4 py-4 rounded-xl border text-base font-bold transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
                            darkMode ? 'bg-slate-800/40 border-slate-700/60 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="md:col-span-12 flex justify-end mt-4">
                    <button
                      type="submit"
                      className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:from-violet-700 text-white px-10 py-4.5 rounded-xl font-bold text-lg shadow-xl shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 duration-200 flex items-center justify-center gap-3"
                    >
                      <Search className="w-5 h-5" /> Find Flights
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Trending Offers & Destinations */}
            <div id="offers" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Special Promotional Offers</h2>
                  <p className="text-slate-400 text-sm">Save more on flights to top destinations worldwide</p>
                </div>
                <div className="inline-flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-pulse"></div>
                  <span className="text-xs text-violet-400 font-semibold uppercase">Updated hourly</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Summer Paradise', subtitle: 'Phu Quoc Direct', code: 'PQC', discount: '20% OFF', price: '$49', bg: 'from-orange-600/40 to-pink-800/40' },
                  { title: 'Chasing Sakura', subtitle: 'Tokyo Express', code: 'NRT', discount: 'Save $120', price: '$299', bg: 'from-rose-500/40 to-indigo-600/40' },
                  { title: 'European Elegance', subtitle: 'Paris Gateway', code: 'CDG', discount: 'Premium Deal', price: '$459', bg: 'from-blue-600/40 to-cyan-500/40' }
                ].map((offer, idx) => (
                  <div key={idx} className={`relative overflow-hidden rounded-2xl border p-6 flex flex-col justify-between h-48 group cursor-pointer transition-all hover:scale-[1.02] ${
                    darkMode ? 'bg-slate-900/60 border-slate-800/60' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${offer.bg} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <span className="text-xs font-bold text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20">{offer.discount}</span>
                        <h3 className="font-extrabold text-lg text-white mt-3 leading-tight">{offer.title}</h3>
                        <p className="text-xs text-slate-300 mt-1">{offer.subtitle}</p>
                      </div>
                      <span className="text-2xl font-black text-white">{offer.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-bold mt-auto pt-4 border-t border-slate-700/20 relative z-10">
                      <span>Limited Seats Left</span>
                      <span className="text-violet-400 group-hover:text-white transition-colors flex items-center gap-1">
                        Book now <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Experience Badges */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
              {[
                { icon: <Compass className="w-6 h-6 text-violet-400" />, title: 'Globally Connected', desc: 'Flights to over 240 destinations around the earth' },
                { icon: <Coffee className="w-6 h-6 text-emerald-400" />, title: 'Premium Comfort', desc: 'Gourmet meal selections and luxury lay-flat seating' },
                { icon: <Wifi className="w-6 h-6 text-cyan-400" />, title: 'In-Flight Connectivity', desc: 'Complimentary high-speed satellite Wi-Fi on all cabins' },
                { icon: <Shield className="w-6 h-6 text-amber-400" />, title: 'Elite Lounge Access', desc: 'Relax in our luxurious private airport lounges' }
              ].map((badge, idx) => (
                <div key={idx} className={`p-5 rounded-xl border flex gap-4 ${
                  darkMode ? 'bg-slate-900/30 border-slate-800/60' : 'bg-white border-slate-200'
                }`}>
                  <div className="bg-slate-800/40 p-3 rounded-xl h-fit border border-slate-700/20">
                    {badge.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">{badge.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Step: Search Results */}
        {step === 'results' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Column: Search Summary & Filters */}
            <div className="lg:col-span-1 space-y-6">
              <button
                onClick={() => setStep('search')}
                className="flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-white transition-colors group mb-4"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Modify Search
              </button>

              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="border-b pb-4 mb-4 border-slate-800/60">
                  <h3 className="font-extrabold text-base text-slate-200">Your Route</h3>
                  <div className="mt-3 flex items-center justify-between bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                    <div>
                      <span className="text-xl font-black text-white">{departureCode}</span>
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">{departureAirport.city}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-indigo-400" />
                    <div className="text-right">
                      <span className="text-xl font-black text-white">{destinationCode}</span>
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">{destinationAirport.city}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-slate-400 flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-semibold text-slate-200">{departDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Class:</span>
                      <span className="font-semibold text-slate-200">{cabinClass}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passengers:</span>
                      <span className="font-semibold text-slate-200">{passengerCount} Pax</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max Price</label>
                      <span className="text-sm font-extrabold text-indigo-400">${maxPriceFilter}</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="10"
                      value={maxPriceFilter}
                      onChange={(e) => setMaxPriceFilter(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Transit Stops</label>
                    <div className="space-y-2">
                      {[
                        { id: 'all', label: 'All Flights' },
                        { id: 'direct', label: 'Direct Only' },
                        { id: '1stop', label: '1 Stop Transit' }
                      ].map(opt => (
                        <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="stops"
                            checked={stopsFilter === opt.id}
                            onChange={() => setStopsFilter(opt.id as any)}
                            className="w-4.5 h-4.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/30 focus:ring-offset-slate-900"
                          />
                          <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/40">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sort Results By</label>
                    <div className="space-y-2">
                      {[
                        { id: 'price', label: 'Cheapest Fare' },
                        { id: 'duration', label: 'Shortest Flight' },
                        { id: 'departure', label: 'Departure Time' }
                      ].map(opt => (
                        <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="sort"
                            checked={sortBy === opt.id}
                            onChange={() => setSortBy(opt.id as any)}
                            className="w-4.5 h-4.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/30 focus:ring-offset-slate-900"
                          />
                          <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Flight List */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-semibold">
                  Showing <span className="text-white font-extrabold">{filteredFlights.length}</span> matching flights
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Interactive Search Result Page</span>
                </div>
              </div>

              {filteredFlights.length === 0 ? (
                <div className="p-16 rounded-2xl border border-slate-800 bg-slate-900/40 text-center space-y-4">
                  <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
                  <h3 className="text-xl font-extrabold text-white">No Flights Found</h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto">
                    Try expanding your price range, toggling transit stops, or selecting a different departure date.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFlights.map((flight) => {
                    const priceMultiplier = cabinClass === 'Business' ? 1.8 : cabinClass === 'First' ? 3.0 : 1.0
                    const finalPrice = Math.round(flight.price * priceMultiplier)

                    return (
                      <div
                        key={flight.id}
                        className={`rounded-2xl border transition-all overflow-hidden ${
                          selectedFlight?.id === flight.id
                            ? 'border-indigo-500 bg-indigo-950/20 ring-2 ring-indigo-500/30'
                            : 'border-slate-800/60 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700'
                        }`}
                      >
                        {/* Upper Section */}
                        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                          
                          {/* Airline Info */}
                          <div className="flex items-center gap-4 min-w-[200px]">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${flight.airline.logoColor} flex items-center justify-center text-white font-bold text-sm uppercase shadow-md`}>
                              {flight.airline.id}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-sm text-slate-200">{flight.airline.name}</h4>
                              <span className="block text-[11px] text-slate-400 font-semibold">{flight.flightNumber} • {flight.aircraft}</span>
                            </div>
                          </div>

                          {/* Flight Schedule */}
                          <div className="flex-1 flex items-center justify-between gap-4 max-w-lg">
                            <div className="space-y-1">
                              <span className="text-2xl font-black text-white">{flight.departureTime}</span>
                              <span className="block text-xs font-bold text-indigo-400">{flight.from.code}</span>
                              <span className="block text-[10px] text-slate-500 tracking-wide font-medium">{flight.from.city}</span>
                            </div>

                            {/* Duration / Stops bar */}
                            <div className="flex-1 flex flex-col items-center px-4">
                              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {Math.floor(flight.duration / 60)}h {flight.duration % 60}m
                              </span>
                              
                              <div className="relative w-full h-0.5 bg-slate-800 rounded-full my-2.5">
                                <div className="absolute inset-0 bg-indigo-500/60 rounded-full"></div>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                                {flight.stops > 0 && (
                                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-slate-900"></div>
                                )}
                              </div>

                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                {flight.stops === 0 ? (
                                  <span className="text-emerald-400">Direct</span>
                                ) : (
                                  <span className="text-amber-500">1 Stop ({flight.to.code})</span>
                                )}
                              </span>
                            </div>

                            <div className="space-y-1 text-right">
                              <span className="text-2xl font-black text-white">{flight.arrivalTime}</span>
                              <span className="block text-xs font-bold text-indigo-400">{flight.to.code}</span>
                              <span className="block text-[10px] text-slate-500 tracking-wide font-medium">{flight.to.city}</span>
                            </div>
                          </div>

                          {/* Price & Book */}
                          <div className="flex md:flex-col items-center justify-between md:text-right gap-4 md:pl-6 md:border-l md:border-slate-800/80">
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-semibold">One-Way Fare</span>
                              <span className="text-3xl font-black text-white">${finalPrice}</span>
                              <span className="block text-[10px] text-slate-500 mt-0.5">Incl. Tax & Fees</span>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedFlight(flight)
                                setStep('booking')
                              }}
                              className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-500/20"
                            >
                              Select Flight
                            </button>
                          </div>

                        </div>

                        {/* Lower Info Banner */}
                        <div className="px-6 py-3 bg-slate-950/30 border-t border-slate-800/40 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                              {flight.baggageAllowance}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Tv className="w-3.5 h-3.5 text-indigo-400" />
                              In-Flight Entertainment
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Terminal {flight.terminal} • Gate {flight.gate}</span>
                          </div>
                        </div>

                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Step: Passenger & Booking Details */}
        {step === 'booking' && selectedFlight && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Columns: Passenger Details Form */}
            <div className="lg:col-span-2 space-y-6">
              <button
                onClick={() => setStep('results')}
                className="flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-white transition-colors group mb-4"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Flight List
              </button>

              <div className={`p-6 md:p-8 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className="text-2xl font-extrabold text-white mb-6">Passenger Information</h2>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name (as in Passport)</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={passengerName}
                          onChange={(e) => setPassengerName(e.target.value)}
                          placeholder="JOHN DOE"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/40 text-sm font-bold text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Passport ID */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Passport Number</label>
                      <div className="relative">
                        <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={passengerPassport}
                          onChange={(e) => setPassengerPassport(e.target.value)}
                          placeholder="A1234567B"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/40 text-sm font-bold text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={passengerEmail}
                          onChange={(e) => setPassengerEmail(e.target.value)}
                          placeholder="john.doe@skyflow.com"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/40 text-sm font-bold text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={passengerPhone}
                          onChange={(e) => setPassengerPhone(e.target.value)}
                          placeholder="+84 90123456"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/40 text-sm font-bold text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Extras / Meal Options */}
                  <div className="pt-6 border-t border-slate-800/60 space-y-6">
                    <h3 className="text-lg font-bold text-white">Select In-Flight Amenities</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Meal preference */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Catering Preferences</label>
                        <select
                          value={mealPreference}
                          onChange={(e) => setMealPreference(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/40 text-sm font-bold text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="standard">Standard Gourmet Meal</option>
                          <option value="vegan">Vegan / Vegetarian Feast</option>
                          <option value="halal">Halal Certified Dining</option>
                          <option value="kosher">Kosher Cuisine</option>
                        </select>
                      </div>

                      {/* Extra baggage */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Extra Checked baggage</label>
                        <select
                          value={extraBaggage}
                          onChange={(e) => setExtraBaggage(parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/40 text-sm font-bold text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="0">Standard Allowance (Free)</option>
                          <option value="15">+15kg Extra Baggage (+$22)</option>
                          <option value="25">+25kg Extra Baggage (+$37)</option>
                          <option value="40">+40kg Premium Baggage (+$60)</option>
                        </select>
                      </div>
                    </div>

                    {/* Travel Insurance checkbox */}
                    <label className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      travelInsurance ? 'bg-indigo-950/20 border-indigo-500/50' : 'bg-slate-800/20 border-slate-800'
                    }`}>
                      <input
                        type="checkbox"
                        checked={travelInsurance}
                        onChange={(e) => setTravelInsurance(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/30"
                      />
                      <div>
                        <span className="block text-sm font-extrabold text-slate-200">Add Premium Travel Insurance (+$25 / passenger)</span>
                        <span className="block text-xs text-slate-400 mt-0.5">Covers dynamic itinerary cancellations, medical emergencies, and lost baggage claims. Recommended by 94% of our travelers.</span>
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (!passengerName || !passengerPassport || !passengerEmail || !passengerPhone) {
                          showToast('Please complete all passenger details.', 'error')
                          return
                        }
                        setSelectedSeats([]) // clear old selections
                        setStep('seats')
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center gap-2"
                    >
                      Choose Flight Seat <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Fare Summary Panel */}
            <div className="lg:col-span-1">
              <div className={`p-6 rounded-2xl border sticky top-24 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="font-extrabold text-base text-slate-200 mb-4">Flight Summary</h3>
                
                <div className="space-y-4 border-b pb-4 mb-4 border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${selectedFlight.airline.logoColor} flex items-center justify-center text-white font-bold text-xs`}>
                      {selectedFlight.airline.id}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-200">{selectedFlight.airline.name}</span>
                      <span className="block text-[10px] text-slate-400">{selectedFlight.flightNumber} • {selectedFlight.aircraft}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm bg-slate-950/40 p-3 rounded-xl border border-slate-800/40">
                    <div>
                      <span className="font-extrabold text-white">{selectedFlight.departureTime}</span>
                      <span className="block text-[10px] text-slate-400">{selectedFlight.from.city} ({selectedFlight.from.code})</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-400" />
                    <div className="text-right">
                      <span className="font-extrabold text-white">{selectedFlight.arrivalTime}</span>
                      <span className="block text-[10px] text-slate-400">{selectedFlight.to.city} ({selectedFlight.to.code})</span>
                    </div>
                  </div>
                </div>

                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">Fare breakdown</h4>
                <div className="space-y-2 text-sm border-b pb-4 mb-4 border-slate-800/60">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Fare ({passengerCount} Pax)</span>
                    <span className="font-semibold text-slate-200">${pricing.base}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cabin Class Class Addon</span>
                    <span className="font-semibold text-emerald-400">
                      {cabinClass === 'Business' ? '+$1.8x' : cabinClass === 'First' ? '+$3.0x' : 'None'}
                    </span>
                  </div>
                  {pricing.baggage > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Add-on Luggage</span>
                      <span className="font-semibold text-slate-200">${pricing.baggage}</span>
                    </div>
                  )}
                  {pricing.insurance > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Travel Protection</span>
                      <span className="font-semibold text-slate-200">${pricing.insurance}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Taxes & Airport Surcharge</span>
                    <span className="font-semibold text-slate-200">${pricing.tax}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-xs text-slate-400 font-semibold">Total Invoice</span>
                    <span className="text-3xl font-black text-white">${pricing.total}</span>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">USD Currencies</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Step: Seat Custom Selection Map */}
        {step === 'seats' && selectedFlight && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Interactive Seat Grid Map */}
            <div className="lg:col-span-2 space-y-6">
              <button
                onClick={() => setStep('booking')}
                className="flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-white transition-colors group mb-4"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Passenger Details
              </button>

              <div className={`p-6 md:p-8 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-extrabold text-white">Select Cabin Seats</h2>
                    <p className="text-xs text-slate-400 mt-1">Select {passengerCount} seat(s) matching your cabin selection: <span className="text-indigo-400 font-bold">{cabinClass}</span></p>
                  </div>

                  {/* Seat Type Legends */}
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-slate-800 border border-slate-700"></div>
                      <span className="text-slate-400">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-indigo-600"></div>
                      <span className="text-slate-400">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-[8px] text-slate-600 font-bold">X</div>
                      <span className="text-slate-400">Occupied</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/40"></div>
                      <span className="text-slate-400">Premium Addon</span>
                    </div>
                  </div>
                </div>

                {/* Aircraft Body Outline */}
                <div className="relative bg-slate-950/60 rounded-3xl border border-slate-800 p-8 max-w-sm mx-auto overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-indigo-500/5 to-transparent"></div>
                  
                  {/* Flight Cockpit Mock */}
                  <div className="w-32 h-14 border border-slate-800 bg-slate-900 rounded-t-full mx-auto flex items-center justify-center mb-8 relative">
                    <div className="absolute -top-1 w-12 h-0.5 bg-indigo-500/30"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">COCKPIT</span>
                  </div>

                  {/* Seats Layout */}
                  <div className="space-y-4">
                    {seatMapLayout.rows.map((row) => {
                      const currentClass = seatClass(row)
                      const isFirst = row <= 2
                      
                      return (
                        <div key={row} className="flex items-center justify-between gap-1">
                          
                          {/* Left Seats A, B, C */}
                          <div className="flex gap-1.5 flex-1 justify-end">
                            {['A', 'B', 'C'].map((col) => {
                              // First class only has A, B, E, F
                              if (isFirst && col === 'C') return <div key={col} className="w-7 h-7"></div>
                              const seatId = `${row}${col}`
                              const isOccupied = seatMapLayout.occupied.has(seatId)
                              const isSelected = selectedSeats.includes(seatId)
                              const priceAddon = seatPriceAddon(seatId)

                              return (
                                <button
                                  key={col}
                                  type="button"
                                  onClick={() => handleSeatClick(seatId, row)}
                                  className={`w-7.5 h-7.5 rounded text-[10px] font-bold transition-all flex items-center justify-center border ${
                                    isOccupied
                                      ? 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
                                      : isSelected
                                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                                      : currentClass !== cabinClass
                                      ? 'bg-slate-900/20 border-slate-800/40 text-slate-600 cursor-not-allowed'
                                      : priceAddon > 0
                                      ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                                  }`}
                                  disabled={isOccupied}
                                  title={`${seatId} (${currentClass})`}
                                >
                                  {isOccupied ? 'X' : col}
                                </button>
                              )
                            })}
                          </div>

                          {/* Aisle Spacer */}
                          <div className="w-8 text-center text-[10px] font-bold text-slate-500">
                            {row}
                          </div>

                          {/* Right Seats D, E, F */}
                          <div className="flex gap-1.5 flex-1 justify-start">
                            {['D', 'E', 'F'].map((col) => {
                              // First class only has A, B, E, F
                              if (isFirst && col === 'D') return <div key={col} className="w-7 h-7"></div>
                              const seatId = `${row}${col}`
                              const isOccupied = seatMapLayout.occupied.has(seatId)
                              const isSelected = selectedSeats.includes(seatId)
                              const priceAddon = seatPriceAddon(seatId)

                              return (
                                <button
                                  key={col}
                                  type="button"
                                  onClick={() => handleSeatClick(seatId, row)}
                                  className={`w-7.5 h-7.5 rounded text-[10px] font-bold transition-all flex items-center justify-center border ${
                                    isOccupied
                                      ? 'bg-slate-950 border-slate-900 text-slate-600 cursor-not-allowed'
                                      : isSelected
                                      ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                                      : currentClass !== cabinClass
                                      ? 'bg-slate-900/20 border-slate-800/40 text-slate-600 cursor-not-allowed'
                                      : priceAddon > 0
                                      ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                                  }`}
                                  disabled={isOccupied}
                                  title={`${seatId} (${currentClass})`}
                                >
                                  {isOccupied ? 'X' : col}
                                </button>
                              )
                            })}
                          </div>

                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Booking Summary & Action Button */}
            <div className="lg:col-span-1 space-y-6">
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="font-extrabold text-base text-slate-200 mb-4">Seat Selections</h3>
                
                <div className="space-y-4 border-b pb-4 mb-4 border-slate-800/60">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Class Allowance:</span>
                    <span className="font-bold text-white bg-slate-800 px-3 py-1 rounded-full border border-slate-700">{cabinClass}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Seats Needed:</span>
                    <span className="font-bold text-indigo-400">{passengerCount} Pax</span>
                  </div>
                  <div className="flex justify-between items-start text-sm">
                    <span className="text-slate-400">Selected Seats:</span>
                    <div className="flex flex-wrap gap-1.5 justify-end max-w-[150px]">
                      {selectedSeats.length === 0 ? (
                        <span className="text-rose-400 font-semibold italic">None Selected</span>
                      ) : (
                        selectedSeats.map(seat => (
                          <span key={seat} className="bg-indigo-600 text-white font-extrabold text-xs px-2.5 py-1 rounded border border-indigo-400">
                            {seat}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Invoice Review</h4>
                <div className="space-y-2 text-sm border-b pb-4 mb-4 border-slate-800/60">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Tickets</span>
                    <span className="font-semibold text-slate-200">${pricing.base}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Seat Upgrades Fee</span>
                    <span className="font-semibold text-slate-200">${pricing.seatAddon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Taxes & Fees</span>
                    <span className="font-semibold text-slate-200">${pricing.tax}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="block text-xs text-slate-400 font-semibold">Total Price</span>
                    <span className="text-3xl font-black text-white">${pricing.total}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (selectedSeats.length < passengerCount) {
                      showToast(`Please select exactly ${passengerCount} seat(s) before continuing.`, 'error')
                      return
                    }
                    setStep('payment')
                  }}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:from-violet-700 text-white font-bold text-sm py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" /> Go to Checkout
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Step: Payment Simulator */}
        {step === 'payment' && selectedFlight && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Premium Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              <button
                onClick={() => setStep('seats')}
                className="flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-white transition-colors group mb-4"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Seat Selection
              </button>

              <div className={`p-6 md:p-8 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800/60">
                  <h2 className="text-2xl font-extrabold text-white">Payment Method</h2>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>256-bit SSL Encrypted Connection</span>
                  </div>
                </div>

                {/* Simulated Credit Card graphics */}
                <div className="relative max-w-sm mx-auto h-48 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-600 p-6 text-white shadow-2xl flex flex-col justify-between overflow-hidden mb-8">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-black tracking-widest">SKYFLOW PREMIER CARD</span>
                    <div className="w-12 h-8 bg-white/20 rounded-md backdrop-blur-md"></div>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-xl font-bold tracking-widest block font-mono">
                      {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                    </span>
                    <span className="text-[10px] text-indigo-200 uppercase tracking-widest">Card number</span>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[9px] text-indigo-200 uppercase tracking-wider block">Cardholder</span>
                      <span className="text-sm font-bold uppercase tracking-wide truncate max-w-[200px]">
                        {cardHolder || 'JOHN DOE'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-indigo-200 uppercase tracking-wider block">Expires</span>
                      <span className="text-sm font-bold font-mono">
                        {cardExpiry || 'MM/YY'}
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {/* Cardholder name */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Cardholder Name</label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="JOHN DOE"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/40 text-sm font-bold text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Card number */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Card Number</label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="4111222233334444"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/40 text-sm font-bold text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Expiry */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Expiration Date</label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/40 text-sm font-bold text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                        />
                      </div>

                      {/* CVV */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Security CVV</label>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                          placeholder="•••"
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-700 bg-slate-800/40 text-sm font-bold text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={paymentLoading}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-base py-4.5 rounded-xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
                  >
                    {paymentLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing Transaction...</span>
                      </div>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" /> Pay Now ${pricing.total}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Invoice summary */}
            <div className="lg:col-span-1">
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="font-extrabold text-base text-slate-200 mb-4">Payment Invoice</h3>
                
                <div className="space-y-4 border-b pb-4 mb-4 border-slate-800/60">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Route:</span>
                    <span className="font-bold text-white">{departureCode} to {destinationCode}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Seats Booked:</span>
                    <span className="font-mono text-indigo-400 font-bold">{selectedSeats.join(', ')}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm border-b pb-4 mb-4 border-slate-800/60">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tickets ({passengerCount} Pax)</span>
                    <span className="font-semibold text-slate-200">${pricing.base}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Seat upgrades</span>
                    <span className="font-semibold text-slate-200">${pricing.seatAddon}</span>
                  </div>
                  {pricing.baggage > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Luggage fee</span>
                      <span className="font-semibold text-slate-200">${pricing.baggage}</span>
                    </div>
                  )}
                  {pricing.insurance > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Travel insurance</span>
                      <span className="font-semibold text-slate-200">${pricing.insurance}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Taxes & surcharge</span>
                    <span className="font-semibold text-slate-200">${pricing.tax}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-xs text-slate-400 font-semibold">Total Amount</span>
                    <span className="text-3xl font-black text-white">${pricing.total}</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Secure
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Step: Booking Success & Boarding Pass Dashboard */}
        {step === 'ticket' && selectedFlight && (
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Header message */}
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-white">Booking Confirmed!</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Thank you for choosing SkyFlow. Your ticket reservation is complete, and your e-ticket details have been emailed.
              </p>
            </div>

            {/* Boarding Pass Graphics */}
            <div className={`rounded-3xl border overflow-hidden shadow-2xl relative ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              {/* Top accent line */}
              <div className="h-2 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500"></div>
              
              {/* Pass Main Body */}
              <div className="p-6 md:p-8 space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-6 border-slate-700/20">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white">
                      <Plane className="w-4 h-4 transform -rotate-45" />
                    </div>
                    <span className="font-extrabold text-sm tracking-wider">SKYFLOW BOARDING PASS</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 uppercase">{cabinClass} Class</span>
                </div>

                {/* Locations flight details */}
                <div className="flex justify-between items-center gap-6">
                  <div>
                    <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Origin</span>
                    <span className="text-3xl font-black text-white">{selectedFlight.from.code}</span>
                    <span className="block text-xs text-slate-400 mt-0.5">{selectedFlight.from.city}</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center">
                    <span className="text-xs text-indigo-400 font-bold">{selectedFlight.flightNumber}</span>
                    <div className="w-full relative h-0.5 bg-slate-800 my-2">
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 border-2 border-indigo-400 rounded-full flex items-center justify-center">
                        <Plane className="w-2.5 h-2.5 text-indigo-400 transform -rotate-45" />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">Direct Route</span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">Destination</span>
                    <span className="text-3xl font-black text-white">{selectedFlight.to.code}</span>
                    <span className="block text-xs text-slate-400 mt-0.5">{selectedFlight.to.city}</span>
                  </div>
                </div>

                {/* Passenger Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-700/20 text-sm">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Passenger</span>
                    <span className="font-extrabold text-white uppercase">{passengerName || 'JOHN DOE'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Seat Number</span>
                    <span className="font-mono font-extrabold text-indigo-400 text-base">{selectedSeats.join(', ') || '3A'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Gate</span>
                    <span className="font-extrabold text-white">{selectedFlight.gate}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Terminal</span>
                    <span className="font-extrabold text-white">{selectedFlight.terminal}</span>
                  </div>
                </div>

                {/* Timing Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-700/20 text-sm">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Flight Date</span>
                    <span className="font-extrabold text-white">{departDate}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Departure</span>
                    <span className="font-extrabold text-white">{selectedFlight.departureTime}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Boarding</span>
                    <span className="font-extrabold text-amber-400">13:45</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Class Cabin</span>
                    <span className="font-extrabold text-white">{cabinClass}</span>
                  </div>
                </div>

                {/* QR Barcode Section */}
                <div className="pt-6 border-t border-dashed border-slate-700/30 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-950/20 p-5 rounded-2xl">
                  <div className="space-y-1">
                    <span className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">E-Ticket QR Code</span>
                    <span className="block text-xs text-slate-400 leading-relaxed max-w-xs">Scan this code at the gate or self-check-in counters to print your official bag tags and boarding passes.</span>
                  </div>

                  {/* High Tech simulated QR code */}
                  <div className="w-24 h-24 bg-white p-1.5 rounded-lg border border-slate-700 shadow-lg flex flex-wrap gap-[2.5px] items-center justify-center opacity-90">
                    {/* Simulated pixelated QR cells */}
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-sm ${
                          i % 5 === 0 || i % 3 === 0 || i === 7 || i === 14 ? 'bg-slate-950' : 'bg-slate-100'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Actions: Track Flight or Return Home */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setTrackerFlightNumber(selectedFlight.flightNumber)
                  setSearchedTrackerFlight({
                    flightNumber: selectedFlight.flightNumber,
                    airline: selectedFlight.airline.name,
                    logoColor: selectedFlight.airline.logoColor,
                    from: selectedFlight.from,
                    to: selectedFlight.to,
                    depTime: selectedFlight.departureTime,
                    arrTime: selectedFlight.arrivalTime,
                    status: 'Scheduled',
                    gate: selectedFlight.gate,
                    altitude: '0 ft',
                    speed: '0 km/h',
                    progress: 0
                  })
                  setStep('tracker')
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
              >
                <Activity className="w-4 h-4" /> Track Flight Status
              </button>

              <button
                onClick={() => {
                  setStep('search')
                  setSelectedSeats([])
                  setSelectedFlight(null)
                  setPassengerName('')
                  setPassengerEmail('')
                  setPassengerPhone('')
                  setPassengerPassport('')
                }}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                Return to Homepage
              </button>
            </div>

          </div>
        )}

        {/* Step: Flight Tracker */}
        {step === 'tracker' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-white">Live Flight GPS Tracker</h2>
              <p className="text-slate-400 text-sm">Enter any flight number to view departure times, arrival status, and radar progress.</p>
            </div>

            {/* Tracker Form */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'}`}>
              <form onSubmit={handleTrackFlight} className="flex gap-4">
                <div className="relative flex-1">
                  <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transform -rotate-45" />
                  <input
                    type="text"
                    required
                    value={trackerFlightNumber}
                    onChange={(e) => setTrackerFlightNumber(e.target.value)}
                    placeholder="Enter Flight Number (e.g. SF-102, VN-213)"
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-700 bg-slate-800/40 text-sm font-bold text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase tracking-widest"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm px-8 rounded-xl transition-all shadow-md shadow-indigo-600/10"
                >
                  Locate Route
                </button>
              </form>
            </div>

            {/* GPS Tracker details card */}
            {searchedTrackerFlight && (
              <div className={`rounded-3xl border overflow-hidden shadow-2xl relative ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-cyan-400"></div>

                <div className="p-6 md:p-8 space-y-6">
                  {/* Status header */}
                  <div className="flex justify-between items-center border-b pb-4 border-slate-800/60">
                    <div>
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Flight radar</span>
                      <h3 className="text-xl font-extrabold text-white mt-0.5">{searchedTrackerFlight.flightNumber}</h3>
                    </div>
                    
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                      searchedTrackerFlight.status === 'On Time' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                      searchedTrackerFlight.status === 'Delayed' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
                      searchedTrackerFlight.status === 'Departed' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' :
                      'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}>
                      • {searchedTrackerFlight.status}
                    </span>
                  </div>

                  {/* Route airports */}
                  <div className="flex justify-between items-center gap-6">
                    <div>
                      <span className="text-3xl font-black text-white">{searchedTrackerFlight.from.code}</span>
                      <span className="block text-xs text-slate-400 mt-0.5">{searchedTrackerFlight.from.city}</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-4">
                      <span className="text-xs text-indigo-400 font-bold">{searchedTrackerFlight.airline}</span>
                      
                      <div className="relative w-full h-0.5 bg-slate-800 my-2">
                        {/* Progress Bar */}
                        <div
                          className="absolute inset-y-0 left-0 bg-indigo-500 transition-all duration-500"
                          style={{ width: `${searchedTrackerFlight.progress}%` }}
                        ></div>
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-900 border-2 border-indigo-400 rounded-full flex items-center justify-center transition-all duration-500"
                          style={{ left: `calc(${searchedTrackerFlight.progress}% - 8px)` }}
                        >
                          <Plane className="w-2.5 h-2.5 text-indigo-400 transform -rotate-45" />
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-3xl font-black text-white">{searchedTrackerFlight.to.code}</span>
                      <span className="block text-xs text-slate-400 mt-0.5">{searchedTrackerFlight.to.city}</span>
                    </div>
                  </div>

                  {/* Live Telemetry Radar */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/60 text-center">
                    <div className="p-3 bg-slate-950/30 rounded-xl border border-slate-800/40">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Altitude</span>
                      <span className="block text-sm font-extrabold text-white mt-1">{searchedTrackerFlight.altitude}</span>
                    </div>
                    <div className="p-3 bg-slate-950/30 rounded-xl border border-slate-800/40">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Radar Speed</span>
                      <span className="block text-sm font-extrabold text-white mt-1">{searchedTrackerFlight.speed}</span>
                    </div>
                    <div className="p-3 bg-slate-950/30 rounded-xl border border-slate-800/40">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Gate</span>
                      <span className="block text-sm font-extrabold text-white mt-1">{searchedTrackerFlight.gate}</span>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Floating Chat Assistant Panel */}
      <div className="fixed bottom-6 right-6 z-40">
        {chatOpen ? (
          <div className="w-80 h-96 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="bg-indigo-600 px-4 py-3 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">SkyFlow Assistant</span>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-indigo-200 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs flex flex-col">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[80%] p-3 rounded-xl ${
                    msg.sender === 'bot'
                      ? 'bg-slate-800 text-slate-200 border border-slate-700/50 self-start'
                      : 'bg-indigo-600 text-white self-end'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input area */}
            <form onSubmit={handleChatSubmit} className="border-t border-slate-800 p-2 bg-slate-950/50 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about bags, meals, pricing..."
                className="flex-1 bg-slate-800 text-xs text-white border border-slate-700 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg text-xs font-bold"
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="w-14 h-14 bg-gradient-to-tr from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all"
            aria-label="Open support chat"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Footer */}
      <footer className={`border-t py-12 mt-16 transition-colors ${darkMode ? 'border-slate-900 bg-slate-950/40 text-slate-500' : 'border-slate-200 bg-slate-100 text-slate-600'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/10 p-2 rounded-lg text-indigo-500 border border-indigo-500/20">
              <Plane className="w-5 h-5 transform -rotate-45" />
            </div>
            <div>
              <span className="text-sm font-extrabold text-slate-300">SKYFLOW FLIGHT BOOKING SYSTEM</span>
              <span className="block text-[10px] text-slate-500 tracking-wide font-medium">© 2026 SkyFlow Airlines. All rights reserved.</span>
            </div>
          </div>

          <div className="flex gap-6 text-xs font-semibold">
            <a href="#privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-indigo-400 transition-colors">Terms of Carriage</a>
            <a href="#support" className="hover:text-indigo-400 transition-colors">Customer Support</a>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default App
