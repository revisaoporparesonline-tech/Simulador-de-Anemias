import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Trash2,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';
import { CLINICAL_CASES, ClinicalCase, DIFFICULTY_LABELS } from '../data/cases';
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

type DynamicPhase = 'setup' | 'playing' | 'summary';

interface Team {
  id: string;
  name: string;
  points: number;
  roundsPlayed: number;
}

interface RoundRecord {
  caseId: string;
  species: SpeciesId;
  teamId: string;
  vcmOk: boolean;
  chcmOk: boolean;
  regenOk: boolean;
  mechOk: boolean;
  pointsEarned: number;
}

function shuffleCases(pool: ClinicalCase[], count: number): ClinicalCase[] {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(count, arr.length));
}

export const GroupDynamic: React.FC = () => {
  const [phase, setPhase] = useState<DynamicPhase>('setup');

  // Setup state
  const [teamNames, setTeamNames] = useState<string[]>(['Equipe 1', 'Equipe 2', 'Equipe 3']);
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesId[]>([...SPECIES_LIST]);
  const [roundCount, setRoundCount] = useState<number>(6);
  const [timerSeconds, setTimerSeconds] = useState<number>(90); // 0 = no timer
  const [requireManualCalc, setRequireManualCalc] = useState<boolean>(false);
  const [allowHints, setAllowHints] = useState<boolean>(true);

  // Active session state
  const [teams, setTeams] = useState<Team[]>([]);
  const [deck, setDeck] = useState<ClinicalCase[]>([]);
  const [roundIdx, setRoundIdx] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerPaused, setTimerPaused] = useState<boolean>(false);
  const [records, setRecords] = useState<RoundRecord[]>([]);

  // Per-round form state
  const [vcmAns, setVcmAns] = useState<VcmClassification | null>(null);
  const [chcmAns, setChcmAns] = useState<ChcmClassification | null>(null);
  const [regenAns, setRegenAns] = useState<RegenerationClassification | null>(null);
  const [mechAns, setMechAns] = useState<MechanismClassification | null>(null);
  const [roundRevealed, setRoundRevealed] = useState<boolean>(false);
  const [hintShown, setHintShown] = useState<boolean>(false);

  const availableCases = useMemo(
    () => CLINICAL_CASES.filter((c) => selectedSpecies.includes(c.species)),
    [selectedSpecies]
  );

  // Countdown timer effect
  useEffect(() => {
    if (phase !== 'playing' || roundRevealed || timerSeconds === 0 || timerPaused) return;
    if (timeLeft <= 0) return;

    const id = window.setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [phase, roundRevealed, timerSeconds, timerPaused, timeLeft]);

  const toggleSpecies = (sp: SpeciesId) => {
    setSelectedSpecies((prev) => {
      if (prev.includes(sp)) {
        if (prev.length === 1) return prev; // Keep at least 1 species selected
        return prev.filter((item) => item !== sp);
      }
      return [...prev, sp];
    });
  };

  const addTeam = () => {
    if (teamNames.length >= 6) return;
    setTeamNames((prev) => [...prev, `Equipe ${prev.length + 1}`]);
  };

  const removeTeam = (idx: number) => {
    if (teamNames.length <= 1) return;
    setTeamNames((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateTeamName = (idx: number, val: string) => {
    setTeamNames((prev) => prev.map((name, i) => (i === idx ? val : name)));
  };

  const startDynamic = () => {
    const cleanTeams: Team[] = teamNames.map((n, i) => ({
      id: `team-${i + 1}`,
      name: n.trim() || `Equipe ${i + 1}`,
      points: 0,
      roundsPlayed: 0,
    }));
    const drawn = shuffleCases(availableCases, roundCount);
    setTeams(cleanTeams);
    setDeck(drawn);
    setRoundIdx(0);
    setRecords([]);
    setVcmAns(null);
    setChcmAns(null);
    setRegenAns(null);
    setMechAns(null);
    setRoundRevealed(false);
    setHintShown(false);
    setTimeLeft(timerSeconds);
    setTimerPaused(false);
    setPhase('playing');
  };

  const currentCase = deck[roundIdx];
  const activeTeam = teams.length > 0 ? teams[roundIdx % teams.length] : null;

  const canSubmitRound =
    vcmAns !== null && chcmAns !== null && regenAns !== null && mechAns !== null;

  const handleSubmitRound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCase || !activeTeam || !canSubmitRound) return;

    const vcmOk = vcmAns === currentCase.solution.vcm;
    const chcmOk = chcmAns === currentCase.solution.chcm;
    const regenOk = regenAns === currentCase.solution.regeneration;
    const mechOk = mechAns === currentCase.solution.mechanism;
    const pointsEarned =
      (vcmOk ? 25 : 0) + (chcmOk ? 25 : 0) + (regenOk ? 25 : 0) + (mechOk ? 25 : 0);

    setTeams((prev) =>
      prev.map((t) =>
        t.id === activeTeam.id
          ? { ...t, points: t.points + pointsEarned, roundsPlayed: t.roundsPlayed + 1 }
          : t
      )
    );

    setRecords((prev) => [
      ...prev,
      {
        caseId: currentCase.id,
        species: currentCase.species,
        teamId: activeTeam.id,
        vcmOk,
        chcmOk,
        regenOk,
        mechOk,
        pointsEarned,
      },
    ]);

    setRoundRevealed(true);
  };

  const handleNextRound = () => {
    if (roundIdx + 1 >= deck.length) {
      setPhase('summary');
      return;
    }
    setRoundIdx((i) => i + 1);
    setVcmAns(null);
    setChcmAns(null);
    setRegenAns(null);
    setMechAns(null);
    setRoundRevealed(false);
    setHintShown(false);
    setTimeLeft(timerSeconds);
    setTimerPaused(false);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // ==================== PHASE 1: SETUP ====================
  if (phase === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="pb-5 border-b border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900">
            Dinâmica de Estudos em Grupo
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Configure rodadas de leitura de hemograma para grupos de estudo, monitorias ou discussão em sala de aula. Cada rodada vale até 100 pontos (25 pontos por eixo de classificação).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teams configuration */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-700" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Equipes ou Participantes ({teamNames.length}/6)
                </h3>
              </div>
              <button
                type="button"
                onClick={addTeam}
                disabled={teamNames.length >= 6}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                Adicionar
              </button>
            </div>

            <div className="space-y-2.5">
              {teamNames.map((name, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 w-5 text-right shrink-0">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updateTeamName(idx, e.target.value)}
                    maxLength={28}
                    aria-label={`Nome da equipe ${idx + 1}`}
                    className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-rose-600"
                  />
                  {teamNames.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTeam(idx)}
                      aria-label={`Remover ${name}`}
                      className="p-2 text-slate-400 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Round rules & species */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700">
                Espécies incluídas na rodada
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SPECIES_LIST.map((spId) => {
                  const active = selectedSpecies.includes(spId);
                  return (
                    <button
                      key={spId}
                      type="button"
                      onClick={() => toggleSpecies(spId)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors ${
                        active
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {SPECIES_PROFILES[spId].plural}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {availableCases.length} casos clínicos disponíveis no banco selecionado
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Total de rodadas
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[4, 6, 8, 12].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRoundCount(n)}
                      className={`py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors ${
                        roundCount === n
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {Math.min(n, availableCases.length)} casos
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Cronômetro por caso
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[0, 60, 90, 120].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setTimerSeconds(sec)}
                      className={`py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors ${
                        timerSeconds === sec
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {sec === 0 ? 'Livre' : `${sec}s`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2.5 text-xs text-slate-700">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireManualCalc}
                  onChange={(e) => setRequireManualCalc(e.target.checked)}
                  className="rounded border-slate-300 text-rose-700 focus:ring-rose-600"
                />
                <span>Ocultar VCM e CHCM para cálculo manual das equipes</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowHints}
                  onChange={(e) => setAllowHints(e.target.checked)}
                  className="rounded border-slate-300 text-rose-700 focus:ring-rose-600"
                />
                <span>Permitir consulta de 1 dica clínica por rodada</span>
              </label>
            </div>
          </section>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={startDynamic}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors"
          >
            Iniciar Dinâmica ({Math.min(roundCount, availableCases.length)} rodadas)
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  // ==================== PHASE 3: SUMMARY ====================
  if (phase === 'summary') {
    const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
    const totalRounds = records.length || 1;
    const axisAccuracy = [
      {
        label: 'Volume (VCM)',
        pct: Math.round((records.filter((r) => r.vcmOk).length / totalRounds) * 100),
      },
      {
        label: 'Cromia (CHCM)',
        pct: Math.round((records.filter((r) => r.chcmOk).length / totalRounds) * 100),
      },
      {
        label: 'Resposta Medular',
        pct: Math.round((records.filter((r) => r.regenOk).length / totalRounds) * 100),
      },
      {
        label: 'Mecanismo Fisiopatológico',
        pct: Math.round((records.filter((r) => r.mechOk).length / totalRounds) * 100),
      },
    ];

    const speciesAccuracy = SPECIES_LIST.map((spId) => {
      const spRecs = records.filter((r) => r.species === spId);
      if (spRecs.length === 0) return null;
      const earned = spRecs.reduce((acc, r) => acc + r.pointsEarned, 0);
      const pct = Math.round((earned / (spRecs.length * 100)) * 100);
      return { spId, name: SPECIES_PROFILES[spId].plural, count: spRecs.length, pct };
    }).filter(Boolean) as Array<{ spId: SpeciesId; name: string; count: number; pct: number }>;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Relatório Final da Dinâmica
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {records.length} casos analisados · Mapa de desempenho por equipe, espécie e eixo diagnóstico
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPhase('setup')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Nova Dinâmica
          </button>
        </div>

        {/* Ranking Table */}
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-rose-700" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-slate-900">Classificação das Equipes</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-500">
                <th className="py-2.5 pl-5 pr-3 w-16">Pos.</th>
                <th className="py-2.5 px-3">Equipe</th>
                <th className="py-2.5 px-3 text-right">Casos</th>
                <th className="py-2.5 px-3 text-right">Aproveitamento</th>
                <th className="py-2.5 pl-3 pr-5 text-right">Pontuação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {sortedTeams.map((t, idx) => {
                const pct =
                  t.roundsPlayed > 0 ? Math.round((t.points / (t.roundsPlayed * 100)) * 100) : 0;
                return (
                  <tr key={t.id} className={idx === 0 ? 'bg-emerald-50/40' : ''}>
                    <td className="py-3 pl-5 pr-3 font-mono font-semibold text-slate-700">
                      {idx + 1}º
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{t.name}</td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                      {t.roundsPlayed}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700">
                      {pct}%
                    </td>
                    <td className="py-3 pl-3 pr-5 text-right font-mono tabular-nums font-semibold text-slate-900">
                      {t.points} pts
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Diagnostic Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Acertos por Eixo de Classificação
            </h3>
            <div className="space-y-3">
              {axisAccuracy.map((axis) => (
                <div key={axis.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{axis.label}</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {axis.pct}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-700 rounded-full"
                      style={{ width: `${axis.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Desempenho por Espécie
            </h3>
            <div className="space-y-3">
              {speciesAccuracy.map((item) => (
                <div key={item.spId} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">
                      {item.name} ({item.count} {item.count === 1 ? 'caso' : 'casos'})
                    </span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {item.pct}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-700 rounded-full"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // ==================== PHASE 2: ACTIVE ROUND ====================
  if (!currentCase || !activeTeam) return null;

  const sp = SPECIES_PROFILES[currentCase.species];
  const lastRecord = roundRevealed ? records[records.length - 1] : null;

  return (
    <div className="space-y-5">
      {/* Live Session Ribbon */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-mono font-semibold text-rose-700">
            Rodada {roundIdx + 1} / {deck.length}
          </span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="text-slate-600">
            Vez de: <strong className="font-semibold text-slate-900">{activeTeam.name}</strong>
          </span>
          <span className="text-slate-300" aria-hidden="true">·</span>
          <span className="text-xs text-slate-500">
            {sp.name} · {DIFFICULTY_LABELS[currentCase.difficulty]}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {timerSeconds > 0 && (
            <div className="flex items-center gap-2">
              <Clock
                className={`w-4 h-4 ${timeLeft <= 15 && !roundRevealed ? 'text-rose-700' : 'text-slate-500'}`}
                aria-hidden="true"
              />
              <span
                className={`font-mono tabular-nums text-sm font-semibold ${
                  timeLeft <= 15 && !roundRevealed ? 'text-rose-700' : 'text-slate-900'
                }`}
              >
                {timeLeft === 0 && !roundRevealed ? 'Tempo esgotado' : formatTimer(timeLeft)}
              </span>
              {!roundRevealed && timeLeft > 0 && (
                <button
                  type="button"
                  onClick={() => setTimerPaused((p) => !p)}
                  aria-label={timerPaused ? 'Retomar cronômetro' : 'Pausar cronômetro'}
                  className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  {timerPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setPhase('setup')}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            Encerrar
          </button>
        </div>
      </div>

      {/* Live Scoreboard Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {teams.map((t) => {
          const isTurn = t.id === activeTeam.id;
          return (
            <div
              key={t.id}
              className={`px-3.5 py-2.5 rounded-lg border transition-colors ${
                isTurn ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div
                className={`text-xs truncate ${isTurn ? 'text-slate-300' : 'text-slate-500'}`}
              >
                {t.name}
              </div>
              <div className="font-mono tabular-nums text-base font-semibold mt-0.5">
                {t.points} <span className="text-xs font-normal opacity-70">pts</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Round Console */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 space-y-5">
          {/* Patient Header */}
          <section className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-start gap-4">
              <SpeciesPortrait
                species={currentCase.species}
                className="w-20 h-16 rounded-lg border border-slate-200 shrink-0"
              />
              <div>
                <div className="text-xs text-slate-500 font-mono">
                  {currentCase.code} · {sp.name} · {currentCase.signalment}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
                  {currentCase.title}
                </h3>
                <p className="text-sm text-slate-700 mt-2 leading-relaxed">
                  {currentCase.history} {currentCase.physicalExam}
                </p>
              </div>
            </div>

            {currentCase.labNotes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                {currentCase.labNotes.map((n, i) => (
                  <p key={i}>• {n}</p>
                ))}
              </div>
            )}
          </section>

          <CbcTable
            species={currentCase.species}
            cbc={currentCase.cbc}
            manualCalcMode={requireManualCalc}
            revealed={roundRevealed}
          />

          <BloodSmearViewer
            species={currentCase.species}
            vcm={currentCase.cbc.vcm}
            chcm={currentCase.cbc.chcm}
            smear={currentCase.smear}
            reticulocytes={currentCase.cbc.reticulocytes}
            allowLabels={roundRevealed}
            compact
          />
        </div>

        {/* Right Deck: Team Response / Class Debrief */}
        <div className="xl:col-span-5 space-y-5">
          <form
            onSubmit={handleSubmitRound}
            className="bg-white border border-slate-200 rounded-xl p-5 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-semibold text-slate-900">
                Resposta — {activeTeam.name}
              </h4>
              {lastRecord && (
                <span className="font-mono text-sm font-semibold text-emerald-700">
                  +{lastRecord.pointsEarned} pts
                </span>
              )}
            </div>

            {/* VCM */}
            <fieldset className="space-y-1.5" disabled={roundRevealed}>
              <legend className="text-xs font-semibold text-slate-700">1. Volume (VCM)</legend>
              <div className="grid grid-cols-1 gap-1.5">
                {(['microcitica', 'normocitica', 'macrocitica'] as VcmClassification[]).map((opt) => {
                  const selected = vcmAns === opt;
                  const isCorrect = roundRevealed && currentCase.solution.vcm === opt;
                  const isWrong = roundRevealed && selected && !isCorrect;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setVcmAns(opt)}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center justify-between ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                          : isWrong
                            ? 'bg-rose-50 border-rose-300 text-rose-900'
                            : selected
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{VCM_LABELS[opt]}</span>
                      {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      {isWrong && <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* CHCM */}
            <fieldset className="space-y-1.5" disabled={roundRevealed}>
              <legend className="text-xs font-semibold text-slate-700">2. Cromia (CHCM)</legend>
              <div className="grid grid-cols-1 gap-1.5">
                {(['hipocromica', 'normocromica', 'pseudo_hipercromica'] as ChcmClassification[]).map(
                  (opt) => {
                    const selected = chcmAns === opt;
                    const isCorrect = roundRevealed && currentCase.solution.chcm === opt;
                    const isWrong = roundRevealed && selected && !isCorrect;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setChcmAns(opt)}
                        className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                            : isWrong
                              ? 'bg-rose-50 border-rose-300 text-rose-900'
                              : selected
                                ? 'bg-slate-900 border-slate-900 text-white'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{CHCM_LABELS[opt]}</span>
                        {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        {isWrong && <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                      </button>
                    );
                  }
                )}
              </div>
            </fieldset>

            {/* Regeneration */}
            <fieldset className="space-y-1.5" disabled={roundRevealed}>
              <legend className="text-xs font-semibold text-slate-700">3. Resposta Medular</legend>
              <div className="grid grid-cols-1 gap-1.5">
                {(
                  [
                    'regenerativa',
                    'arregenerativa',
                    'pre_regenerativa',
                    'avaliar_seriado',
                  ] as RegenerationClassification[]
                ).map((opt) => {
                  const selected = regenAns === opt;
                  const isCorrect = roundRevealed && currentCase.solution.regeneration === opt;
                  const isWrong = roundRevealed && selected && !isCorrect;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setRegenAns(opt)}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center justify-between ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                          : isWrong
                            ? 'bg-rose-50 border-rose-300 text-rose-900'
                            : selected
                              ? 'bg-slate-900 border-slate-900 text-white'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{REGENERATION_LABELS[opt]}</span>
                      {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      {isWrong && <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Mechanism */}
            <fieldset className="space-y-1.5" disabled={roundRevealed}>
              <legend className="text-xs font-semibold text-slate-700">4. Mecanismo Provável</legend>
              <div className="grid grid-cols-1 gap-1.5">
                {(['hemorragia', 'hemolise', 'producao_diminuida'] as MechanismClassification[]).map(
                  (opt) => {
                    const selected = mechAns === opt;
                    const isCorrect = roundRevealed && currentCase.solution.mechanism === opt;
                    const isWrong = roundRevealed && selected && !isCorrect;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setMechAns(opt)}
                        className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg border transition-colors flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                            : isWrong
                              ? 'bg-rose-50 border-rose-300 text-rose-900'
                              : selected
                                ? 'bg-slate-900 border-slate-900 text-white'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{MECHANISM_LABELS[opt]}</span>
                        {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        {isWrong && <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                      </button>
                    );
                  }
                )}
              </div>
            </fieldset>

            {allowHints && !roundRevealed && (
              <div>
                {!hintShown ? (
                  <button
                    type="button"
                    onClick={() => setHintShown(true)}
                    className="text-xs font-medium text-sky-800 hover:text-sky-900"
                  >
                    Exibir dica para a turma
                  </button>
                ) : (
                  <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs text-slate-700">
                    <strong className="text-sky-900">Dica:</strong> {currentCase.hints[0]}
                  </div>
                )}
              </div>
            )}

            {!roundRevealed ? (
              <button
                type="submit"
                disabled={!canSubmitRound}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-rose-700 hover:bg-rose-800 disabled:bg-slate-300 disabled:text-slate-500 rounded-lg transition-colors"
              >
                Registrar Resposta da Equipe
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNextRound}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                {roundIdx + 1 >= deck.length ? 'Ver Relatório Final' : 'Avançar para Próxima Rodada'}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </form>

          {roundRevealed && (
            <>
              <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5">
                <div className="text-xs font-semibold text-rose-800">Debate em Sala — Gabarito</div>
                <h4 className="text-base font-semibold text-slate-900">
                  {currentCase.solution.diagnosis}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {currentCase.solution.explanation}
                </p>
                <p className="text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <strong className="text-slate-900">Síntese:</strong> {currentCase.solution.keyTakeaway}
                </p>
              </section>

              <WintrobeChart
                species={currentCase.species}
                vcm={currentCase.cbc.vcm}
                chcm={currentCase.cbc.chcm}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
