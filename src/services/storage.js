const KEYS = {
  PROFESSORES: 'fafire_professores',
  CURSOS: 'fafire_cursos',
  DEPARTAMENTOS: 'fafire_departamentos',
  ALLOCATIONS: 'fafire_allocations',
};

const INITIAL_PROFESSORES = [
  { id: 1, nome: 'Alan Turing', email: 'turing@fafire.edu.br' },
  { id: 2, nome: 'Ada Lovelace', email: 'ada@fafire.edu.br' },
  { id: 3, nome: 'Grace Hopper', email: 'hopper@fafire.edu.br' },
  { id: 4, nome: 'Margaret Hamilton', email: 'margaret@fafire.edu.br' },
];

const INITIAL_CURSOS = [
  { id: 1, nome: 'Análise e Desenvolvimento de Sistemas' },
  { id: 2, nome: 'Ciência da Computação' },
  { id: 3, nome: 'Engenharia de Software' },
  { id: 4, nome: 'Sistemas de Informação' },
];

const INITIAL_DEPARTAMENTOS = [
  { id: 1, nome: 'Departamento de Computação e Tecnologia' },
  { id: 2, nome: 'Departamento de Engenharia' },
  { id: 3, nome: 'Departamento de Ciências Exatas' },
];

const INITIAL_ALLOCATIONS = [
  { id: 1, professorId: 1, cursoId: 1, departamentoId: 1 },
  { id: 2, professorId: 2, cursoId: 2, departamentoId: 1 },
  { id: 3, professorId: 3, cursoId: 3, departamentoId: 2 },
  { id: 4, professorId: 4, cursoId: 4, departamentoId: 3 },
];

// Helper to initialize data if empty
const getOrInit = (key, initialData) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
};

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Generic CRUD operations helper
export const storage = {
  // Professores
  getProfessores: () => getOrInit(KEYS.PROFESSORES, INITIAL_PROFESSORES),
  saveProfessores: (items) => saveData(KEYS.PROFESSORES, items),

  // Cursos
  getCursos: () => getOrInit(KEYS.CURSOS, INITIAL_CURSOS),
  saveCursos: (items) => saveData(KEYS.CURSOS, items),

  // Departamentos
  getDepartamentos: () => getOrInit(KEYS.DEPARTAMENTOS, INITIAL_DEPARTAMENTOS),
  saveDepartamentos: (items) => saveData(KEYS.DEPARTAMENTOS, items),

  // Allocations
  getAllocations: () => getOrInit(KEYS.ALLOCATIONS, INITIAL_ALLOCATIONS),
  saveAllocations: (items) => saveData(KEYS.ALLOCATIONS, items),
};
