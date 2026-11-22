import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, Microscope } from 'lucide-react';
import { SPECIES_PROFILES, SpeciesId } from '../data/species';
import { SmearProfile } from '../data/cases';

interface BloodSmearViewerProps {
  species: SpeciesId;
  vcm: number;
  chcm: number;
  smear: SmearProfile;
  reticulocytes: number;
  allowLabels?: boolean;
  compact?: boolean;
}

type StainMode = 'panotico' | 'nmb';

interface CellSpec {
  id: number;
  x: number;
  y: number;
  r: number;
  type:
    | 'normal'
    | 'polychromatic'
    | 'spherocyte'
    | 'heinz'
    | 'stippled'
    | 'parasite'
    | 'ghost'
    | 'reticulocyte_agg'
    | 'reticulocyte_punc';
  pallorRatio: number;
  rotation: number;
  label?: string;
}

// Deterministic pseudo-random generator for reproducible microscopic fields
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const BloodSmearViewer: React.FC<BloodSmearViewerProps> = ({
  species,
  vcm,
  chcm,
  smear,
  reticulocytes,
  allowLabels = true,
  compact = false,
}) => {
  const [stain, setStain] = useState<StainMode>('panotico');
  const [showAnnotations, setShowAnnotations] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<CellSpec | null>(null);

  const sp = SPECIES_PROFILES[species];

  const cells = useMemo<CellSpec[]>(() => {
    const seedBase =
      species.charCodeAt(0) * 137 +
      Math.round(vcm * 10) * 19 +
      Math.round(chcm * 10) * 7 +
      smear.polychromasia * 31;
    const rand = seededRandom(seedBase);

    // Base radius calibrated to species & VCM relative to species reference midpoint
    const midVcm = (sp.refs.vcm.min + sp.refs.vcm.max) / 2;
    const speciesScale = species === 'canino' ? 16.5 : species === 'felino' ? 14.2 : 14.6;
    const vcmRatio = Math.max(0.72, Math.min(1.38, vcm / midVcm));
    const baseR = speciesScale * Math.pow(vcmRatio, 0.45);

    // Central pallor calibrated to species & CHCM
    const basePallor = species === 'canino' ? 0.36 : 0.2;
    const chcmLowFactor = chcm < sp.refs.chcm.min ? Math.min(0.32, (sp.refs.chcm.min - chcm) * 0.065) : 0;
    const hypoBonus = smear.hypochromia * 0.085;
    const defaultPallor = Math.min(0.66, basePallor + chcmLowFactor + hypoBonus);

    const list: CellSpec[] = [];
    const total = compact ? 28 : 38;

    // Generate rouleaux stacks for equines / hyperglobulinemia
    let index = 0;
    if (smear.rouleaux && stain === 'panotico') {
      const stackOrigins = [
        { x: 96, y: 88, angle: 0.25 },
        { x: 256, y: 158, angle: -0.3 },
      ];
      for (const origin of stackOrigins) {
        const stackLen = species === 'equino' ? 4 : 3;
        for (let k = 0; k < stackLen; k++) {
          list.push({
            id: index++,
            x: origin.x + Math.cos(origin.angle) * k * (baseR * 0.72),
            y: origin.y + Math.sin(origin.angle) * k * (baseR * 0.72),
            r: baseR * (0.96 + rand() * 0.08),
            type: 'normal',
            pallorRatio: Math.max(0.12, defaultPallor - 0.1),
            rotation: origin.angle * 57,
            label: k === stackLen - 1 ? 'Rouleaux ("pilha de moedas")' : undefined,
          });
        }
      }
    }

    // Place remaining cells with collision relaxation inside circular 360x220 field
    const width = 360;
    const height = 220;
    let attempts = 0;

    while (list.length < total && attempts < 700) {
      attempts++;
      const cx = 36 + rand() * (width - 72);
      const cy = 28 + rand() * (height - 56);
      const anisoSpread = smear.anisocytosis * 0.11;
      const radiusJitter = 1 + (rand() * 2 - 1) * (0.06 + anisoSpread);
      let r = baseR * radiusJitter;

      let overlaps = false;
      for (const other of list) {
        const dist = Math.hypot(cx - other.x, cy - other.y);
        if (dist < (r + other.r) * 0.88) {
          overlaps = true;
          break;
        }
      }
      if (overlaps) continue;

      let type: CellSpec['type'] = 'normal';
      let pallorRatio = defaultPallor;
      let label: string | undefined;

      const roll = rand();

      if (stain === 'nmb') {
        // Supravital stain (Novo Azul de Metileno) highlights reticulocytes and Heinz bodies
        const reticRate =
          species === 'equino'
            ? 0
            : species === 'bovino'
              ? reticulocytes > 0
                ? Math.min(0.42, 0.12 + reticulocytes / 220000)
                : 0
              : Math.min(0.45, reticulocytes / 320000);

        if (smear.heinzBodies && roll < 0.28) {
          type = 'heinz';
          label = 'Corpúsculo de Heinz (corado em azul no NAM)';
        } else if (roll < reticRate + (smear.heinzBodies ? 0.28 : 0)) {
          type = 'reticulocyte_agg';
          r = baseR * 1.18;
          label =
            species === 'felino'
              ? 'Reticulócito agregado (regeneração ativa)'
              : 'Reticulócito (rede de RNA ribossomal)';
        } else if (species === 'felino' && roll < reticRate + 0.18) {
          type = 'reticulocyte_punc';
          label = 'Reticulócito pontilhado (resposta prévia)';
        }
      } else {
        // Panótico / Wright-Giemsa stain
        if (smear.hemolysisArtifact && roll < 0.13) {
          type = 'ghost';
          label = 'Célula fantasma (hemólise intravascular)';
        } else if (smear.spherocytes && roll < 0.25) {
          type = 'spherocyte';
          r = baseR * 0.78;
          pallorRatio = 0;
          label = 'Esferócito (menor, sem palidez central)';
        } else if (smear.heinzBodies && roll < 0.28) {
          type = 'heinz';
          label = 'Corpúsculo de Heinz (protrusão de membrana)';
        } else if (smear.parasite && roll < 0.24) {
          type = 'parasite';
          label =
            smear.parasite === 'anaplasma'
              ? 'Anaplasma marginale (inclusão marginal)'
              : smear.parasite === 'mycoplasma'
                ? 'Mycoplasma haemofelis (cocoide epicelular)'
                : 'Theileria equi (inclusão intraeritrocitária)';
        } else if (smear.basophilicStippling && roll < 0.34) {
          type = 'stippled';
          r = baseR * 1.14;
          label = 'Pontilhado basofílico (regeneração bovina)';
        } else if (smear.polychromasia > 0 && roll < 0.14 + smear.polychromasia * 0.12) {
          type = 'polychromatic';
          r = baseR * 1.18;
          pallorRatio = Math.max(0.12, defaultPallor * 0.45);
          label = 'Macrócito policromático (eritrócito jovem)';
        } else if (vcm < sp.refs.vcm.min && chcm < sp.refs.chcm.min) {
          label = 'Micrócito hipocrômico (halo central amplo)';
        } else if (vcm > sp.refs.vcm.max) {
          label = 'Macrócito (volume aumentado)';
        } else {
          label = 'Eritrócito normocítico normocrômico';
        }
      }

      list.push({
        id: index++,
        x: cx,
        y: cy,
        r,
        type,
        pallorRatio,
        rotation: rand() * 360,
        label,
      });
    }

    return list;
  }, [species, vcm, chcm, smear, reticulocytes, stain, sp, compact]);

  // Pick up to 3 notable distinct cells to annotate when "Identificar achados" is active
  const calloutCells = useMemo(() => {
    const seen = new Set<string>();
    const notable: CellSpec[] = [];
    for (const c of cells) {
      if (!c.label) continue;
      if (c.type === 'normal' && smear.polychromasia + smear.hypochromia > 0 && !smear.rouleaux) {
        continue;
      }
      if (!seen.has(c.label)) {
        seen.add(c.label);
        notable.push(c);
      }
      if (notable.length >= 3) break;
    }
    return notable;
  }, [cells, smear]);

  const bgGradientId = `smear-bg-${species}-${stain}`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Microscope className="w-4 h-4 text-rose-700 shrink-0" aria-hidden="true" />
          <span className="text-sm font-semibold text-slate-900 truncate">
            Microscopia Virtual (100× imersão)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200"
            role="group"
            aria-label="Selecionar coloração do esfregaço"
          >
            <button
              type="button"
              onClick={() => {
                setStain('panotico');
                setSelectedCell(null);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                stain === 'panotico'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Panótico
            </button>
            <button
              type="button"
              onClick={() => {
                setStain('nmb');
                setSelectedCell(null);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                stain === 'nmb'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Novo Azul de Metileno
            </button>
          </div>

          {allowLabels && (
            <button
              type="button"
              onClick={() => setShowAnnotations((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                showAnnotations
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {showAnnotations ? (
                <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {showAnnotations ? 'Ocultar rótulos' : 'Identificar achados'}
            </button>
          )}
        </div>
      </div>

      {/* Microscope Viewport */}
      <div className="relative bg-slate-50 p-3">
        <svg
          viewBox="0 0 360 220"
          className="w-full h-auto block rounded-lg border border-slate-200 cursor-crosshair select-none"
          role="img"
          aria-label={`Campo microscópico de esfregaço sanguíneo de ${sp.name} na coloração ${
            stain === 'panotico' ? 'Panótico' : 'Novo Azul de Metileno'
          }`}
        >
          <defs>
            <radialGradient id={bgGradientId} cx="50%" cy="50%" r="70%">
              {stain === 'panotico' ? (
                <>
                  <stop offset="0%" stopColor="#FDF9FA" />
                  <stop offset="78%" stopColor="#F5EDF0" />
                  <stop offset="100%" stopColor="#E9DDE2" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#F5FAFD" />
                  <stop offset="78%" stopColor="#E6F2F8" />
                  <stop offset="100%" stopColor="#D4E6F0" />
                </>
              )}
            </radialGradient>
          </defs>

          <rect width="360" height="220" fill={`url(#${bgGradientId})`} />

          {/* Subtle ocular reticle lines */}
          <line x1="180" y1="8" x2="180" y2="22" stroke="#94A3B8" strokeOpacity="0.35" strokeWidth="0.75" />
          <line x1="180" y1="198" x2="180" y2="212" stroke="#94A3B8" strokeOpacity="0.35" strokeWidth="0.75" />
          <line x1="8" y1="110" x2="22" y2="110" stroke="#94A3B8" strokeOpacity="0.35" strokeWidth="0.75" />
          <line x1="338" y1="110" x2="352" y2="110" stroke="#94A3B8" strokeOpacity="0.35" strokeWidth="0.75" />

          {/* Scale bar (10 µm) */}
          <g transform="translate(284, 200)">
            <line x1="0" y1="0" x2="48" y2="0" stroke="#475569" strokeWidth="1.5" />
            <line x1="0" y1="-3" x2="0" y2="3" stroke="#475569" strokeWidth="1.2" />
            <line x1="48" y1="-3" x2="48" y2="3" stroke="#475569" strokeWidth="1.2" />
            <text
              x="24"
              y="-5"
              textAnchor="middle"
              fill="#475569"
              fontSize="8.5"
              fontFamily="IBM Plex Mono, monospace"
            >
              10 µm
            </text>
          </g>

          {/* Render Erythrocytes */}
          {cells.map((cell) => {
            const isSelected = selectedCell?.id === cell.id;
            const isGhost = cell.type === 'ghost';

            let fill = stain === 'panotico' ? '#E49BA6' : '#B9DCE9';
            let stroke = stain === 'panotico' ? '#B96473' : '#7FAFC3';
            let pallorFill = stain === 'panotico' ? '#FAF0F2' : '#E7F4F9';

            if (cell.type === 'polychromatic') {
              fill = '#A8A5D4';
              stroke = '#6B66A6';
              pallorFill = '#D7D5EC';
            } else if (cell.type === 'spherocyte') {
              fill = '#C24D62';
              stroke = '#8F2D40';
            } else if (cell.type === 'ghost') {
              fill = 'rgba(228, 155, 166, 0.12)';
              stroke = '#C8929B';
            } else if (cell.type === 'stippled') {
              fill = '#B9B1DA';
              stroke = '#766DA9';
              pallorFill = '#E2DEF0';
            }

            return (
              <g
                key={cell.id}
                transform={`translate(${cell.x}, ${cell.y})`}
                onClick={() => setSelectedCell(cell)}
                className="cursor-pointer"
              >
                <circle
                  r={cell.r}
                  fill={fill}
                  stroke={isSelected ? '#BE123C' : stroke}
                  strokeWidth={isSelected ? 2 : isGhost ? 1 : 1.1}
                  strokeDasharray={isGhost ? '2.5 2' : undefined}
                />

                {/* Central pallor */}
                {!isGhost && cell.pallorRatio > 0.05 && (
                  <circle
                    r={cell.r * cell.pallorRatio}
                    fill={pallorFill}
                    opacity={stain === 'panotico' ? 0.85 : 0.65}
                  />
                )}

                {/* Basophilic stippling (fine dark blue/purple ribosomal granules) */}
                {cell.type === 'stippled' && (
                  <g fill="#3730A3" opacity="0.88">
                    <circle cx={-cell.r * 0.4} cy={-cell.r * 0.2} r="1.2" />
                    <circle cx={cell.r * 0.35} cy={-cell.r * 0.32} r="1.1" />
                    <circle cx={-cell.r * 0.15} cy={cell.r * 0.42} r="1.2" />
                    <circle cx={cell.r * 0.42} cy={cell.r * 0.25} r="1.0" />
                    <circle cx={0} cy={-cell.r * 0.45} r="1.1" />
                    <circle cx={-cell.r * 0.45} cy={cell.r * 0.18} r="1.0" />
                  </g>
                )}

                {/* Heinz body protrusion */}
                {cell.type === 'heinz' && (
                  <circle
                    cx={cell.r * 0.84}
                    cy={-cell.r * 0.2}
                    r={cell.r * 0.32}
                    fill={stain === 'nmb' ? '#1D4ED8' : '#F3DCE0'}
                    stroke={stain === 'nmb' ? '#1E3A8A' : '#B96473'}
                    strokeWidth="1"
                  />
                )}

                {/* Supravital reticulocyte reticulum (aggregate vs punctate) */}
                {cell.type === 'reticulocyte_agg' && (
                  <path
                    d={`M ${-cell.r * 0.45} ${-cell.r * 0.15} Q ${-cell.r * 0.1} ${-cell.r * 0.55} ${cell.r * 0.35} ${-cell.r * 0.2} T ${cell.r * 0.25} ${cell.r * 0.38} Q ${-cell.r * 0.2} ${cell.r * 0.45} ${-cell.r * 0.4} ${cell.r * 0.1}`}
                    fill="none"
                    stroke="#1E3A8A"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                )}
                {cell.type === 'reticulocyte_punc' && (
                  <g fill="#1E40AF">
                    <circle cx={-cell.r * 0.25} cy={-cell.r * 0.1} r="1.2" />
                    <circle cx={cell.r * 0.22} cy={cell.r * 0.18} r="1.1" />
                  </g>
                )}

                {/* Hemoparasites */}
                {cell.type === 'parasite' && smear.parasite === 'anaplasma' && (
                  <circle
                    cx={cell.r * 0.55}
                    cy={-cell.r * 0.3}
                    r="2.4"
                    fill="#312E81"
                  />
                )}
                {cell.type === 'parasite' && smear.parasite === 'mycoplasma' && (
                  <g fill="#312E81">
                    <circle cx={cell.r * 0.72} cy={-cell.r * 0.35} r="1.4" />
                    <circle cx={cell.r * 0.85} cy={-cell.r * 0.08} r="1.4" />
                    <circle cx={cell.r * 0.74} cy={cell.r * 0.22} r="1.4" />
                  </g>
                )}
                {cell.type === 'parasite' && smear.parasite === 'theileria' && (
                  <g stroke="#312E81" strokeWidth="1.3" strokeLinecap="round">
                    <line x1="-3.5" y1="0" x2="3.5" y2="0" />
                    <line x1="0" y1="-3.5" x2="0" y2="3.5" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Optional callout rings when "Identificar achados" is enabled */}
          {showAnnotations &&
            calloutCells.map((cell, idx) => (
              <g key={`anno-${cell.id}`} pointerEvents="none">
                <circle
                  cx={cell.x}
                  cy={cell.y}
                  r={cell.r + 4}
                  fill="none"
                  stroke="#BE123C"
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                <circle cx={cell.x + cell.r + 4} cy={cell.y - cell.r - 2} r="7.5" fill="#BE123C" />
                <text
                  x={cell.x + cell.r + 4}
                  y={cell.y - cell.r + 1}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {idx + 1}
                </text>
              </g>
            ))}
        </svg>

        {/* Interactive inspection bar */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 px-1">
          <span>
            {selectedCell?.label ? (
              <>
                <strong className="font-semibold text-slate-900">Célula selecionada:</strong>{' '}
                {selectedCell.label}
              </>
            ) : stain === 'nmb' ? (
              species === 'equino' ? (
                'Novo Azul de Metileno: ausência fisiológica de reticulócitos no sangue periférico equino.'
              ) : (
                'Novo Azul de Metileno: clique em qualquer hemácia para inspecionar reticulócitos e corpúsculos de Heinz.'
              )
            ) : (
              'Clique em qualquer hemácia no campo microscópico para inspecionar sua morfologia.'
            )}
          </span>
          <span className="font-mono tabular-nums text-slate-500">
            Ø ref. {sp.rbcDiameterUm}
          </span>
        </div>

        {/* Numbered legend when annotations enabled */}
        {showAnnotations && calloutCells.length > 0 && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {calloutCells.map((cell, idx) => (
              <div key={`leg-${cell.id}`} className="flex items-start gap-2 text-xs text-slate-700">
                <span className="font-mono font-semibold text-rose-700 shrink-0">{idx + 1}.</span>
                <span>{cell.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Textual smear findings summary */}
      {smear.findingsSummary.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-200 bg-white">
          <div className="text-xs font-semibold text-slate-700 mb-1.5">
            Observações do esfregaço sanguíneo
          </div>
          <ul className="space-y-1 text-xs text-slate-600">
            {smear.findingsSummary.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-slate-400 select-none">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
