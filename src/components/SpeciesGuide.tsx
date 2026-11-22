import React from 'react';
import { formatPtNumber, SPECIES_LIST, SPECIES_PROFILES } from '../data/species';
import { SpeciesPortrait } from './SpeciesPortrait';

interface CellAtlasEntry {
  id: string;
  name: string;
  speciesNote: string;
  meaning: string;
  renderCell: () => React.ReactNode;
}

const CELL_ATLAS: CellAtlasEntry[] = [
  {
    id: 'normocyte',
    name: 'Normócito Normocrômico',
    speciesNote: 'Referência fisiológica (mais palidez central no cão)',
    meaning: 'Tamanho e concentração de hemoglobina dentro da faixa normal da espécie.',
    renderCell: () => (
      <g>
        <circle cx="32" cy="32" r="20" fill="#E49BA6" stroke="#B96473" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="7" fill="#FAF0F2" />
      </g>
    ),
  },
  {
    id: 'microcyte',
    name: 'Micrócito Hipocrômico',
    speciesNote: 'Deficiência de ferro / hemorragia crônica',
    meaning: 'Diâmetro reduzido (VCM ↓) e halo central pálido amplo (CHCM ↓).',
    renderCell: () => (
      <g>
        <circle cx="32" cy="32" r="14.5" fill="#E49BA6" stroke="#B96473" strokeWidth="1.4" />
        <circle cx="32" cy="32" r="9.5" fill="#FDF8F9" />
      </g>
    ),
  },
  {
    id: 'polychromatophil',
    name: 'Macrócito Policromático',
    speciesNote: 'Caninos, felinos e bovinos (ausente em equinos)',
    meaning: 'Eritrócito jovem maior (VCM ↑) de tom azulado/acinzentado por RNA residual — indica regeneração.',
    renderCell: () => (
      <g>
        <circle cx="32" cy="32" r="23" fill="#A8A5D4" stroke="#6B66A6" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="5" fill="#D7D5EC" />
      </g>
    ),
  },
  {
    id: 'spherocyte',
    name: 'Esferócito',
    speciesNote: 'Altamente confiável em Caninos (AHIM)',
    meaning: 'Hemácia menor, densamente corada e sem palidez central por perda parcial de membrana.',
    renderCell: () => (
      <circle cx="32" cy="32" r="15.5" fill="#C24D62" stroke="#8F2D40" strokeWidth="1.5" />
    ),
  },
  {
    id: 'heinz',
    name: 'Corpúsculo de Heinz',
    speciesNote: 'Muito frequente em Felinos e Equinos (injúria oxidativa)',
    meaning: 'Precipitação de hemoglobina desnaturada projetando-se na membrana; pode elevar falsamente a CHCM.',
    renderCell: () => (
      <g>
        <circle cx="30" cy="32" r="18" fill="#E49BA6" stroke="#B96473" strokeWidth="1.5" />
        <circle cx="46" cy="28" r="6" fill="#F3DCE0" stroke="#B96473" strokeWidth="1.4" />
      </g>
    ),
  },
  {
    id: 'stippling',
    name: 'Pontilhado Basofílico',
    speciesNote: 'Clássico de regeneração em Bovinos',
    meaning: 'Grânulos azul-escuros dispersos (agregados ribossomais). Em bovinos anêmicos confirma regeneração.',
    renderCell: () => (
      <g>
        <circle cx="32" cy="32" r="21" fill="#B9B1DA" stroke="#766DA9" strokeWidth="1.5" />
        <g fill="#3730A3">
          <circle cx="24" cy="26" r="1.6" />
          <circle cx="39" cy="25" r="1.5" />
          <circle cx="32" cy="20" r="1.5" />
          <circle cx="26" cy="39" r="1.6" />
          <circle cx="38" cy="38" r="1.6" />
          <circle cx="43" cy="32" r="1.4" />
          <circle cx="21" cy="33" r="1.4" />
        </g>
      </g>
    ),
  },
  {
    id: 'rouleaux',
    name: 'Rouleaux ("Pilhas de Moedas")',
    speciesNote: 'Fisiológico em Equinos · Aumentado em hiperglobulinemia',
    meaning: 'Empilhamento linear reversível de hemácias; não confundir com autoaglutinação imunomediada.',
    renderCell: () => (
      <g>
        <circle cx="18" cy="34" r="13" fill="#E49BA6" stroke="#B96473" strokeWidth="1.4" />
        <circle cx="28" cy="32" r="13" fill="#E49BA6" stroke="#B96473" strokeWidth="1.4" />
        <circle cx="38" cy="30" r="13" fill="#E49BA6" stroke="#B96473" strokeWidth="1.4" />
        <circle cx="48" cy="28" r="13" fill="#E49BA6" stroke="#B96473" strokeWidth="1.4" />
      </g>
    ),
  },
  {
    id: 'ghost',
    name: 'Célula Fantasma (Ghost Cell)',
    speciesNote: 'Hemólise intravascular em todas as espécies',
    meaning: 'Membrana eritrocitária vazia após lise intravascular; costuma acompanhar plasma avermelhado e CHCM ↑.',
    renderCell: () => (
      <circle
        cx="32"
        cy="32"
        r="19"
        fill="rgba(228, 155, 166, 0.14)"
        stroke="#B96473"
        strokeWidth="1.5"
        strokeDasharray="3.5 2.5"
      />
    ),
  },
];

export const SpeciesGuide: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="pb-5 border-b border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">
          Guia Comparativo de Espécies e Classificação das Anemias
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl">
          Referências fisiológicas do eritrograma, fórmulas de Wintrobe e particularidades eritroides essenciais para interpretar hemogramas de caninos, felinos, equinos e bovinos sem armadilhas diagnósticas.
        </p>
      </div>

      {/* 1. Comparative Reference Intervals Table */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">
            01. Intervalos de Referência Comparados (Adultos)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Valores de referência adotados no simulador (baseados em Thrall / Schalm)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-500">
                <th className="py-3 pl-5 pr-4">Parâmetro (Unidade)</th>
                {SPECIES_LIST.map((spId) => (
                  <th key={spId} className="py-3 px-4 text-right whitespace-nowrap">
                    {SPECIES_PROFILES[spId].plural}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {(
                [
                  { key: 'rbc', label: 'Hemácias (×10⁶/µL)' },
                  { key: 'hb', label: 'Hemoglobina (g/dL)' },
                  { key: 'vg', label: 'Hematócrito / VG (%)' },
                  { key: 'vcm', label: 'VCM (fL)' },
                  { key: 'chcm', label: 'CHCM (g/dL)' },
                  { key: 'rdw', label: 'RDW (%)' },
                  { key: 'ppt', label: 'Proteína Plasmática Total (g/dL)' },
                ] as const
              ).map((row) => (
                <tr key={row.key} className="hover:bg-slate-50/60">
                  <td className="py-2.5 pl-5 pr-4 font-medium text-slate-800 whitespace-nowrap">
                    {row.label}
                  </td>
                  {SPECIES_LIST.map((spId) => {
                    const r = SPECIES_PROFILES[spId].refs[row.key];
                    return (
                      <td
                        key={spId}
                        className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap"
                      >
                        {formatPtNumber(r.min, r.decimals)} – {formatPtNumber(r.max, r.decimals)}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="bg-slate-50/60">
                <td className="py-3 pl-5 pr-4 font-medium text-slate-800 whitespace-nowrap">
                  Critério de Reticulócitos
                </td>
                <td className="py-3 px-4 text-right font-mono text-xs text-slate-700 whitespace-nowrap">
                  &gt; 60.000 /µL
                </td>
                <td className="py-3 px-4 text-right font-mono text-xs text-slate-700 whitespace-nowrap">
                  &gt; 50.000 /µL (agreg.)
                </td>
                <td className="py-3 px-4 text-right font-mono text-xs text-rose-700 font-medium whitespace-nowrap">
                  0 /µL (não libera)
                </td>
                <td className="py-3 px-4 text-right font-mono text-xs text-slate-700 whitespace-nowrap">
                  &gt; 0 /µL (normal = 0)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Species Profiles Grid */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">
          02. Particularidades Fisiológicas por Espécie
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SPECIES_LIST.map((spId) => {
            const sp = SPECIES_PROFILES[spId];
            return (
              <article
                key={spId}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
              >
                <div className="p-5 flex items-start gap-4 border-b border-slate-100">
                  <SpeciesPortrait
                    species={spId}
                    className="w-24 h-20 rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 italic">{sp.scientificName}</div>
                    <h4 className="text-lg font-semibold text-slate-900">{sp.plural}</h4>
                    <div className="text-xs font-mono text-slate-600 mt-1">
                      Ø eritrócito: {sp.rbcDiameterUm}
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3 text-sm flex-1">
                  <p className="text-slate-700 leading-relaxed">{sp.keyPeculiarity}</p>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-800 mb-1">
                      Regra de regeneração
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{sp.reticulocyteRule}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-800 mb-1">
                      Achados-chave no esfregaço
                    </div>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {sp.smearPeculiarities.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-slate-400 select-none">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3. Structured Reading Algorithm */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <h3 className="text-base font-semibold text-slate-900">
          03. Roteiro Sistemático de Leitura do Eritrograma
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-mono text-xs font-semibold text-rose-700">Passo 1</div>
            <h4 className="text-sm font-semibold text-slate-900">Confirmar a Anemia</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verifique redução de VG, Hemoglobina e/ou Hemácias abaixo da faixa da espécie. Avalie o estado de hidratação (desidratação mascara anemia leve).
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-mono text-xs font-semibold text-rose-700">Passo 2</div>
            <h4 className="text-sm font-semibold text-slate-900">Índices de Wintrobe</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calcule ou leia <span className="font-mono text-slate-800">VCM = (VG×10)/RBC</span> (tamanho) e <span className="font-mono text-slate-800">CHCM = (Hb×100)/VG</span> (concentração). CHCM ↑ indica artefato/hemólise.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-mono text-xs font-semibold text-rose-700">Passo 3</div>
            <h4 className="text-sm font-semibold text-slate-900">Resposta Medular</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use reticulócitos absolutos (cão), agregados (gato), presença &gt; 0 + pontilhado basofílico (bovino) ou hemograma seriado/mielograma (equino). Considere a latência de 48–72h!
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-mono text-xs font-semibold text-rose-700">Passo 4</div>
            <h4 className="text-sm font-semibold text-slate-900">PPT e Esfregaço</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              PPT ↓ com VG ↓ sugere hemorragia. PPT normal/↑ + icterícia/esferócitos/Heinz/hemoparasitas sugere hemólise. Arregenerativa crônica com PPT normal/↑ sugere falha de produção.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Visual Erythrocyte Morphology Atlas */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">
          04. Atlas Morfológico Eritrocitário
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CELL_ATLAS.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <svg
                  viewBox="0 0 64 64"
                  className="w-14 h-14 rounded-lg border border-slate-200 bg-[#FAF4F6] shrink-0"
                  aria-hidden="true"
                >
                  {entry.renderCell()}
                </svg>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                    {entry.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {entry.speciesNote}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{entry.meaning}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
