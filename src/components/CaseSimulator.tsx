import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { CaseDifficulty, CLINICAL_CASES, ClinicalCase, DIFFICULTY_LABELS } from '../data/cases';
import {
  CHCM_LABELS,
  ChcmClassification,
  MECHANISM_LABELS,
  MechanismClassification,
  REGENERATION_LABELS,
  RegenerationClassification,
  SPECIES_LIST,
  SPECIES_PROFILES,
  SpeciesId,
  VCM_LABELS,
  VcmClassification,
} from '../data/species';
import { BloodSmearViewer } from './BloodSmearViewer';
import { CbcTable } from './CbcTable';
import { SpeciesPortrait } from './SpeciesPortrait';
import { WintrobeChart } from './WintrobeChart';

interface CaseSimulatorProps {
  activeCaseId: string;
  onSelectCase: (caseId: string) => void;
  completedCases: Record<string, { score: number; total: number }>;
  onRecordResult: (caseId: string, score: number, total: number) => void;
}

interface AnswerState {
  vcm: VcmClassification | null;
  chcm: ChcmClassification | null;
  regeneration: RegenerationClassification | null;
  mechanism: MechanismClassification | null;
}

const EMPTY_ANSWERS: AnswerState = {
  vcm: null,
  chcm: null,
  regeneration: null,
  mechanism: null,
};

export const CaseSimulator: React.FC<CaseSimulatorProps> = ({
  activeCaseId,
  onSelectCase,
  completedCases,
  onRecordResult,
}) => {
  const [speciesFilter, setSpeciesFilter] = useState<'todas' | SpeciesId>('todas');
  const [difficultyFilter, setDifficultyFilter] = useState<'todas' | CaseDifficulty>('todas');
  const [manualCalcMode, setManualCalcMode] = useState(false);
  const [answers, setAnswers] = useState<AnswerState>(EMPTY_ANSWERS);
  const [submitted, setSubmitted] = useState(false);
  const [hintsShown, setHintsShown] = useState(0);

  useEffect(() => {
    setAnswers(EMPTY_ANSWERS);
    setSubmitted(false);
    setHintsShown(0);
    const chosen = CLINICAL_CASES.find((c) => c.id === activeCaseId);
    if (chosen) {
      setSpeciesFilter((prev) => (prev !== 'todas' && prev !== chosen.species ? 'todas' : prev));
      setDifficultyFilter((prev) =>
        prev !== 'todas' && prev !== chosen.difficulty ? 'todas' : prev
      );
    }
  }, [activeCaseId]);

  const filteredCases = useMemo(() => {
    return CLINICAL_CASES.filter((c) => {
      if (speciesFilter !== 'todas' && c.species !== speciesFilter) return false;
      if (difficultyFilter !== 'todas' && c.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [speciesFilter, difficultyFilter]);

  const activeCase: ClinicalCase = useMemo(() => {
    const exact = filteredCases.find((c) => c.id === activeCaseId);
    if (exact) return exact;
    return filteredCases[0] ?? CLINICAL_CASES[0];
  }, [filteredCases, activeCaseId]);

  const currentIdx = filteredCases.findIndex((c) => c.id === activeCase.id);
  const sp = SPECIES_PROFILES[activeCase.species];

  const switchToCase = (nextId: string) => {
    onSelectCase(nextId);
    setAnswers(EMPTY_ANSWERS);
    setSubmitted(false);
    setHintsShown(0);
  };

  const handleFilterSpecies = (next: 'todas' | SpeciesId) => {
    setSpeciesFilter(next);
    const matching = CLINICAL_CASES.filter(
      (c) =>
        (next === 'todas' || c.species === next) &&
        (difficultyFilter === 'todas' || c.difficulty === difficultyFilter)
    );
    if (matching.length > 0 && !matching.some((c) => c.id === activeCaseId)) {
      switchToCase(matching[0].id);
    }
  };

  const handleFilterDifficulty = (next: 'todas' | CaseDifficulty) => {
    setDifficultyFilter(next);
    const matching = CLINICAL_CASES.filter(
      (c) =>
        (speciesFilter === 'todas' || c.species === speciesFilter) &&
        (next === 'todas' || c.difficulty === next)
    );
    if (matching.length > 0 && !matching.some((c) => c.id === activeCaseId)) {
      switchToCase(matching[0].id);
    }
  };

  const canSubmit =
    answers.vcm !== null &&
    answers.chcm !== null &&
    answers.regeneration !== null &&
    answers.mechanism !== null;

  const axisResults = {
    vcm: answers.vcm === activeCase.solution.vcm,
    chcm: answers.chcm === activeCase.solution.chcm,
    regeneration: answers.regeneration === activeCase.solution.regeneration,
    mechanism: answers.mechanism === activeCase.solution.mechanism,
  };

  const score =
    (axisResults.vcm ? 1 : 0) +
    (axisResults.chcm ? 1 : 0) +
    (axisResults.regeneration ? 1 : 0) +
    (axisResults.mechanism ? 1 : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
    onRecordResult(activeCase.id, score, 4);
  };

  const handleResetAttempt = () => {
    setAnswers(EMPTY_ANSWERS);
    setSubmitted(false);
    setHintsShown(0);
  };

  const handlePrev = () => {
    if (filteredCases.length <= 1) return;
    const prevIdx = (currentIdx - 1 + filteredCases.length) % filteredCases.length;
    switchToCase(filteredCases[prevIdx].id);
  };

  const handleNext = () => {
    if (filteredCases.length <= 1) return;
    const nextIdx = (currentIdx + 1) % filteredCases.length;
    switchToCase(filteredCases[nextIdx].id);
  };

  const totalCompleted = Object.keys(completedCases).length;
  const perfectCount = Object.values(completedCases).filter((r) => r.score === r.total).length;

  return (
    <div className="space-y-6">
      {/* Workspace Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          {/* Species segmented filter */}
          <div
            className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 overflow-x-auto"
            role="group"
            aria-label="Filtrar casos por espécie"
          >
            <button
              type="button"
              onClick={() => handleFilterSpecies('todas')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                speciesFilter === 'todas'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({CLINICAL_CASES.length})
            </button>
            {SPECIES_LIST.map((spId) => (
              <button
                key={spId}
                type="button"
                onClick={() => handleFilterSpecies(spId)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  speciesFilter === spId
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {SPECIES_PROFILES[spId].plural}
              </button>
            ))}
          </div>

          {/* Difficulty segmented filter */}
          <div
            className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200"
            role="group"
            aria-label="Filtrar por nível de dificuldade"
          >
            {(['todas', 'basico', 'intermediario', 'avancado'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => handleFilterDifficulty(level)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  difficultyFilter === level
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {level === 'todas' ? 'Todos os níveis' : DIFFICULTY_LABELS[level]}
              </button>
            ))}
          </div>
        </div>

        {/* Clean unboxed progress metadata + Case navigation */}
        <div className="flex items-center justify-between lg:justify-end gap-4">
          <div className="text-xs text-slate-500 font-mono tabular-nums">
            Resolvidos: <span className="font-semibold text-slate-900">{totalCompleted}/{CLINICAL_CASES.length}</span>
            <span className="mx-2 text-slate-300" aria-hidden="true">·</span>
            Gabaritados: <span className="font-semibold text-emerald-700">{perfectCount}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              disabled={filteredCases.length <= 1}
              aria-label="Caso anterior"
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono tabular-nums text-slate-600 px-1.5 whitespace-nowrap">
              {currentIdx + 1} / {filteredCases.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={filteredCases.length <= 1}
              aria-label="Próximo caso"
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Zone Clinical Console */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT ZONE (7 cols): Clinical Case Sheet + CBC Report + Virtual Smear + Wintrobe Chart */}
        <div className="xl:col-span-7 space-y-5">
          {/* Patient Clinical Vignette */}
          <section className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <SpeciesPortrait
                species={activeCase.species}
                className="w-24 h-20 rounded-lg border border-slate-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-mono font-medium text-rose-700">{activeCase.code}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-slate-700">{sp.name}</span>
                  <span aria-hidden="true">·</span>
                  <span>{DIFFICULTY_LABELS[activeCase.difficulty]}</span>
                  {completedCases[activeCase.id] && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-emerald-700 font-medium">
                        Última nota: {completedCases[activeCase.id].score}/
                        {completedCases[activeCase.id].total}
                      </span>
                    </>
                  )}
                </div>

                <h2 className="text-lg font-semibold text-slate-900 leading-snug">
                  {activeCase.title}
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Paciente: <strong className="font-semibold text-slate-800">{activeCase.patientName}</strong> — {activeCase.signalment}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">Anamnese</div>
                <p className="text-slate-700 leading-relaxed">{activeCase.history}</p>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 mb-1">Exame físico</div>
                <p className="text-slate-700 leading-relaxed">{activeCase.physicalExam}</p>
              </div>
            </div>

            {activeCase.labNotes.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-500 mb-1.5">
                  Achados complementares do laboratório
                </div>
                <ul className="space-y-1 text-xs text-slate-700">
                  {activeCase.labNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-slate-400 select-none">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Laboratory CBC Table */}
          <CbcTable
            species={activeCase.species}
            cbc={activeCase.cbc}
            manualCalcMode={manualCalcMode}
            onToggleManualCalc={() => setManualCalcMode((v) => !v)}
            revealed={submitted}
          />

          {/* Virtual Blood Smear */}
          <BloodSmearViewer
            species={activeCase.species}
            vcm={activeCase.cbc.vcm}
            chcm={activeCase.cbc.chcm}
            smear={activeCase.smear}
            reticulocytes={activeCase.cbc.reticulocytes}
          />

          {/* Wintrobe Coordinate Plot (revealed after submit or when not in manual calc mode) */}
          <WintrobeChart
            species={activeCase.species}
            vcm={activeCase.cbc.vcm}
            chcm={activeCase.cbc.chcm}
            hidePoint={manualCalcMode && !submitted}
          />
        </div>

        {/* RIGHT ZONE (5 cols): 4-Axis Classification Deck & Clinical Debrief */}
        <div className="xl:col-span-5 space-y-5 xl:sticky xl:top-20">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-xl p-5 space-y-5"
          >
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Classificação do Hemograma
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Avalie os 4 eixos clínicos para validar seu diagnóstico
                </p>
              </div>
              {submitted && (
                <span className="font-mono text-sm font-semibold tabular-nums text-slate-900">
                  {score} / 4 acertos
                </span>
              )}
            </div>

            {/* Axis 1: VCM */}
            <fieldset className="space-y-2" disabled={submitted}>
              <legend className="text-xs font-semibold text-slate-700 flex items-center justify-between w-full">
                <span>1. Classificação Morfológica — Volume (VCM)</span>
                {submitted && (
                  <span
                    className={`font-mono ${axisResults.vcm ? 'text-emerald-700' : 'text-rose-700'}`}
                  >
                    {axisResults.vcm ? '✓ Correto' : '✕ Revisar'}
                  </span>
                )}
              </legend>
              <div className="grid grid-cols-1 gap-1.5">
                {(['microcitica', 'normocitica', 'macrocitica'] as VcmClassification[]).map((opt) => {
                  const selected = answers.vcm === opt;
                  const isAnswer = submitted && activeCase.solution.vcm === opt;
                  const isWrongSelected = submitted && selected && !axisResults.vcm;

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, vcm: opt }))}
                      className={`w-full text-left px-3.5 py-2.5 text-sm rounded-lg border transition-colors flex items-center justify-between gap-2 ${
                        isAnswer
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium'
                          : isWrongSelected
                            ? 'bg-rose-50 border-rose-300 text-rose-900'
                            : selected
                              ? 'bg-slate-900 border-slate-900 text-white font-medium'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{VCM_LABELS[opt]}</span>
                      {isAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {isWrongSelected && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Axis 2: CHCM */}
            <fieldset className="space-y-2" disabled={submitted}>
              <legend className="text-xs font-semibold text-slate-700 flex items-center justify-between w-full">
                <span>2. Classificação Cromática — Hemoglobina (CHCM)</span>
                {submitted && (
                  <span
                    className={`font-mono ${axisResults.chcm ? 'text-emerald-700' : 'text-rose-700'}`}
                  >
                    {axisResults.chcm ? '✓ Correto' : '✕ Revisar'}
                  </span>
                )}
              </legend>
              <div className="grid grid-cols-1 gap-1.5">
                {(['hipocromica', 'normocromica', 'pseudo_hipercromica'] as ChcmClassification[]).map(
                  (opt) => {
                    const selected = answers.chcm === opt;
                    const isAnswer = submitted && activeCase.solution.chcm === opt;
                    const isWrongSelected = submitted && selected && !axisResults.chcm;

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, chcm: opt }))}
                        className={`w-full text-left px-3.5 py-2.5 text-sm rounded-lg border transition-colors flex items-center justify-between gap-2 ${
                          isAnswer
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium'
                            : isWrongSelected
                              ? 'bg-rose-50 border-rose-300 text-rose-900'
                              : selected
                                ? 'bg-slate-900 border-slate-900 text-white font-medium'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{CHCM_LABELS[opt]}</span>
                        {isAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        {isWrongSelected && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                      </button>
                    );
                  }
                )}
              </div>
            </fieldset>

            {/* Axis 3: Regeneration */}
            <fieldset className="space-y-2" disabled={submitted}>
              <legend className="text-xs font-semibold text-slate-700 flex items-center justify-between w-full">
                <span>3. Resposta Medular (Regeneração)</span>
                {submitted && (
                  <span
                    className={`font-mono ${
                      axisResults.regeneration ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {axisResults.regeneration ? '✓ Correto' : '✕ Revisar'}
                  </span>
                )}
              </legend>
              <div className="grid grid-cols-1 gap-1.5">
                {(
                  [
                    'regenerativa',
                    'arregenerativa',
                    'pre_regenerativa',
                    'avaliar_seriado',
                  ] as RegenerationClassification[]
                ).map((opt) => {
                  const selected = answers.regeneration === opt;
                  const isAnswer = submitted && activeCase.solution.regeneration === opt;
                  const isWrongSelected = submitted && selected && !axisResults.regeneration;

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, regeneration: opt }))}
                      className={`w-full text-left px-3.5 py-2.5 text-sm rounded-lg border transition-colors flex items-center justify-between gap-2 ${
                        isAnswer
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium'
                          : isWrongSelected
                            ? 'bg-rose-50 border-rose-300 text-rose-900'
                            : selected
                              ? 'bg-slate-900 border-slate-900 text-white font-medium'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{REGENERATION_LABELS[opt]}</span>
                      {isAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {isWrongSelected && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Axis 4: Mechanism */}
            <fieldset className="space-y-2" disabled={submitted}>
              <legend className="text-xs font-semibold text-slate-700 flex items-center justify-between w-full">
                <span>4. Mecanismo Fisiopatológico Provável</span>
                {submitted && (
                  <span
                    className={`font-mono ${
                      axisResults.mechanism ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {axisResults.mechanism ? '✓ Correto' : '✕ Revisar'}
                  </span>
                )}
              </legend>
              <div className="grid grid-cols-1 gap-1.5">
                {(['hemorragia', 'hemolise', 'producao_diminuida'] as MechanismClassification[]).map(
                  (opt) => {
                    const selected = answers.mechanism === opt;
                    const isAnswer = submitted && activeCase.solution.mechanism === opt;
                    const isWrongSelected = submitted && selected && !axisResults.mechanism;

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, mechanism: opt }))}
                        className={`w-full text-left px-3.5 py-2.5 text-sm rounded-lg border transition-colors flex items-center justify-between gap-2 ${
                          isAnswer
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-medium'
                            : isWrongSelected
                              ? 'bg-rose-50 border-rose-300 text-rose-900'
                              : selected
                                ? 'bg-slate-900 border-slate-900 text-white font-medium'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{MECHANISM_LABELS[opt]}</span>
                        {isAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                        {isWrongSelected && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                      </button>
                    );
                  }
                )}
              </div>
            </fieldset>

            {/* Progressive Clinical Hints */}
            {!submitted && (
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setHintsShown((n) => Math.min(activeCase.hints.length, n + 1))
                    }
                    disabled={hintsShown >= activeCase.hints.length}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-800 hover:text-sky-900 disabled:text-slate-400 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    {hintsShown === 0
                      ? 'Solicitar dica de raciocínio'
                      : hintsShown < activeCase.hints.length
                        ? `Ver próxima dica (${hintsShown}/${activeCase.hints.length})`
                        : 'Todas as dicas exibidas'}
                  </button>
                  {hintsShown > 0 && (
                    <span className="text-xs font-mono text-slate-400">
                      {hintsShown}/{activeCase.hints.length}
                    </span>
                  )}
                </div>

                {hintsShown > 0 && (
                  <div className="p-3 rounded-lg bg-sky-50/70 border border-sky-200/80 space-y-1.5 text-xs text-slate-700">
                    {activeCase.hints.slice(0, hintsShown).map((hint, idx) => (
                      <p key={idx}>
                        <strong className="font-mono text-sky-800">{idx + 1}.</strong> {hint}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submit / Next Actions */}
            {!submitted ? (
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-rose-700 hover:bg-rose-800 disabled:bg-slate-300 disabled:text-slate-500 rounded-lg transition-colors"
              >
                Validar Classificação
              </button>
            ) : (
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleResetAttempt}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  Refazer
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  Próximo Caso
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </form>

          {/* Post-Submission Clinical Debriefing */}
          {submitted && (
            <section
              className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
              aria-live="polite"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Discussão Clínica do Caso
                </span>
                <span
                  className={`text-xs font-mono font-semibold ${
                    score === 4 ? 'text-emerald-700' : score >= 2 ? 'text-amber-700' : 'text-rose-700'
                  }`}
                >
                  {score === 4
                    ? 'Classificação completa'
                    : score >= 2
                      ? 'Parcialmente correta'
                      : 'Revisar critérios'}
                </span>
              </div>

              <h4 className="text-base font-semibold text-slate-900">
                {activeCase.solution.diagnosis}
              </h4>

              <p className="text-sm text-slate-700 leading-relaxed">
                {activeCase.solution.explanation}
              </p>

              <div className="pt-3 border-t border-slate-100">
                <div className="text-xs font-semibold text-rose-800 mb-1">
                  Ponto-chave para fixação
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeCase.solution.keyTakeaway}
                </p>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Compact Case Index Strip for Direct Jumping */}
      <section className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Banco de Hemogramas ({filteredCases.length} casos)
          </h3>
          <span className="text-xs text-slate-500">
            Selecione qualquer caso abaixo para estudo direcionado
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredCases.map((c) => {
            const isCurrent = c.id === activeCase.id;
            const res = completedCases[c.id];
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => switchToCase(c.id)}
                className={`text-left p-3.5 rounded-xl border transition-colors ${
                  isCurrent
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div
                  className={`flex items-center justify-between text-xs font-mono mb-1 ${
                    isCurrent ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  <span>
                    {c.code} · {SPECIES_PROFILES[c.species].name}
                  </span>
                  {res && (
                    <span className={isCurrent ? 'text-emerald-300' : 'text-emerald-700'}>
                      {res.score}/{res.total}
                    </span>
                  )}
                </div>
                <div className="text-sm font-medium leading-snug line-clamp-2">{c.title}</div>
                <div
                  className={`text-xs mt-1.5 ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}
                >
                  {DIFFICULTY_LABELS[c.difficulty]} · VG {c.cbc.vg.toFixed(1).replace('.', ',')}%
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
