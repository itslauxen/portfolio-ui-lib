// Início da carreira: setembro/2022. Os "X anos de experiência" exibidos
// no site são anos completos desde essa data — sobem sozinhos a cada setembro.
const CAREER_START = { year: 2022, month: 8 }; // mês 0-based: 8 = setembro

export function yearsOfExperience(now = new Date()): number {
  let years = now.getFullYear() - CAREER_START.year;
  if (now.getMonth() < CAREER_START.month) years -= 1;
  return years;
}

// Rótulo exibido no site ("3+ anos" / "3+ years"), alinhado ao currículo.
// Conta só experiência profissional comprovável pelas datas do histórico.
export function experienceLabel(): string {
  return "3+";
}
