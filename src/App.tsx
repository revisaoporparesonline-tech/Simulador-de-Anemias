import { useState } from 'react';
import { CLINICAL_CASES } from './data/cases';
import { CaseSimulator } from './components/CaseSimulator';
import { FreeWorkbench } from './components/FreeWorkbench';
import { GroupDynamic } from './components/GroupDynamic';
import { SpeciesGuide } from './components/SpeciesGuide';

type WorkspaceTab = 'casos' | 'bancada' | 'dinamica' | 'guia';

const NAV_ITEMS: Array<{ id: WorkspaceTab; label: string }> = [
  { id: 'casos', label: 'Casos Clínicos' },
  { id: 'bancada', label: 'Bancada Livre' },
  { id: 'dinamica', label: 'Dinâmica em Grupo' },
  { id: 'guia', label: 'Guia de Espécies' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('casos');
  const [activeCaseId, setActiveCaseId] = useState<string>(CLINICAL_CASES[0].id);
  const [completedCases, setCompletedCases] = useState<
    Record<string, { score: number; total: number }>
  >({});

  const handleRecordResult = (caseId: string, score: number, total: number) => {
    setCompletedCases((prev) => ({
      ...prev,
      [caseId]: { score, total },
    }));
  };

  const handleRandomNewCase = () => {
    const unsolved = CLINICAL_CASES.filter(
      (c) => c.id !== activeCaseId && !completedCases[c.id]
    );
    const pool =
      unsolved.length > 0
        ? unsolved
        : CLINICAL_CASES.filter((c) => c.id !== activeCaseId);
    const next = pool[Math.floor(Math.random() * pool.length)] ?? CLINICAL_CASES[0];
    setActiveCaseId(next.id);
    setActiveTab('casos');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FB] text-slate-900">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('casos')}
            className="text-lg font-bold tracking-tight text-slate-900 hover:text-rose-700 transition-colors whitespace-nowrap shrink-0"
          >
            HemoVet
          </button>

          {/* Zone 2: 4 Clean Single-Line Text Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-7 text-sm font-medium"
            aria-label="Navegação principal"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'border-rose-700 text-slate-900 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleRandomNewCase}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Novo Caso
            </button>
          </div>
        </div>

        {/* Mobile navigation row */}
        <nav
          className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center gap-5 overflow-x-auto text-xs font-medium"
          aria-label="Navegação mobile"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`py-1 border-b-2 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-rose-700 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'casos' && (
          <CaseSimulator
            activeCaseId={activeCaseId}
            onSelectCase={setActiveCaseId}
            completedCases={completedCases}
            onRecordResult={handleRecordResult}
          />
        )}

        {activeTab === 'bancada' && <FreeWorkbench />}

        {activeTab === 'dinamica' && <GroupDynamic />}

        {activeTab === 'guia' && <SpeciesGuide />}
      </main>

      {/* Quiet Clinical Footer */}
      <footer className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            Patricia Oliveira da Silva e Jéssica Araujo -Patologia Clíncica - ULBRA 2026 - Simulador educacional de hematologia veterinária (Caninos, Felinos, Equinos e Bovinos)
          </span>
          <span>
            Uso exclusivo para ensino e dinâmicas de estudo — não substitui avaliação clínica laboratorial.
          </span>
        </div>
      </footer>
    </div>
  );
}
