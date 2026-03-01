export interface ScenarioProgress {
  scenarioId: string;
  completedSituations: number;
  totalSituations: number;
  completed: boolean;
  lastCompleted?: string;
}

const SITUATIONS_PER_SCENARIO: Record<string, number> = {
  'gender-bias': 5,
  'racial-microaggressions': 5,
  'misgendering': 4
};

export function getProgress(): ScenarioProgress[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('ally-coach-progress');
  return data ? JSON.parse(data) : [];
}

export function markSituationComplete(scenarioId: string) {
  const progress = getProgress();
  const existing = progress.find(p => p.scenarioId === scenarioId);
  const totalSituations = SITUATIONS_PER_SCENARIO[scenarioId] || 5;
  
  if (existing) {
    existing.completedSituations += 1;
    if (existing.completedSituations >= totalSituations) {
      existing.completed = true;
      existing.lastCompleted = new Date().toISOString();
    }
  } else {
    progress.push({
      scenarioId,
      completedSituations: 1,
      totalSituations,
      completed: 1 >= totalSituations,
      lastCompleted: 1 >= totalSituations ? new Date().toISOString() : undefined
    });
  }
  
  localStorage.setItem('ally-coach-progress', JSON.stringify(progress));
}

export function getScenarioProgress(scenarioId: string): ScenarioProgress | null {
  const progress = getProgress();
  return progress.find(p => p.scenarioId === scenarioId) || null;
}

export function getCompletedCount(): number {
  return getProgress().filter(p => p.completed).length;
}

export function getNextSituationIndex(scenarioId: string): number {
  const prog = getScenarioProgress(scenarioId);
  return prog ? prog.completedSituations : 0;
}
