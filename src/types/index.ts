export type Section =
  | 'dashboard' | 'itinerary' | 'parks' | 'reservations'
  | 'safety' | 'photo-spots' | 'maps'
  | 'gastronomy' | 'shopping' | 'costs' | 'checklist'

// Open string — template users name their own cities/regions.
export type City = string

export interface Period {
  title: string
  description: string
  howToGet?: string
  meal?: string
  tip?: string
  planB?: string
  mapPointId?: string
}

export interface DayActivity {
  id: string
  dayNumber: number
  date: string
  city: City
  highlight: string
  emoji: string
  alert?: string
  heroImage: string
  morning: Period
  afternoon: Period
  night: Period
  dailyTip: string
}

export type ChecklistCategory =
  | 'documents' | 'tickets' | 'transport'
  | 'clothes' | 'pharmacy' | 'electronics'
  | 'financial' | 'reservations'

export interface ChecklistItem {
  id: string
  category: ChecklistCategory
  label: string
  detail?: string
  critical: boolean
  done?: boolean
}

export type VoucherStatus = 'paid' | 'partial' | 'pending' | 'cancelled'
export type VoucherCategory =
  | 'flight' | 'hotel' | 'park' | 'transport' | 'insurance' | 'tour'

export interface Voucher {
  id: string
  category: VoucherCategory
  emoji: string
  description: string
  supplier: string
  confirmationCode?: string
  checkinDate?: string
  checkoutDate?: string
  amount: number
  // Open string — accepts any ISO 4217 code (USD, EUR, BRL, JPY, TRY...).
  currency: string
  status: VoucherStatus
  notes?: string
}

export type FoodRating = 'bom' | 'otimo' | 'imperdivel'
export type FoodCategory = 'prato' | 'snack' | 'doce' | 'bebida' | 'konbini'

export interface FoodItem {
  id: string
  name: string
  // Local-language name (kept as `nameJP` for template stability — represents the
  // dish/item's native-script name regardless of destination language).
  nameJP: string
  category: FoodCategory
  rating: FoodRating
  where: string
  description: string
  emoji: string
  image?: string
  mustTry: boolean
}

export type ShopCategory =
  | 'electronics' | 'fashion' | 'anime' | 'pokemon'
  | 'watches' | 'souvenirs' | 'beauty' | 'food'

export interface ShopGuide {
  id: string
  category: ShopCategory
  emoji: string
  title: string
  where: string[]
  tips: string[]
  budget: string
  taxFree: boolean
}

export interface CostItem {
  id: string
  category: 'flight' | 'accommodation' | 'food' | 'transport' | 'themed' | 'tours' | 'shopping' | 'misc'
  description: string
  // Amounts in HOME currency (whatever the traveler uses at origin).
  estimatedHome: number
  actualHome?: number
  paid: boolean
}

export interface PhotoSpot {
  id: string
  name: string
  city: City
  description: string
  bestTime: string
  image: string
  coordinates: [number, number]
  tips: string[]
  hashtags: string[]
}

export interface MapPoint {
  id: string
  name: string
  city: City
  category: 'temple' | 'food' | 'park' | 'shopping' | 'hotel' | 'transport' | 'attraction'
  emoji: string
  coordinates: [number, number]
  description: string
}

export interface SafetyTip {
  id: string
  category: 'social' | 'safety' | 'emergency' | 'etiquette' | 'transport'
  emoji: string
  title: string
  description: string
  critical?: boolean
}

// ─── Medical Records ────────────────────────────────────────────
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown'

export interface EmergencyContact {
  name: string
  phone: string
  relation: string
}

export interface Traveler {
  id: string
  fullName: string
  passport: string
  birthDate: string
  bloodType: BloodType
  allergies: string
  chronicMeds: string
  conditions?: string
  // Home-country emergency contact (kept field name for template stability).
  emergencyContactBR: EmergencyContact
  insurancePolicy: string
  insurancePhoneLocal: string
  insurancePhoneIntl: string
  notes?: string
}

// ─── Incident Protocols ─────────────────────────────────────────
export type IncidentSeverity = 'high' | 'medium'

export interface IncidentStep {
  order: number
  label: string
  detail?: string
}

export interface IncidentContact {
  label: string
  phone?: string
  note?: string
}

export interface IncidentProtocol {
  id: string
  severity: IncidentSeverity
  emoji: string
  title: string
  scenario: string
  steps: IncidentStep[]
  requiredDocs: string[]
  relatedContacts: IncidentContact[]
}

// ─── Theme Parks ────────────────────────────────────────────────
export interface TicketWindow {
  when: string
  where: string
  // Free-form strings so the template can show "¥10,000" or "$50" verbatim.
  costDest: string
  costHome: string
  tip: string
}

export interface MustDoEntry {
  priority: number
  attraction: string
  why: string
  expressPass?: boolean
}

export interface RequiredApp {
  name: string
  purpose: string
  platform: 'iOS' | 'Android' | 'Web' | 'iOS/Android'
}

export interface ParkGuide {
  // Open string — template users can name their parks freely.
  id: string
  name: string
  shortName: string
  emoji: string
  heroImage: string
  city: City
  openingHour: string
  closingHour: string
  ticketWindow: TicketWindow
  mustDoOrder: MustDoEntry[]
  expressPassTier: string[]
  requiredApps: RequiredApp[]
  ropeDropTactic: string
  mobileOrderSetup?: string[]
  foodStrategy: string[]
  exitStrategy: string
  criticalAlerts: string[]
}

// ─── 7-day Forecast ─────────────────────────────────────────────
export interface ForecastDay {
  date: string             // ISO yyyy-mm-dd
  tempMaxC: number
  tempMinC: number
  precipitationProb: number
  condition: string
  emoji: string
}
