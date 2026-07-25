export function formatDate(date: string | Date | null): string {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatScore(score: number | null): string {
  if (score === null || score === undefined) return '-'
  return score.toFixed(2)
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStepStatus(
  currentStep: number,
  stepId: number,
): 'completed' | 'current' | 'upcoming' {
  if (stepId < currentStep) return 'completed'
  if (stepId === currentStep) return 'current'
  return 'upcoming'
}
