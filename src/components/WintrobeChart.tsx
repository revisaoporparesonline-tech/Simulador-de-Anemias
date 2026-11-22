import React from 'react';
import { formatPtNumber, SPECIES_PROFILES, SpeciesId } from '../data/species';

interface WintrobeChartProps {
  species: SpeciesId;
  vcm: number;
  chcm: number;
  isAnemic?: boolean;
  hidePoint?: boolean;
}

export const WintrobeChart: React.FC<WintrobeChartProps> = ({
  species,
  vcm,
  chcm,
  isAnemic = true,
  hidePoint = false,
}) => {
  const sp = SPECIES_PROFILES[species];

  // Dynamic coordinate bounds centered nicely around each species reference window
  const xMin = species === 'canino' ? 40 : 25;
  const xMax = species === 'canino' ? 100 : 80;
  const yMin = 24;
  const yMax = 44;

  const padLeft = 46;
  const padRight = 18;
  const padTop = 18;
  const padBottom = 38;
  const svgW = 420;
  const svgH = 220;
  const plotW = svgW - padLeft - padRight;
  const plotH = svgH - padTop - padBottom;

  const toX = (val: number) => {
    const clamped = Math.max(xMin, Math.min(xMax, val));
    return padLeft + ((clamped - xMin) / (xMax - xMin)) * plotW;
  };

  const toY = (val: number) => {
    const clamped = Math.max(yMin, Math.min(yMax, val));
    return padTop + plotH - ((clamped - yMin) / (yMax - yMin)) * plotH;
  };

  const refX1 = toX(sp.refs.vcm.min);
  const refX2 = toX(sp.refs.vcm.max);
  const refY1 = toY(sp.refs.chcm.max);
  const refY2 = toY(sp.refs.chcm.min);

  const ptX = toX(vcm);
  const ptY = toY(chcm);

  const xTicks =
    species === 'canino' ? [40, 50, 60, 70, 80, 90, 100] : [25, 35, 45, 55, 65, 75];
  const yTicks = [24, 28, 32, 36, 40, 44];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-900">
          Plano de Wintrobe (VCM × CHCM — {sp.name})
        </span>
        {!hidePoint && (
          <span className="text-xs font-mono tabular-nums text-slate-600">
            VCM {formatPtNumber(vcm, 1)} fL · CHCM {formatPtNumber(chcm, 1)} g/dL
          </span>
        )}
      </div>

      <div className="p-3">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full h-auto block"
          role="img"
          aria-label={`Gráfico de classificação morfológica VCM por CHCM para ${sp.name}`}
        >
          {/* Artifact upper band (CHCM > max) */}
          <rect
            x={padLeft}
            y={padTop}
            width={plotW}
            height={Math.max(0, refY1 - padTop)}
            fill="#FEF2F2"
          />

          {/* Hypochromic lower band (CHCM < min) */}
          <rect
            x={padLeft}
            y={refY2}
            width={plotW}
            height={Math.max(0, padTop + plotH - refY2)}
            fill="#F8FAFC"
          />

          {/* Species Normal Reference Zone */}
          <rect
            x={refX1}
            y={refY1}
            width={Math.max(0, refX2 - refX1)}
            height={Math.max(0, refY2 - refY1)}
            fill="#ECFDF5"
            stroke="#059669"
            strokeWidth="1.25"
          />

          {/* Reference threshold guide lines */}
          <line
            x1={refX1}
            y1={padTop}
            x2={refX1}
            y2={padTop + plotH}
            stroke="#94A3B8"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <line
            x1={refX2}
            y1={padTop}
            x2={refX2}
            y2={padTop + plotH}
            stroke="#94A3B8"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <line
            x1={padLeft}
            y1={refY1}
            x2={padLeft + plotW}
            y2={refY1}
            stroke="#94A3B8"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <line
            x1={padLeft}
            y1={refY2}
            x2={padLeft + plotW}
            y2={refY2}
            stroke="#94A3B8"
            strokeDasharray="3 3"
            strokeWidth="1"
          />

          {/* Quadrant labels */}
          <text
            x={(padLeft + refX1) / 2}
            y={padTop + plotH - 8}
            textAnchor="middle"
            fill="#64748B"
            fontSize="8.5"
          >
            Microcítica Hipocrômica
          </text>
          <text
            x={(refX1 + refX2) / 2}
            y={(refY1 + refY2) / 2 + 3}
            textAnchor="middle"
            fill="#047857"
            fontSize="8.5"
            fontWeight="600"
          >
            Normocítica Normocrômica
          </text>
          <text
            x={(refX2 + padLeft + plotW) / 2}
            y={padTop + plotH - 8}
            textAnchor="middle"
            fill="#64748B"
            fontSize="8.5"
          >
            Macrocítica Hipocrômica
          </text>
          <text
            x={padLeft + plotW - 6}
            y={padTop + 12}
            textAnchor="end"
            fill="#B91C1C"
            fontSize="8.5"
            fontWeight="500"
          >
            Zona de artefato / hemólise (CHCM ↑)
          </text>

          {/* Axes */}
          <line
            x1={padLeft}
            y1={padTop + plotH}
            x2={padLeft + plotW}
            y2={padTop + plotH}
            stroke="#CBD5E1"
            strokeWidth="1"
          />
          <line
            x1={padLeft}
            y1={padTop}
            x2={padLeft}
            y2={padTop + plotH}
            stroke="#CBD5E1"
            strokeWidth="1"
          />

          {/* X Ticks */}
          {xTicks.map((t) => (
            <g key={`xt-${t}`} transform={`translate(${toX(t)}, ${padTop + plotH})`}>
              <line y2="4" stroke="#94A3B8" strokeWidth="1" />
              <text
                y="14"
                textAnchor="middle"
                fill="#64748B"
                fontSize="8.5"
                fontFamily="IBM Plex Mono, monospace"
              >
                {t}
              </text>
            </g>
          ))}

          {/* Y Ticks */}
          {yTicks.map((t) => (
            <g key={`yt-${t}`} transform={`translate(${padLeft}, ${toY(t)})`}>
              <line x2="-4" stroke="#94A3B8" strokeWidth="1" />
              <text
                x="-7"
                y="3"
                textAnchor="end"
                fill="#64748B"
                fontSize="8.5"
                fontFamily="IBM Plex Mono, monospace"
              >
                {t}
              </text>
            </g>
          ))}

          {/* Axis Titles */}
          <text
            x={padLeft + plotW / 2}
            y={svgH - 5}
            textAnchor="middle"
            fill="#334155"
            fontSize="9.5"
            fontWeight="600"
          >
            VCM (fL) — Tamanho Eritrocitário
          </text>
          <text
            x="12"
            y={padTop + plotH / 2}
            textAnchor="middle"
            fill="#334155"
            fontSize="9.5"
            fontWeight="600"
            transform={`rotate(-90, 12, ${padTop + plotH / 2})`}
          >
            CHCM (g/dL)
          </text>

          {/* Live Plotted Patient Coordinate */}
          {!hidePoint && (
            <g>
              <line
                x1={ptX}
                y1={padTop}
                x2={ptX}
                y2={padTop + plotH}
                stroke="#BE123C"
                strokeOpacity="0.28"
                strokeWidth="1"
              />
              <line
                x1={padLeft}
                y1={ptY}
                x2={padLeft + plotW}
                y2={ptY}
                stroke="#BE123C"
                strokeOpacity="0.28"
                strokeWidth="1"
              />
              <circle
                cx={ptX}
                cy={ptY}
                r="6.5"
                fill={isAnemic ? '#BE123C' : '#059669'}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
