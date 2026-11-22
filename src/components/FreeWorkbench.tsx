import React, { useMemo, useState } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import {
  classifyLiveSample,
  formatInteger,
  formatPtNumber,
  getParamStatus,
  REGENERATION_LABELS,
  SPECIES_LIST,
  SPECIES_PROFILES,
  SpeciesId,
} from '../data/species';
import { SmearProfile } from '../data/cases';
import { BloodSmearViewer } from './BloodSmearViewer';
import { SpeciesPortrait } from './SpeciesPortrait';
import { WintrobeChart } from './WintrobeChart';

interface WorkbenchPreset {
  id: string;
  label: string;
  apply: (species: SpeciesId) => {
    rbc: number;
    hb: number;
    vg: number;
    ppt: number;
    reticulocytes: number;
  };
}

const PRESETS: WorkbenchPreset[] = [
  {
    id: 'healthy',
    label: 'Animal Hígido',
    apply: (sp) => ({ ...SPECIES_PROFILES[sp].healthyDefaults }),
  },
  {
    id: 'hemolysis',
    label: 'Hemólise Regenerativa',
    apply: (sp) => {
      if (sp === 'canino') return { rbc: 2.3, hb: 6.0, vg: 20.5, ppt: 7.4, reticulocytes: 190000 };
      if (sp === 'felino') return { rbc: 2.5, hb: 4.4, vg: 15.5, ppt: 7.5, reticulocytes: 140000 };
      if (sp === 'equino') return { rbc: 3.1, hb: 6.7, vg: 20.0, ppt: 7.2, reticulocytes: 0 };
      return { rbc: 2.2, hb: 4.4, vg: 15.5, ppt: 7.2, reticulocytes: 95000 };
    },
  },
  {
    id: 'iron_def',
    label: 'Deficiência de Ferro',
    apply: (sp) => {
      if (sp === 'canino') return { rbc: 4.5, hb: 6.6, vg: 23.0, ppt: 5.0, reticulocytes: 20000 };
      if (sp === 'felino') return { rbc: 5.1, hb: 5.0, vg: 18.0, ppt: 5.2, reticulocytes: 15000 };
      if (sp === 'equino') return { rbc: 6.0, hb: 5.8, vg: 20.0, ppt: 5.1, reticulocytes: 0 };
      return { rbc: 4.8, hb: 4.8, vg: 17.5, ppt: 5.1, reticulocytes: 0 };
    },
  },
  {
    id: 'chronic',
    label: 'Doença Crônica / Renal',
    apply: (sp) => {
      if (sp === 'canino') return { rbc: 3.2, hb: 7.5, vg: 22.0, ppt: 7.3, reticulocytes: 10000 };
      if (sp === 'felino') return { rbc: 3.3, hb: 5.2, vg: 16.0, ppt: 8.6, reticulocytes: 8000 };
      if (sp === 'equino') return { rbc: 4.7, hb: 7.5, vg: 22.0, ppt: 8.5, reticulocytes: 0 };
      return { rbc: 3.8, hb: 6.2, vg: 19.0, ppt: 8.9, reticulocytes: 0 };
    },
  },
  {
    id: 'acute_bleed',
    label: 'Hemorragia Aguda',
    apply: (sp) => {
      if (sp === 'canino') return { rbc: 3.5, hb: 8.2, vg: 24.0, ppt: 4.5, reticulocytes: 20000 };
      if (sp === 'felino') return { rbc: 3.8, hb: 6.0, vg: 18.0, ppt: 4.6, reticulocytes: 15000 };
      if (sp === 'equino') return { rbc: 4.3, hb: 7.0, vg: 20.5, ppt: 4.4, reticulocytes: 0 };
      return { rbc: 3.5, hb: 5.7, vg: 17.5, ppt: 4.9, reticulocytes: 0 };
    },
  },
  {
    id: 'artifact',
    label: 'Artefato de Hemólise (CHCM ↑)',
    apply: (sp) => {
      if (sp === 'canino') return { rbc: 3.0, hb: 8.6, vg: 20.5, ppt: 7.1, reticulocytes: 110000 };
      if (sp === 'felino') return { rbc: 3.4, hb: 6.9, vg: 17.0, ppt: 7.0, reticulocytes: 90000 };
      if (sp === 'equino') return { rbc: 3.6, hb: 7.6, vg: 18.0, ppt: 7.1, reticulocytes: 0 };
      return { rbc: 3.1, hb: 6.4, vg: 16.0, ppt: 7.2, reticulocytes: 50000 };
    },
  },
];

export const FreeWorkbench: React.FC = () => {
  const [species, setSpecies] = useState<SpeciesId>('canino');
  const [rbc, setRbc] = useState<number>(SPECIES_PROFILES.canino.healthyDefaults.rbc);
  const [hb, setHb] = useState<number>(SPECIES_PROFILES.canino.healthyDefaults.hb);
  const [vg, setVg] = useState<number>(SPECIES_PROFILES.canino.healthyDefaults.vg);
  const [ppt, setPpt] = useState<number>(SPECIES_PROFILES.canino.healthyDefaults.ppt);
  const [reticulocytes, setReticulocytes] = useState<number>(
    SPECIES_PROFILES.canino.healthyDefaults.reticulocytes
  );
  const [activePreset, setActivePreset] = useState<string>('healthy');

  const sp = SPECIES_PROFILES[species];

  const handleSelectSpecies = (nextSp: SpeciesId) => {
    setSpecies(nextSp);
    const presetObj = PRESETS.find((p) => p.id === activePreset) ?? PRESETS[0];
    const nextVals = presetObj.apply(nextSp);
    setRbc(nextVals.rbc);
    setHb(nextVals.hb);
    setVg(nextVals.vg);
    setPpt(nextVals.ppt);
    setReticulocytes(nextVals.reticulocytes);
  };

  const handleApplyPreset = (preset: WorkbenchPreset) => {
    setActivePreset(preset.id);
    const nextVals = preset.apply(species);
    setRbc(nextVals.rbc);
    setHb(nextVals.hb);
    setVg(nextVals.vg);
    setPpt(nextVals.ppt);
    setReticulocytes(nextVals.reticulocytes);
  };

  const classification = useMemo(
    () => classifyLiveSample(species, rbc, hb, vg, ppt, reticulocytes),
    [species, rbc, hb, vg, ppt, reticulocytes]
  );

  // Dynamically derive live microscopic smear morphology from slider values
  const liveSmear = useMemo<SmearProfile>(() => {
    const isRegen = classification.regenerationClass === 'regenerativa';
    const isMicro = classification.vcmClass === 'microcitica';
    const isMacro = classification.vcmClass === 'macrocitica';
    const isHypo = classification.chcmClass === 'hipocromica';
    const isPseudo = classification.chcmClass === 'pseudo_hipercromica';

    const polychromasia =
      species === 'equino'
        ? 0
        : isRegen
          ? reticulocytes > 120000 || (species === 'bovino' && reticulocytes > 60000)
            ? 3
            : 2
          : 0;

    const anisocytosis = isMacro || isMicro || isRegen ? (isRegen ? 3 : 2) : 0;
    const hypochromia = isHypo ? (isMicro ? 3 : 2) : 0;
    const basophilicStippling = species === 'bovino' && isRegen && reticulocytes >= 30000;
    const rouleaux = species === 'equino' || (species === 'felino' && ppt > sp.refs.ppt.max);
    const heinzBodies = isPseudo && (species === 'felino' || species === 'equino');

    const findings: string[] = [];
    if (polychromasia >= 2) findings.push('Policromasia evidente refletindo liberação de reticulócitos.');
    if (basophilicStippling) findings.push('Pontilhado basofílico presente (achado regenerativo clássico em bovinos).');
    if (isMicro && isHypo) findings.push('Micrócitos com amplo halo de palidez central (hipocromia).');
    if (isMacro && species === 'equino') {
      findings.push('Macrócitos e anisocitose sem policromasia (padrão regenerativo indireto em equinos).');
    }
    if (isPseudo) findings.push('Células fantasma / hemólise compatíveis com elevação artificial da CHCM.');
    if (rouleaux) findings.push('Formação de rouleaux ("pilhas de moedas") visível no esfregaço.');
    if (findings.length === 0) findings.push('População eritrocitária uniforme (normócitos normocrômicos).');

    return {
      polychromasia,
      anisocytosis,
      hypochromia,
      spherocytes: false,
      heinzBodies,
      basophilicStippling,
      rouleaux,
      hemolysisArtifact: isPseudo,
      parasite: null,
      findingsSummary: findings,
    };
  }, [classification, species, reticulocytes, ppt, sp]);

  const statusTag = (val: number, min: number, max: number) => {
    const st = getParamStatus(val, { min, max, unit: '', decimals: 1 });
    if (st === 'baixo') return <span className="font-mono text-xs text-sky-800">▼ Baixo</span>;
    if (st === 'alto') return <span className="font-mono text-xs text-rose-700">▲ Alto</span>;
    return <span className="font-mono text-xs text-emerald-700">● Normal</span>;
  };

  return (
    <div className="space-y-6">
      {/* Species & Presets Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
        <div
          className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 overflow-x-auto"
          role="group"
          aria-label="Selecionar espécie na bancada livre"
        >
          {SPECIES_LIST.map((spId) => (
            <button
              key={spId}
              type="button"
              onClick={() => handleSelectSpecies(spId)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                species === spId
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {SPECIES_PROFILES[spId].name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 mr-1">Cenários rápidos:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                activePreset === preset.id
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Workbench */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (5 cols): Calibrated Parameter Sliders */}
        <section className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3 min-w-0">
              <SpeciesPortrait
                species={species}
                className="w-14 h-11 rounded-lg border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-slate-900 truncate">
                  Parâmetros — {sp.name}
                </h2>
                <p className="text-xs text-slate-500 truncate">{sp.scientificName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleApplyPreset(PRESETS[0])}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Restaurar
            </button>
          </div>

          {/* Slider 1: RBC */}
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor="slider-rbc" className="text-xs font-semibold text-slate-700">
                Hemácias (RBC)
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums text-sm font-semibold text-slate-900">
                  {formatPtNumber(rbc, 2)} <span className="text-xs font-normal text-slate-400">×10⁶/µL</span>
                </span>
                {statusTag(rbc, sp.refs.rbc.min, sp.refs.rbc.max)}
              </div>
            </div>
            <input
              id="slider-rbc"
              type="range"
              className="clinical-slider"
              min={sp.sliderBounds.rbc[0]}
              max={sp.sliderBounds.rbc[1]}
              step={sp.sliderBounds.rbc[2]}
              value={rbc}
              onChange={(e) => {
                setRbc(parseFloat(e.target.value));
                setActivePreset('custom');
              }}
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>{formatPtNumber(sp.sliderBounds.rbc[0], 1)}</span>
              <span>
                Ref: {formatPtNumber(sp.refs.rbc.min, 1)} – {formatPtNumber(sp.refs.rbc.max, 1)}
              </span>
              <span>{formatPtNumber(sp.sliderBounds.rbc[1], 1)}</span>
            </div>
          </div>

          {/* Slider 2: VG */}
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor="slider-vg" className="text-xs font-semibold text-slate-700">
                Hematócrito / Volume Globular (VG)
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums text-sm font-semibold text-slate-900">
                  {formatPtNumber(vg, 1)} <span className="text-xs font-normal text-slate-400">%</span>
                </span>
                {statusTag(vg, sp.refs.vg.min, sp.refs.vg.max)}
              </div>
            </div>
            <input
              id="slider-vg"
              type="range"
              className="clinical-slider"
              min={sp.sliderBounds.vg[0]}
              max={sp.sliderBounds.vg[1]}
              step={0.5}
              value={vg}
              onChange={(e) => {
                setVg(parseFloat(e.target.value));
                setActivePreset('custom');
              }}
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>{sp.sliderBounds.vg[0]}%</span>
              <span>
                Ref: {sp.refs.vg.min} – {sp.refs.vg.max}%
              </span>
              <span>{sp.sliderBounds.vg[1]}%</span>
            </div>
          </div>

          {/* Slider 3: Hb */}
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor="slider-hb" className="text-xs font-semibold text-slate-700">
                Hemoglobina (Hb)
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums text-sm font-semibold text-slate-900">
                  {formatPtNumber(hb, 1)} <span className="text-xs font-normal text-slate-400">g/dL</span>
                </span>
                {statusTag(hb, sp.refs.hb.min, sp.refs.hb.max)}
              </div>
            </div>
            <input
              id="slider-hb"
              type="range"
              className="clinical-slider"
              min={sp.sliderBounds.hb[0]}
              max={sp.sliderBounds.hb[1]}
              step={sp.sliderBounds.hb[2]}
              value={hb}
              onChange={(e) => {
                setHb(parseFloat(e.target.value));
                setActivePreset('custom');
              }}
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>{formatPtNumber(sp.sliderBounds.hb[0], 1)}</span>
              <span>
                Ref: {formatPtNumber(sp.refs.hb.min, 1)} – {formatPtNumber(sp.refs.hb.max, 1)} g/dL
              </span>
              <span>{formatPtNumber(sp.sliderBounds.hb[1], 1)}</span>
            </div>
          </div>

          {/* Slider 4: Reticulocytes */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor="slider-retic" className="text-xs font-semibold text-slate-700">
                {sp.reticulocyteUnitLabel}
              </label>
              <span className="font-mono tabular-nums text-sm font-semibold text-slate-900">
                {formatInteger(reticulocytes)}{' '}
                <span className="text-xs font-normal text-slate-400">/µL</span>
              </span>
            </div>

            {species === 'equino' ? (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                Em equinos, a contagem periférica permanece em <strong className="font-mono text-slate-900">0 /µL</strong> mesmo em anemias fortemente regenerativas. Simule a regeneração elevando o VCM (reduzindo RBC relativamente ao VG).
              </div>
            ) : (
              <>
                <input
                  id="slider-retic"
                  type="range"
                  className="clinical-slider"
                  min={sp.sliderBounds.reticulocytes[0]}
                  max={sp.sliderBounds.reticulocytes[1]}
                  step={sp.sliderBounds.reticulocytes[2]}
                  value={reticulocytes}
                  onChange={(e) => {
                    setReticulocytes(parseInt(e.target.value, 10));
                    setActivePreset('custom');
                  }}
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>0</span>
                  <span>
                    Limiar regenerativo:{' '}
                    {species === 'bovino'
                      ? '> 0 /µL'
                      : `≥ ${formatInteger(sp.reticulocyteThreshold ?? 60000)} /µL`}
                  </span>
                  <span>{formatInteger(sp.sliderBounds.reticulocytes[1])}</span>
                </div>
              </>
            )}
          </div>

          {/* Slider 5: PPT */}
          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor="slider-ppt" className="text-xs font-semibold text-slate-700">
                Proteína Plasmática Total (PPT)
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono tabular-nums text-sm font-semibold text-slate-900">
                  {formatPtNumber(ppt, 1)} <span className="text-xs font-normal text-slate-400">g/dL</span>
                </span>
                {statusTag(ppt, sp.refs.ppt.min, sp.refs.ppt.max)}
              </div>
            </div>
            <input
              id="slider-ppt"
              type="range"
              className="clinical-slider"
              min={sp.sliderBounds.ppt[0]}
              max={sp.sliderBounds.ppt[1]}
              step={sp.sliderBounds.ppt[2]}
              value={ppt}
              onChange={(e) => {
                setPpt(parseFloat(e.target.value));
                setActivePreset('custom');
              }}
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>{formatPtNumber(sp.sliderBounds.ppt[0], 1)}</span>
              <span>
                Ref: {formatPtNumber(sp.refs.ppt.min, 1)} – {formatPtNumber(sp.refs.ppt.max, 1)} g/dL
              </span>
              <span>{formatPtNumber(sp.sliderBounds.ppt[1], 1)}</span>
            </div>
          </div>

          {/* Live Substituted Wintrobe Formulas */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500">Cálculo ao vivo — VCM</div>
              <div className="text-xl font-mono font-semibold tabular-nums text-slate-900 mt-1">
                {formatPtNumber(classification.vcm, 1)}{' '}
                <span className="text-xs font-normal text-slate-500">fL</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                ({formatPtNumber(vg, 1)} × 10) / {formatPtNumber(rbc, 2)}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                Ref: {sp.refs.vcm.min} – {sp.refs.vcm.max} fL
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500">Cálculo ao vivo — CHCM</div>
              <div className="text-xl font-mono font-semibold tabular-nums text-slate-900 mt-1">
                {formatPtNumber(classification.chcm, 1)}{' '}
                <span className="text-xs font-normal text-slate-500">g/dL</span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                ({formatPtNumber(hb, 1)} × 100) / {formatPtNumber(vg, 1)}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                Ref: {sp.refs.chcm.min} – {sp.refs.chcm.max} g/dL
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN (7 cols): Live Classification + Wintrobe Plot + Dynamic Blood Smear */}
        <div className="xl:col-span-7 space-y-5">
          {/* Live Automated Classification Card */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>Leitura Interpretativa em Tempo Real</span>
              <span className="font-mono tabular-nums">
                Gravidade: <strong className="text-slate-900">{classification.anemiaSeverity}</strong>
                <span className="mx-1.5 text-slate-300" aria-hidden="true">·</span>
                Resposta:{' '}
                <strong className="text-slate-900">
                  {classification.isAnemic
                    ? REGENERATION_LABELS[classification.regenerationClass]
                    : 'Não se aplica'}
                </strong>
              </span>
            </div>

            <h3 className="text-xl font-semibold text-slate-900">
              {classification.morphologicalTitle}
            </h3>

            <p className="text-sm text-slate-700 leading-relaxed">
              {classification.clinicalSummary}
            </p>

            {classification.artifactWarning && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="leading-relaxed">{classification.artifactWarning}</p>
              </div>
            )}
          </section>

          {/* Live Wintrobe Coordinate Plot */}
          <WintrobeChart
            species={species}
            vcm={classification.vcm}
            chcm={classification.chcm}
            isAnemic={classification.isAnemic}
          />

          {/* Dynamic Virtual Blood Smear */}
          <BloodSmearViewer
            species={species}
            vcm={classification.vcm}
            chcm={classification.chcm}
            smear={liveSmear}
            reticulocytes={reticulocytes}
          />
        </div>
      </div>
    </div>
  );
};
