export type ActiveTab =
  | 'dashboard'
  | 'ai-assistant'
  | 'symptom-checker'
  | 'medical-scanner'
  | 'medicine-manager'
  | 'digital-wellbeing'
  | 'sleep-coach'
  | 'mental-wellness'
  | 'nutrition-ai'
  | 'fitness'
  | 'wearables'
  | 'doctor-connect'
  | 'emergency'
  | 'emergency-response'
  | 'risk-prediction'
  | 'community'
  | 'gamification'
  | 'profile'
  | 'admin-dashboard';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: string;
  heightCm: number;
  weightKg: number;
  allergies: string[];
  chronicConditions: string[];
  medicationsCount: number;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  familyHistory: string[];
  lifestyle: {
    smoking: 'Non-smoker' | 'Former' | 'Active';
    alcohol: 'None' | 'Occasional' | 'Moderate' | 'Heavy';
    activityLevel: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';
    dietPreference: 'Balanced' | 'Keto' | 'Vegan' | 'Vegetarian' | 'Mediterranean';
  };
  avatarUrl: string;
  primaryDoctor?: string;
  emergencyContacts?: { name: string; relationship: string; phone: string }[];
  connectedWearables?: WearableDevice[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'medication' | 'sleep' | 'system' | 'doctor' | 'warning';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  bio: string;
  rating: number;
  consultationsCount: number;
  pricePerConsult: number;
  availabilityStatus: string;
}

export interface CommunityPost {
  id: string;
  authorAlias?: string;
  authorName?: string;
  authorAvatar?: string;
  groupCategory?: string;
  category?: string;
  title: string;
  content: string;
  likes?: number;
  upvotes?: number;
  commentsCount?: number;
  commentCount?: number;
  createdAt?: string;
  timestamp?: string;
  isAnonymous?: boolean;
}

export interface GamificationState {
  xp: number;
  level: number;
  coins: number;
  healthTokens?: number;
  levelTitle?: string;
  streakDays: number;
  badges: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: string;
  }[];
  achievements?: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    xpReward: number;
  }[];
  dailyMissions: {
    id: string;
    title: string;
    xpReward: number;
    coinReward: number;
    completed: boolean;
  }[];
}

export type GamificationStats = GamificationState;

export interface CompositeHealthScores {
  overallHealthScore: number; // 0-100
  stressScore: number; // 0-100 (lower is better)
  fitnessScore: number; // 0-100
  sleepScore: number; // 0-100
  digitalWellbeingScore: number; // 0-100
  nutritionScore: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  imageUrl?: string;
  sources?: { title: string; uri: string }[];
  audioUrl?: string;
}

export interface SymptomResult {
  isEmergency: boolean;
  emergencyReasoning?: string;
  overallSeverity: 'Low' | 'Moderate' | 'High' | 'Critical';
  likelyCauses: {
    condition: string;
    confidence: number;
    severity: string;
    description: string;
  }[];
  recommendedSpecialist: string;
  clinicalReasoning: string;
  recommendedActions: string[];
  disclaimer: string;
}

export interface ScannedMetric {
  name: string;
  value: string;
  normalRange: string;
  status: 'Normal' | 'Low' | 'High' | 'Critical';
  significance: string;
}

export interface MedicalScanReport {
  id: string;
  title: string;
  date: string;
  documentType: string;
  summary: string;
  extractedMetrics: ScannedMetric[];
  medicalGlossary: { term: string; definition: string }[];
  keyRecommendations: string[];
  questionsForDoctor: string[];
  fileDataUrl?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g. "Twice Daily (8 AM, 8 PM)"
  times: string[]; // ["08:00", "20:00"]
  pillsRemaining: number;
  totalPills: number;
  category: string;
  refillThreshold: number;
  takenToday: boolean;
  notes?: string;
}

export interface DigitalWellbeingStats {
  screenTimeMinutes: number;
  pickups: number;
  notificationsReceived: number;
  focusScore: number; // 0-100
  addictionRisk: 'Low' | 'Moderate' | 'High';
  appBreakdown: {
    appName: string;
    category: 'Work' | 'Social' | 'Gaming' | 'Education' | 'Entertainment';
    timeMinutes: number;
    color: string;
  }[];
  activeBlocker: boolean;
}

export interface SleepLog {
  id: string;
  date: string;
  totalHours: number;
  sleepScore: number;
  deepSleepPercent: number;
  remSleepPercent: number;
  lightSleepPercent: number;
  sleepDebtHours: number;
  bedtime: string;
  wakeTime: string;
  efficiencyPercent: number;
}

export interface MentalWellnessLog {
  id: string;
  date: string;
  mood: 'Ecstatic' | 'Calm' | 'Neutral' | 'Anxious' | 'Stressed' | 'Exhausted';
  moodRating: number; // 1-10
  stressLevel: number; // 1-10
  burnoutRisk: 'Low' | 'Moderate' | 'High';
  journalEntry: string;
  gratitudeText: string;
}

export interface MealLog {
  id: string;
  name: string;
  time: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  imageUrl?: string;
  healthScore: number;
  healthierAlternatives?: string[];
}

export interface FitnessSession {
  id: string;
  title: string;
  type: 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Walking' | 'Stretch';
  durationMinutes: number;
  caloriesBurned: number;
  date: string;
  completed: boolean;
}

export interface WearableDevice {
  id: string;
  name: string;
  brand: 'Apple Health' | 'Google Health Connect' | 'Fitbit' | 'Garmin' | 'Samsung Health';
  connected: boolean;
  lastSync: string;
  batteryLevel: number;
  syncMetrics: {
    steps: number;
    heartRateBpm: number;
    restingHeartRate: number;
    bloodOxygenSpO2: number;
    bodyTempC: number;
  };
}

export interface DoctorAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  type: 'In-Person' | 'Telemedicine Video';
  rating: number;
  avatarUrl: string;
  location: string;
  notes?: string;
}

export interface DiseaseRiskPrediction {
  condition: string;
  riskPercentage: number;
  riskLevel: 'Low' | 'Moderate' | 'Elevated' | 'High';
  primaryDrivers: string[];
  preventivePlan: string[];
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  event: string;
  category: 'Security' | 'AI Execution' | 'Data Sync' | 'System';
  status: 'Success' | 'Warning' | 'Error';
  details: string;
}

export type IncidentPriority = 'Low' | 'Moderate' | 'High' | 'Critical';

export type IncidentStatus =
  | 'Reported'
  | 'Acknowledged'
  | 'Dispatch Pending'
  | 'Dispatched'
  | 'Contacted'
  | 'Escalated'
  | 'Under Investigation'
  | 'Resolved'
  | 'Closed';

export type UserRole = 'USER' | 'ADMIN' | 'HOSPITAL' | 'AUTHORITY' | 'INVESTIGATOR' | 'REVIEWER';

export interface IncidentChecklistItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  responsibleRole: UserRole;
  completedBy?: string;
  completedAt?: string;
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  action: string;
  role: UserRole;
  user: string;
  description: string;
}

export interface IncidentComment {
  id: string;
  author: string;
  role: UserRole;
  timestamp: string;
  message: string;
}

export interface IncidentResponseBrief {
  id: string;
  incidentId: string;
  generatedAt: string;
  generatedBy: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  summary: string;
  patientInfo: string;
  locationNotes: string;
  timelineSummary: string;
  assignedResources: string;
  completedActions: string[];
  pendingActions: string[];
  aiRecommendations: string[];
  resolutionStatus: string;
  nextStep: string;
}

export interface IncidentAuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  incidentId: string;
  description: string;
}

export interface Incident {
  id: string;
  patientName: string;
  patientId?: string;
  incidentType: string;
  priority: IncidentPriority;
  location: string;
  description: string;
  reportedBy: string;
  emergencyContact: string;
  assignedHospital: string;
  assignedAuthority: string;
  assignedInvestigator?: string;
  assignedReviewer?: string;
  status: IncidentStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  checklist: IncidentChecklistItem[];
  timeline: IncidentTimelineEvent[];
  comments: IncidentComment[];
  brief?: IncidentResponseBrief;
}
