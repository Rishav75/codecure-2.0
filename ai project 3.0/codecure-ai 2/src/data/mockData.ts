import {
  UserProfile,
  CompositeHealthScores,
  Medication,
  DigitalWellbeingStats,
  SleepLog,
  MentalWellnessLog,
  MealLog,
  FitnessSession,
  WearableDevice,
  DoctorAppointment,
  DiseaseRiskPrediction,
  CommunityPost,
  GamificationState,
  MedicalScanReport,
  SystemAuditLog,
} from '../types';

export const initialUserProfile: UserProfile = {
  id: 'usr_codecure_77',
  name: 'Alex Mercer',
  email: 'alex.mercer@health.ai',
  age: 32,
  gender: 'Male',
  bloodType: 'O+',
  heightCm: 178,
  weightKg: 74,
  allergies: ['Penicillin', 'Peanuts (Mild)'],
  chronicConditions: ['Mild Seasonal Asthma', 'Prehypertension Risk'],
  medicationsCount: 3,
  emergencyContact: {
    name: 'Sarah Mercer',
    relationship: 'Spouse',
    phone: '+1 (555) 382-9102',
  },
  insurance: {
    provider: 'Aetna Health Gold Premier',
    policyNumber: 'AET-99482710',
    groupNumber: 'GRP-00281',
  },
  familyHistory: ['Type 2 Diabetes (Maternal Grandfather)', 'Hypertension (Father)'],
  lifestyle: {
    smoking: 'Non-smoker',
    alcohol: 'Occasional',
    activityLevel: 'Moderately Active',
    dietPreference: 'Balanced',
  },
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
};

export const initialHealthScores: CompositeHealthScores = {
  overallHealthScore: 88,
  stressScore: 32,
  fitnessScore: 84,
  sleepScore: 91,
  digitalWellbeingScore: 78,
  nutritionScore: 86,
  trend: 'improving',
};

export const initialMedications: Medication[] = [
  {
    id: 'med-1',
    name: 'Atorvastatin',
    dosage: '10 mg',
    frequency: 'Once Daily at Bedtime',
    times: ['21:00'],
    pillsRemaining: 24,
    totalPills: 30,
    category: 'Cardiovascular',
    refillThreshold: 7,
    takenToday: true,
    notes: 'Take with water after dinner.',
  },
  {
    id: 'med-2',
    name: 'Vitamin D3 + K2',
    dosage: '5000 IU',
    frequency: 'Once Daily with Morning Meal',
    times: ['08:00'],
    pillsRemaining: 45,
    totalPills: 60,
    category: 'Supplements',
    refillThreshold: 10,
    takenToday: true,
    notes: 'Fat soluble, take with dietary fats.',
  },
  {
    id: 'med-3',
    name: 'Albuterol Inhaler',
    dosage: '90 mcg/actuation',
    frequency: 'As Needed (PRN)',
    times: ['12:00'],
    pillsRemaining: 180,
    totalPills: 200,
    category: 'Respiratory',
    refillThreshold: 30,
    takenToday: false,
    notes: 'Inhale 2 puffs prior to intense endurance cardio if wheezing.',
  },
];

export const initialDigitalWellbeing: DigitalWellbeingStats = {
  screenTimeMinutes: 215, // 3h 35m
  pickups: 42,
  notificationsReceived: 118,
  focusScore: 82,
  addictionRisk: 'Low',
  appBreakdown: [
    { appName: 'Code Editor & IDE', category: 'Work', timeMinutes: 110, color: '#3b82f6' },
    { appName: 'Slack & Teams', category: 'Work', timeMinutes: 45, color: '#06b6d4' },
    { appName: 'Twitter / X', category: 'Social', timeMinutes: 30, color: '#f59e0b' },
    { appName: 'YouTube Health', category: 'Education', timeMinutes: 20, color: '#10b981' },
    { appName: 'Casual Games', category: 'Gaming', timeMinutes: 10, color: '#ec4899' },
  ],
  activeBlocker: false,
};

export const initialSleepLogs: SleepLog[] = [
  { id: 'sl-1', date: 'Today', totalHours: 7.8, sleepScore: 91, deepSleepPercent: 24, remSleepPercent: 22, lightSleepPercent: 54, sleepDebtHours: 0.2, bedtime: '22:45', wakeTime: '06:33', efficiencyPercent: 94 },
  { id: 'sl-2', date: 'Yesterday', totalHours: 7.2, sleepScore: 86, deepSleepPercent: 20, remSleepPercent: 21, lightSleepPercent: 59, sleepDebtHours: 0.8, bedtime: '23:15', wakeTime: '06:27', efficiencyPercent: 91 },
  { id: 'sl-3', date: '2 days ago', totalHours: 8.1, sleepScore: 94, deepSleepPercent: 26, remSleepPercent: 24, lightSleepPercent: 50, sleepDebtHours: 0.0, bedtime: '22:30', wakeTime: '06:36', efficiencyPercent: 96 },
];

export const initialMentalLogs: MentalWellnessLog[] = [
  { id: 'mw-1', date: 'Today', mood: 'Calm', moodRating: 8, stressLevel: 3, burnoutRisk: 'Low', journalEntry: 'Had a productive morning focus session. Completed 4 Pomodoros with zero distractions.', gratitudeText: 'Grateful for refreshing morning sunlight and good espresso.' },
  { id: 'mw-2', date: 'Yesterday', mood: 'Ecstatic', moodRating: 9, stressLevel: 2, burnoutRisk: 'Low', journalEntry: 'Completed a 5k trail run and achieved new VO2 Max milestone.', gratitudeText: 'Grateful for strong supportive team members.' },
];

export const initialMealLogs: MealLog[] = [
  { id: 'm-1', name: 'Avocado Toast with Poached Eggs & Hemp Seeds', time: '08:30 AM', calories: 420, proteinGrams: 22, carbsGrams: 34, fatsGrams: 22, healthScore: 94, healthierAlternatives: ['Switch to sprouted sourdough for higher fiber content'] },
  { id: 'm-2', name: 'Grilled Wild Salmon Quinoa Buddha Bowl', time: '01:15 PM', calories: 610, proteinGrams: 42, carbsGrams: 52, fatsGrams: 24, healthScore: 96, healthierAlternatives: ['Add extra leafy kale for folate boosting'] },
  { id: 'm-3', name: 'Greek Yogurt with Blueberries & Chia Seeds', time: '05:00 PM', calories: 210, proteinGrams: 18, carbsGrams: 22, fatsGrams: 5, healthScore: 98 },
];

export const initialFitnessSessions: FitnessSession[] = [
  { id: 'fit-1', title: 'Morning Zone 2 Cardio Run', type: 'Cardio', durationMinutes: 35, caloriesBurned: 380, date: 'Today', completed: true },
  { id: 'fit-2', title: 'Core Strength & Posterior Chain Stability', type: 'Strength', durationMinutes: 45, caloriesBurned: 310, date: 'Today', completed: true },
  { id: 'fit-3', title: 'Evening Diaphragmatic Decompression Stretch', type: 'Stretch', durationMinutes: 15, caloriesBurned: 60, date: 'Scheduled 08:30 PM', completed: false },
];

export const initialWearables: WearableDevice[] = [
  { id: 'w-1', name: 'Apple Watch Ultra 2', brand: 'Apple Health', connected: true, lastSync: '1 minute ago', batteryLevel: 88, syncMetrics: { steps: 8420, heartRateBpm: 64, restingHeartRate: 56, bloodOxygenSpO2: 99, bodyTempC: 36.6 } },
  { id: 'w-2', name: 'Garmin Forerunner 965', brand: 'Garmin', connected: true, lastSync: '12 minutes ago', batteryLevel: 74, syncMetrics: { steps: 8420, heartRateBpm: 63, restingHeartRate: 55, bloodOxygenSpO2: 98, bodyTempC: 36.5 } },
  { id: 'w-3', name: 'Oura Ring Gen 3', brand: 'Fitbit', connected: false, lastSync: '3 hours ago', batteryLevel: 42, syncMetrics: { steps: 7200, heartRateBpm: 68, restingHeartRate: 58, bloodOxygenSpO2: 98, bodyTempC: 36.7 } },
];

export const initialDoctors: DoctorAppointment[] = [
  { id: 'doc-1', doctorName: 'Dr. Evelyn Vance, MD', specialty: 'Preventive Cardiology', clinicName: 'Johns Hopkins Medical Center', date: 'Tomorrow, Aug 9', time: '10:30 AM', status: 'Upcoming', type: 'Telemedicine Video', rating: 4.9, avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250', location: 'Telehealth Room 4B', notes: 'Routine annual cardiovascular review & Lipid panel discussion.' },
  { id: 'doc-2', doctorName: 'Dr. Marcus Thorne, DO', specialty: 'Neurology & Sleep Medicine', clinicName: 'Stanford Center for Human Performance', date: 'Aug 18, 2026', time: '02:00 PM', status: 'Upcoming', type: 'In-Person', rating: 4.95, avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250', location: 'Palo Alto Medical Center Suite 302' },
];

export const initialScans: MedicalScanReport[] = [
  {
    id: 'scan-101',
    title: 'Comprehensive Metabolic & Lipid Panel',
    date: 'Aug 02, 2026',
    documentType: 'Blood Test Lab Report',
    summary: 'Metabolic markers in optimal target zones. High Density Lipoprotein (HDL) elevated positively. Fasting glucose ideal.',
    extractedMetrics: [
      { name: 'Fasting Blood Glucose', value: '88 mg/dL', normalRange: '70 - 99 mg/dL', status: 'Normal', significance: 'Optimal insulin sensitivity' },
      { name: 'Total Cholesterol', value: '182 mg/dL', normalRange: '125 - 200 mg/dL', status: 'Normal', significance: 'Cardiovascular risk low' },
      { name: 'HDL Cholesterol', value: '68 mg/dL', normalRange: '> 50 mg/dL', status: 'Normal', significance: 'Protective lipid carrier' },
      { name: 'Triglycerides', value: '92 mg/dL', normalRange: '< 150 mg/dL', status: 'Normal', significance: 'Good metabolic efficiency' },
      { name: 'hs-CRP (Inflammation)', value: '0.6 mg/L', normalRange: '< 1.0 mg/L', status: 'Normal', significance: 'Low systemic vascular inflammation' },
    ],
    medicalGlossary: [
      { term: 'hs-CRP', definition: 'High-sensitivity C-reactive protein, a biomarker measuring low-grade arterial inflammation.' },
      { term: 'HDL', definition: 'High-Density Lipoprotein, known as good cholesterol which helps clear excess lipid plaque.' },
    ],
    keyRecommendations: ['Maintain current Mediterranean diet framework', 'Continue 150 minutes of weekly Zone 2 aerobic cardio'],
    questionsForDoctor: ['Should we re-test ApoB levels in 6 months?'],
  },
];

export const initialDiseaseRisks: DiseaseRiskPrediction[] = [
  { condition: 'Heart Disease (Atherosclerosis)', riskPercentage: 8, riskLevel: 'Low', primaryDrivers: ['Family history of hypertension', 'Optimal lipid ratio'], preventivePlan: ['Maintain daily potassium & fiber intake', 'Zone 2 cardio 3x weekly'] },
  { condition: 'Type 2 Diabetes', riskPercentage: 6, riskLevel: 'Low', primaryDrivers: ['A1c = 5.2%', 'Lean body composition'], preventivePlan: ['Post-meal 10-minute walks', 'Limit added refined sugars'] },
  { condition: 'Hypertension', riskPercentage: 18, riskLevel: 'Moderate', primaryDrivers: ['Workplace stress spikes', 'Moderate sodium intake'], preventivePlan: ['Box breathing prior to high-stakes meetings', 'DASH diet principles'] },
  { condition: 'Occupational Burnout', riskPercentage: 22, riskLevel: 'Moderate', primaryDrivers: ['High late-night screen pickups', 'Tight project deadlines'], preventivePlan: ['Enforce 9:00 PM digital curfew', 'Use focus mode blockers'] },
  { condition: 'Sleep Apnea / Disorders', riskPercentage: 4, riskLevel: 'Low', primaryDrivers: ['Normal BMI', 'Consistently high sleep efficiency'], preventivePlan: ['Avoid heavy meals within 3h of bedtime'] },
];

export const initialCommunityPosts: CommunityPost[] = [
  { id: 'post-1', authorAlias: 'BioHacker_Jane', groupCategory: 'Digital Detox', title: 'How cutting screen pickups by 50% restored my HRV and sleep debt', content: 'For the last 14 days, I enforced the CODECURE focus mode blocker after 8 PM. My deep sleep jumped from 14% to 26%!', likes: 48, commentsCount: 12, createdAt: '2 hours ago', isAnonymous: true },
  { id: 'post-2', authorAlias: 'ZenRunner', groupCategory: 'Heart Health', title: 'Zone 2 running transformed my resting heart rate from 72 to 54 bpm in 3 months', content: 'Consistency over intensity. Staying under my aerobic threshold kept my recovery score high every single morning.', likes: 82, commentsCount: 19, createdAt: '5 hours ago', isAnonymous: false },
];

export const initialGamification: GamificationState = {
  xp: 3450,
  level: 7,
  coins: 480,
  streakDays: 12,
  badges: [
    { id: 'b-1', title: '7-Day Sleep Warrior', description: 'Maintained 85%+ sleep score for 7 consecutive nights', icon: 'Moon', unlocked: true, unlockedAt: '2 days ago' },
    { id: 'b-2', title: 'Digital Detox Master', description: 'Completed 10 Pomodoro focus sessions with zero app interruptions', icon: 'ShieldCheck', unlocked: true, unlockedAt: 'Yesterday' },
    { id: 'b-3', title: 'Hydration Hero', description: 'Logged 2.5L water daily for 14 straight days', icon: 'Droplets', unlocked: true, unlockedAt: '3 days ago' },
    { id: 'b-4', title: 'AI Scan Pioneer', description: 'Scanned and parsed 3 medical lab reports with AI OCR', icon: 'FileText', unlocked: true, unlockedAt: '4 days ago' },
    { id: 'b-5', title: 'Heart Guardian', description: 'Completed 100% of weekly cardiovascular fitness workouts', icon: 'Heart', unlocked: false },
  ],
  dailyMissions: [
    { id: 'm-1', title: 'Complete 1 Guided Diaphragmatic Breathing Session', xpReward: 100, coinReward: 25, completed: true },
    { id: 'm-2', title: 'Log 8,000 Steps or 30 Mins Active Cardio', xpReward: 150, coinReward: 40, completed: true },
    { id: 'm-3', title: 'Scan or Record Daily Meal Nutrition with AI', xpReward: 120, coinReward: 30, completed: false },
    { id: 'm-4', title: 'Check Medication Intake Reminder', xpReward: 80, coinReward: 20, completed: true },
  ],
};

export const initialAuditLogs: SystemAuditLog[] = [
  { id: 'log-1', timestamp: '2026-08-07 22:15:02', event: 'Biometric Telemetry Sync', category: 'Data Sync', status: 'Success', details: 'Apple Health + Garmin telemetry merged cleanly.' },
  { id: 'log-2', timestamp: '2026-08-07 21:40:19', event: 'AI Medical Vision OCR Invocation', category: 'AI Execution', status: 'Success', details: 'Processed blood lab report in 840ms with 99.2% accuracy.' },
  { id: 'log-3', timestamp: '2026-08-07 19:30:00', event: 'HIPAA & GDPR Encryption Audit', category: 'Security', status: 'Success', details: 'All user data encrypted at rest (AES-256) and in transit (TLS 1.3).' },
];

export const MOCK_USER_PROFILE = initialUserProfile;
export const MOCK_MEDICATIONS = initialMedications;
export const MOCK_COMMUNITY_POSTS = initialCommunityPosts;
export const MOCK_DOCTORS = initialDoctors;
export const MOCK_SCANS = initialScans;
export const MOCK_FITNESS_SESSIONS = initialFitnessSessions;
export const MOCK_MEAL_LOGS = initialMealLogs;
export const MOCK_SLEEP_LOGS = initialSleepLogs;
export const MOCK_DIGITAL_WELLBEING = initialDigitalWellbeing;
export const MOCK_GAMIFICATION = initialGamification;
export const MOCK_MENTAL_LOGS = initialMentalLogs;
export const MOCK_WEARABLES = initialWearables;
export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Medication Intake Scheduled',
    message: 'Time for Atorvastatin (20mg) with water.',
    timestamp: '10 mins ago',
    read: false,
    type: 'medication' as const,
  },
  {
    id: 'notif-2',
    title: 'Sleep Target Met',
    message: 'Congratulations! You achieved 7h 48m with 24% deep sleep.',
    timestamp: '1 hour ago',
    read: false,
    type: 'sleep' as const,
  },
  {
    id: 'notif-3',
    title: 'Lab Report OCR Ready',
    message: 'Your Lipid Panel summary has been analyzed.',
    timestamp: '3 hours ago',
    read: true,
    type: 'system' as const,
  },
];

