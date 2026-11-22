import React, { useEffect, useState } from 'react';
import { Calculator, Check, RotateCcw } from 'lucide-react';
import {
  formatInteger,
  formatPtNumber,
  getParamStatus,
  ParamStatus,
  ReferenceRange,
  SPECIES_PROFILES,
  SpeciesId,
} from '../data/species';

export interface CbcValues {
  rbc: number;
  hb: number;
  vg: number;
  vcm: number;
  chcm: number;
  rdw: number;
  ppt: number;
  reticulocytes: number;
  reticulocyteDetail?: string;
  plasmaAspect?: string;
}

interface CbcTableProps {
  species: SpeciesId;
  cbc: CbcValues;
  manualCalcMode?: boolean;
  onToggleManualCalc?: () => void;
  revealed?: boolean;
}

function StatusCell({ status }: { status: ParamStatus }) {
  if (status === 'baixo') {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-sky-800 whitespace-nowrap">
        <span aria-hidden="true">▼</span>
        Baixo
      </span>
    );
  }
  if (status === 'alto') {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-rose-700 whitespace-nowrap">
        <span aria-hidden="true">▲</span>
        Alto
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-emerald-700 whitespace-nowrap">
      <span aria-hidden="true">●</span>
      Normal
    </span>
  );
}

function RangeBar({ value, range }: { value: number; range: ReferenceRange }) {
  const span = range.max - range.min;
  const viewMin = Math.max(0, range.min - span * 0.75);
  const viewMax = range.max + span * 0.75;
  const total = viewMax - viewMin || 1;

  const refLeft = ((range.min - viewMin) / total) * 100;
  const refWidth = ((range.max - range.min) / total) * 100;
  const clamped = Math.max(viewMin, Math.min(viewMax, value));
  const markerLeft = ((clamped - viewMin) / total) * 100;

  const status = getParamStatus(value, range);
  const markerColor =
    status === 'baixo' ? 'bg-sky-700' : status === 'alto' ? 'bg-rose-700' : 'bg-emerald-600';

  return (
    <div className="relative h-2 w-24 bg-slate-100 rounded-full overflow-hidden shrink-0" aria-hidden="true">
      <div
        className="absolute top-0 bottom-0 bg-emerald-200/75"
        style={{ left: `${refLeft}%`, width: `${refWidth}%` }}
      />
      <div
        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-white ${markerColor}`}
        style={{ left: `${markerLeft}%` }}
      />
    </div>
  );
}

export const CbcTable: React.FC<CbcTableProps> = ({
  species,
  cbc,
  manualCalcMode = false,
  onToggleManualCalc,
  revealed = false,
}) => {
  const sp = SPECIES_PROFILES[species];

  const [vcmInput, setVcmInput] = useState('');
  const [chcmInput, setChcmInput] = useState('');
  const [calcChecked, setCalcChecked] = useState(false);

  useEffect(() => {
    setVcmInput('');
    setChcmInput('');
    setCalcChecked(false);
  }, [species, cbc.rbc, cbc.hb, cbc.vg, manualCalcMode]);

  const parsedVcm = parseFloat(vcmInput.replace(',', '.'));
  const parsedChcm = parseFloat(chcmInput.replace(',', '.'));
  const vcmCorrect = !Number.isNaN(parsedVcm) && Math.abs(parsedVcm - cbc.vcm) <= 0.6;
  const chcmCorrect = !Number.isNaN(parsedChcm) && Math.abs(parsedChcm - cbc.chcm) <= 0.6;

  const showCalculatedIndices = !manualCalcMode || revealed || (calcChecked && vcmCorrect && chcmCorrect);

  const primaryRows: Array<{
    key: string;
    label: string;
    value: number;
    range: ReferenceRange;
    isWintrobe?: 'vcm' | 'chcm';
  }> = [
    { key: 'rbc', label: 'Hemácias (RBC)', value: cbc.rbc, range: sp.refs.rbc },
    { key: 'hb', label: 'Hemoglobina (Hb)', value: cbc.hb, range: sp.refs.hb },
    { key: 'vg', label: 'Hematócrito (VG)', value: cbc.vg, range: sp.refs.vg },
    { key: 'vcm', label: 'VCM', value: cbc.vcm, range: sp.refs.vcm, isWintrobe: 'vcm' },
    { key: 'chcm', label: 'CHCM', value: cbc.chcm, range: sp.refs.chcm, isWintrobe: 'chcm' },
    { key: 'rdw', label: 'RDW', value: cbc.rdw, range: sp.refs.rdw },
    { key: 'ppt', label: 'Proteína Plasmática Total (PPT)', value: cbc.ppt, range: sp.refs.ppt },
  ];

  // Reticulocyte status per species
  const reticStatus = (() => {
    if (species === 'equino') {
      return { text: '● Fisiológico (0)', tone: 'text-slate-600' };
    }
    if (species === 'bovino') {
      return cbc.reticulocytes > 0
        ? { text: '▲ Elevado', tone: 'text-rose-700' }
        : { text: '● Ausente (0)', tone: 'text-slate-600' };
    }
    const threshold = sp.reticulocyteThreshold ?? 60000;
    return cbc.reticulocytes >= threshold
      ? { text: '▲ Regenerativo', tone: 'text-rose-700' }
      : { text: '● Sem resposta', tone: 'text-slate-600' };
  })();

  const reticRefLabel =
    species === 'equino'
      ? '0 /µL (não libera)'
      : species === 'bovino'
        ? '0 /µL (> 0 regenera)'
        : species === 'felino'
          ? '< 50.000 /µL (agreg.)'
          : '< 60.000 /µL';

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Eritrograma e Proteínas Plasmáticas
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Referência laboratorial para {sp.plural.toLowerCase()} adultos ({sp.scientificName})
          </p>
        </div>

        {onToggleManualCalc && (
          <button
            type="button"
            onClick={onToggleManualCalc}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              manualCalcMode
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" aria-hidden="true" />
            {manualCalcMode ? 'Modo Cálculo: Ativo' : 'Praticar cálculo VCM/CHCM'}
          </button>
        )}
      </div>

      {/* Formula strip when manual calculation mode is active */}
      {manualCalcMode && !showCalculatedIndices && (
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="font-mono text-slate-700 space-x-4">
            <span>VCM = (VG × 10) / Hemácias</span>
            <span>CHCM = (Hb × 100) / VG</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCalcChecked(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              Conferir cálculo
            </button>
            {calcChecked && (!vcmCorrect || !chcmCorrect) && (
              <button
                type="button"
                onClick={() => {
                  setVcmInput(formatPtNumber(cbc.vcm, 1));
                  setChcmInput(formatPtNumber(cbc.chcm, 1));
                  setCalcChecked(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-slate-300 bg-white text-slate-700 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                Revelar valores
              </button>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-500">
              <th className="py-2.5 pl-4 pr-3">Parâmetro</th>
              <th className="py-2.5 px-3 text-right">Resultado</th>
              <th className="py-2.5 px-3 hidden sm:table-cell">Faixa Visual</th>
              <th className="py-2.5 px-3 text-right">Referência</th>
              <th className="py-2.5 pl-3 pr-4 text-right">Leitura</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {primaryRows.map((row) => {
              const status = getParamStatus(row.value, row.range);
              const isHiddenWintrobe = Boolean(row.isWintrobe) && !showCalculatedIndices;

              return (
                <tr key={row.key} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 pl-4 pr-3 font-medium text-slate-800 whitespace-nowrap">
                    {row.label}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                    {isHiddenWintrobe ? (
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={row.isWintrobe === 'vcm' ? vcmInput : chcmInput}
                          onChange={(e) => {
                            if (row.isWintrobe === 'vcm') setVcmInput(e.target.value);
                            else setChcmInput(e.target.value);
                            if (calcChecked) setCalcChecked(false);
                          }}
                          placeholder="0,0"
                          aria-label={`Digite o valor calculado para ${row.label}`}
                          className={`w-16 px-2 py-1 text-right text-xs font-mono border rounded-md bg-white ${
                            calcChecked
                              ? (row.isWintrobe === 'vcm' ? vcmCorrect : chcmCorrect)
                                ? 'border-emerald-500 text-emerald-800 bg-emerald-50/40'
                                : 'border-rose-400 text-rose-800 bg-rose-50/40'
                              : 'border-slate-300 text-slate-900'
                          }`}
                        />
                        <span className="text-xs text-slate-400">{row.range.unit}</span>
                      </div>
                    ) : (
                      <>
                        <span className="font-semibold text-slate-900">
                          {formatPtNumber(row.value, row.range.decimals)}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">{row.range.unit}</span>
                      </>
                    )}
                  </td>

                  <td className="py-2.5 px-3 hidden sm:table-cell">
                    {isHiddenWintrobe ? (
                      <span className="text-xs text-slate-400 font-mono">Calcule acima</span>
                    ) : (
                      <RangeBar value={row.value} range={row.range} />
                    )}
                  </td>

                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-xs text-slate-500 whitespace-nowrap">
                    {formatPtNumber(row.range.min, row.range.decimals)} –{' '}
                    {formatPtNumber(row.range.max, row.range.decimals)}
                  </td>

                  <td className="py-2.5 pl-3 pr-4 text-right">
                    {isHiddenWintrobe ? (
                      <span className="text-xs text-slate-400 font-mono">
                        {calcChecked
                          ? (row.isWintrobe === 'vcm' ? vcmCorrect : chcmCorrect)
                            ? '✓ Certo'
                            : '✕ Revisar'
                          : '—'}
                      </span>
                    ) : (
                      <StatusCell status={status} />
                    )}
                  </td>
                </tr>
              );
            })}

            {/* Reticulocytes row */}
            <tr className="bg-slate-50/40">
              <td className="py-2.5 pl-4 pr-3 font-medium text-slate-800">
                <div>{sp.reticulocyteUnitLabel}</div>
                {cbc.reticulocyteDetail && (
                  <div className="text-xs font-normal text-slate-500 mt-0.5">
                    {cbc.reticulocyteDetail}
                  </div>
                )}
              </td>
              <td className="py-2.5 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                <span className="font-semibold text-slate-900">
                  {formatInteger(cbc.reticulocytes)}
                </span>
                <span className="text-xs text-slate-400 ml-1">/µL</span>
              </td>
              <td className="py-2.5 px-3 hidden sm:table-cell text-xs text-slate-500">
                {species === 'equino' ? 'Ausentes no sangue' : 'Avaliação medular'}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-xs text-slate-500 whitespace-nowrap">
                {reticRefLabel}
              </td>
              <td className="py-2.5 pl-3 pr-4 text-right">
                <span className={`font-mono text-xs font-medium whitespace-nowrap ${reticStatus.tone}`}>
                  {reticStatus.text}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {cbc.plasmaAspect && (
        <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-600">
            <strong className="font-semibold text-slate-800">Aspecto do plasma:</strong>{' '}
            {cbc.plasmaAspect}
          </span>
          <span className="font-mono text-slate-500">
            VCM = (VG × 10) / RBC · CHCM = (Hb × 100) / VG
          </span>
        </div>
      )}
    </div>
  );
};
