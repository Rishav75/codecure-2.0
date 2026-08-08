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

import {
  initialUserProfile,
  initialHealthScores,
  initialMedications,
  initialDigitalWellbeing,
  initialSleepLogs,
  initialMentalLogs,
  initialMealLogs,
  initialFitnessSessions,
  initialWearables,
  initialDoctors,
  initialScans,
  initialDiseaseRisks,
  initialCommunityPosts,
  initialGamification,
  initialAuditLogs,
} from '../data/mockData';

const STORAGE_KEYS = {
  PROFILE: 'codecure_user_profile_v1',
  SCORES: 'codecure_health_scores_v1',
  MEDICATIONS: 'codecure_medications_v1',
  DIGITAL: 'codecure_digital_wellbeing_v1',
  SLEEP: 'codecure_sleep_logs_v1',
  MENTAL: 'codecure_mental_logs_v1',
  MEALS: 'codecure_meal_logs_v1',
  FITNESS: 'codecure_fitness_sessions_v1',
  WEARABLES: 'codecure_wearables_v1',
  DOCTORS: 'codecure_doctors_v1',
  SCANS: 'codecure_medical_scans_v1',
  RISKS: 'codecure_disease_risks_v1',
  COMMUNITY: 'codecure_community_posts_v1',
  GAMIFICATION: 'codecure_gamification_v1',
  LOGS: 'codecure_audit_logs_v1',
};

export function loadStoredData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw === 'undefined' || raw === 'null') return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (e) {
    console.error(`Error loading key ${key} from storage:`, e);
    return fallback;
  }
}

export const getStorageData = loadStoredData;

export function saveStoredData<T>(key: string, data: T): void {
  try {
    if (data === undefined) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving key ${key} to storage:`, e);
  }
}

export const saveStorageData = saveStoredData;

export function getInitialState() {
  return {
    profile: loadStoredData<UserProfile>(STORAGE_KEYS.PROFILE, initialUserProfile),
    scores: loadStoredData<CompositeHealthScores>(STORAGE_KEYS.SCORES, initialHealthScores),
    medications: loadStoredData<Medication[]>(STORAGE_KEYS.MEDICATIONS, initialMedications),
    digital: loadStoredData<DigitalWellbeingStats>(STORAGE_KEYS.DIGITAL, initialDigitalWellbeing),
    sleepLogs: loadStoredData<SleepLog[]>(STORAGE_KEYS.SLEEP, initialSleepLogs),
    mentalLogs: loadStoredData<MentalWellnessLog[]>(STORAGE_KEYS.MENTAL, initialMentalLogs),
    mealLogs: loadStoredData<MealLog[]>(STORAGE_KEYS.MEALS, initialMealLogs),
    fitnessSessions: loadStoredData<FitnessSession[]>(STORAGE_KEYS.FITNESS, initialFitnessSessions),
    wearables: loadStoredData<WearableDevice[]>(STORAGE_KEYS.WEARABLES, initialWearables),
    doctors: loadStoredData<DoctorAppointment[]>(STORAGE_KEYS.DOCTORS, initialDoctors),
    scans: loadStoredData<MedicalScanReport[]>(STORAGE_KEYS.SCANS, initialScans),
    diseaseRisks: loadStoredData<DiseaseRiskPrediction[]>(STORAGE_KEYS.RISKS, initialDiseaseRisks),
    posts: loadStoredData<CommunityPost[]>(STORAGE_KEYS.COMMUNITY, initialCommunityPosts),
    gamification: loadStoredData<GamificationState>(STORAGE_KEYS.GAMIFICATION, initialGamification),
    auditLogs: loadStoredData<SystemAuditLog[]>(STORAGE_KEYS.LOGS, initialAuditLogs),
  };
}

export { STORAGE_KEYS };
