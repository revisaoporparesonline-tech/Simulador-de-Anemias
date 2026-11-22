export type SpeciesId = 'canino' | 'felino' | 'equino' | 'bovino';

export type VcmClassification = 'microcitica' | 'normocitica' | 'macrocitica';
export type ChcmClassification = 'hipocromica' | 'normocromica' | 'pseudo_hipercromica';
export type RegenerationClassification =
  | 'regenerativa'
  | 'arregenerativa'
  | 'pre_regenerativa'
  | 'avaliar_seriado';
export type MechanismClassification = 'hemorragia' | 'hemolise' | 'producao_diminuida';

export interface ReferenceRange {
  min: number;
  max: number;
  unit: string;
  decimals: number;
}

export interface SpeciesProfile {
  id: SpeciesId;
  name: string;
  plural: string;
  scientificName: string;
  imageUrl: string;
  rbcDiameterUm: string;
  centralPallorNote: string;
  reticulocyteRule: string;
  keyPeculiarity: string;
  smearPeculiarities: string[];
  refs: {
    rbc: ReferenceRange; // x10^6 / uL
    hb: ReferenceRange; // g/dL
    vg: ReferenceRange; // %
    vcm: ReferenceRange; // fL
    chcm: ReferenceRange; // g/dL
    rdw: ReferenceRange; // %
    ppt: ReferenceRange; // g/dL
  };
  reticulocyteThreshold: number | null; // null for equine (not released into peripheral blood)
  reticulocyteUnitLabel: string;
  sliderBounds: {
    rbc: [number, number, number]; // min, max, step
    hb: [number, number, number];
    vg: [number, number, number];
    ppt: [number, number, number];
    reticulocytes: [number, number, number];
  };
  healthyDefaults: {
    rbc: number;
    hb: number;
    vg: number;
    ppt: number;
    reticulocytes: number;
  };
}

export const SPECIES_PROFILES: Record<SpeciesId, SpeciesProfile> = {
  canino: {
    id: 'canino',
    name: 'Canino',
    plural: 'Caninos',
    scientificName: 'Canis lupus familiaris',
    imageUrl: '/src/assets/images/species_canine_clinical_1795373698771.jpg',
    rbcDiameterUm: '6,7 – 7,2 µm',
    centralPallorNote: 'Palidez central bem evidente e uniforme (discos bicôncavos profundos).',
    reticulocyteRule: 'Regenerativa quando reticulócitos absolutos > 60.000 /µL (resposta franca > 80.000 /µL).',
    keyPeculiarity:
      'Apresenta a resposta regenerativa medular mais vigorosa entre os animais domésticos, com pico entre 4 e 7 dias e fácil visualização de esferócitos devido à palidez central pronunciada.',
    smearPeculiarities: [
      'Maior diâmetro eritrocitário entre os quatro grupos, facilitando reconhecer esferócitos.',
      'Policromasia e anisocitose marcantes nas anemias regenerativas.',
      'Pontilhado basofílico é raro na regeneração simples (associar a intoxicação por chumbo).',
    ],
    refs: {
      rbc: { min: 5.5, max: 8.5, unit: '×10⁶/µL', decimals: 2 },
      hb: { min: 12.0, max: 18.0, unit: 'g/dL', decimals: 1 },
      vg: { min: 37, max: 55, unit: '%', decimals: 1 },
      vcm: { min: 60, max: 77, unit: 'fL', decimals: 1 },
      chcm: { min: 32, max: 36, unit: 'g/dL', decimals: 1 },
      rdw: { min: 12.0, max: 15.0, unit: '%', decimals: 1 },
      ppt: { min: 6.0, max: 8.0, unit: 'g/dL', decimals: 1 },
    },
    reticulocyteThreshold: 60000,
    reticulocyteUnitLabel: 'Reticulócitos absolutos (/µL)',
    sliderBounds: {
      rbc: [1.5, 9.5, 0.1],
      hb: [3.5, 20.0, 0.2],
      vg: [12, 60, 1],
      ppt: [3.5, 10.0, 0.1],
      reticulocytes: [0, 280000, 5000],
    },
    healthyDefaults: {
      rbc: 6.8,
      hb: 15.6,
      vg: 46,
      ppt: 6.8,
      reticulocytes: 25000,
    },
  },
  felino: {
    id: 'felino',
    name: 'Felino',
    plural: 'Felinos',
    scientificName: 'Felis catus',
    imageUrl: '/src/assets/images/species_feline_clinical_1795373697711.jpg',
    rbcDiameterUm: '5,5 – 6,3 µm',
    centralPallorNote: 'Palidez central discreta ou ausente; discreta anisocitose e rouleaux podem ser normais.',
    reticulocyteRule:
      'Avaliar reticulócitos AGREGADOS (> 50.000 /µL indica regeneração ativa). Reticulócitos pontilhados persistem por semanas e refletem resposta prévia.',
    keyPeculiarity:
      'Hemoglobina com 8 grupos sulfidrila reativos torna o gato altamente suscetível à formação de corpúsculos de Heinz. A diferenciação entre reticulócitos agregados e pontilhados é obrigatória.',
    smearPeculiarities: [
      'Apenas reticulócitos agregados representam eritropoiese ativa recente (< 24h na circulação).',
      'Até 5–10% de corpúsculos de Heinz pequenos podem ocorrer em gatos hígidos, mas aumentam drasticamente em injúria oxidativa.',
      'Esferócitos são difíceis de confirmar no gato pela pouca palidez central fisiológica.',
    ],
    refs: {
      rbc: { min: 5.0, max: 10.0, unit: '×10⁶/µL', decimals: 2 },
      hb: { min: 8.0, max: 15.0, unit: 'g/dL', decimals: 1 },
      vg: { min: 24, max: 45, unit: '%', decimals: 1 },
      vcm: { min: 39, max: 55, unit: 'fL', decimals: 1 },
      chcm: { min: 30, max: 36, unit: 'g/dL', decimals: 1 },
      rdw: { min: 14.0, max: 18.0, unit: '%', decimals: 1 },
      ppt: { min: 6.0, max: 8.0, unit: 'g/dL', decimals: 1 },
    },
    reticulocyteThreshold: 50000,
    reticulocyteUnitLabel: 'Reticulócitos agregados (/µL)',
    sliderBounds: {
      rbc: [1.4, 11.0, 0.1],
      hb: [3.0, 17.0, 0.2],
      vg: [10, 50, 1],
      ppt: [3.5, 10.5, 0.1],
      reticulocytes: [0, 220000, 5000],
    },
    healthyDefaults: {
      rbc: 7.6,
      hb: 12.2,
      vg: 36,
      ppt: 7.0,
      reticulocytes: 15000,
    },
  },
  equino: {
    id: 'equino',
    name: 'Equino',
    plural: 'Equinos',
    scientificName: 'Equus ferus caballus',
    imageUrl: '/src/assets/images/species_equine_clinical_1795373698385.jpg',
    rbcDiameterUm: '5,5 – 6,0 µm',
    centralPallorNote: 'Palidez central mínima; intensa formação fisiológica de rouleaux ("pilhas de moedas").',
    reticulocyteRule:
      'Equinos NÃO liberam reticulócitos no sangue periférico mesmo em anemias regenerativas. Avaliar regeneração por hemogramas seriados (elevação de VG/VCM/RDW) ou mielograma.',
    keyPeculiarity:
      'A ausência de reticulócitos periféricos (0 /µL) NUNCA confirma anemia arregenerativa em equinos. A resposta medular exige acompanhamento seriado (macrocitose progressiva e aumento do RDW) ou avaliação da medula óssea.',
    smearPeculiarities: [
      'Rouleaux proeminente é achado normal no esfregaço equino — não confundir com aglutinação verdadeira.',
      'Ausência de policromasia e de reticulócitos circulantes mesmo após hemorragia ou hemólise.',
      'Contração esplênica por estresse pode mascarar temporariamente a queda inicial do hematócrito.',
    ],
    refs: {
      rbc: { min: 6.8, max: 12.9, unit: '×10⁶/µL', decimals: 2 },
      hb: { min: 11.0, max: 19.0, unit: 'g/dL', decimals: 1 },
      vg: { min: 32, max: 53, unit: '%', decimals: 1 },
      vcm: { min: 37, max: 58, unit: 'fL', decimals: 1 },
      chcm: { min: 31, max: 38, unit: 'g/dL', decimals: 1 },
      rdw: { min: 16.0, max: 20.0, unit: '%', decimals: 1 },
      ppt: { min: 6.0, max: 7.7, unit: 'g/dL', decimals: 1 },
    },
    reticulocyteThreshold: null,
    reticulocyteUnitLabel: 'Reticulócitos periféricos (/µL)',
    sliderBounds: {
      rbc: [2.0, 13.5, 0.1],
      hb: [4.5, 20.5, 0.2],
      vg: [12, 58, 1],
      ppt: [3.5, 10.0, 0.1],
      reticulocytes: [0, 0, 1],
    },
    healthyDefaults: {
      rbc: 8.8,
      hb: 14.5,
      vg: 41,
      ppt: 6.8,
      reticulocytes: 0,
    },
  },
  bovino: {
    id: 'bovino',
    name: 'Bovino',
    plural: 'Bovinos',
    scientificName: 'Bos taurus / Bos indicus',
    imageUrl: '/src/assets/images/species_bovine_clinical_1795373697514.jpg',
    rbcDiameterUm: '5,0 – 6,0 µm',
    centralPallorNote: 'Palidez central discreta; discreta anisocitose fisiológica e ausência de rouleaux.',
    reticulocyteRule:
      'Bovinos adultos hígidos possuem 0 /µL de reticulócitos. Qualquer liberação periférica (> 0 /µL), acompanhada de policromasia e pontilhado basofílico, indica regeneração.',
    keyPeculiarity:
      'O pontilhado basofílico e a macrocitose acentuada são marcadores clássicos de resposta regenerativa fisiológica em ruminantes, aparecendo com frequência na Tristeza Parasitária Bovina.',
    smearPeculiarities: [
      'Pontilhado basofílico em bovinos anêmicos é sinal clássico de regeneração (agregação ribossomal).',
      'Ausência de formação de rouleaux em animais sadios.',
      'Reticulócitos circulantes estão ausentes no animal saudável; sua simples detecção já sinaliza resposta medular.',
    ],
    refs: {
      rbc: { min: 5.0, max: 10.0, unit: '×10⁶/µL', decimals: 2 },
      hb: { min: 8.0, max: 15.0, unit: 'g/dL', decimals: 1 },
      vg: { min: 24, max: 46, unit: '%', decimals: 1 },
      vcm: { min: 40, max: 60, unit: 'fL', decimals: 1 },
      chcm: { min: 30, max: 36, unit: 'g/dL', decimals: 1 },
      rdw: { min: 15.0, max: 20.0, unit: '%', decimals: 1 },
      ppt: { min: 6.7, max: 7.5, unit: 'g/dL', decimals: 1 },
    },
    reticulocyteThreshold: 1, // Any reticulocytes > 0 in adult cattle indicates regeneration
    reticulocyteUnitLabel: 'Reticulócitos absolutos (/µL)',
    sliderBounds: {
      rbc: [1.4, 10.5, 0.1],
      hb: [3.0, 16.5, 0.2],
      vg: [10, 50, 1],
      ppt: [3.8, 10.5, 0.1],
      reticulocytes: [0, 160000, 5000],
    },
    healthyDefaults: {
      rbc: 7.2,
      hb: 11.6,
      vg: 35,
      ppt: 7.1,
      reticulocytes: 0,
    },
  },
};

export const SPECIES_LIST: SpeciesId[] = ['canino', 'felino', 'equino', 'bovino'];

export const VCM_LABELS: Record<VcmClassification, string> = {
  microcitica: 'Microcítica (VCM diminuído)',
  normocitica: 'Normocítica (VCM normal)',
  macrocitica: 'Macrocítica (VCM elevado)',
};

export const CHCM_LABELS: Record<ChcmClassification, string> = {
  hipocromica: 'Hipocrômica (CHCM diminuída)',
  normocromica: 'Normocrômica (CHCM normal)',
  pseudo_hipercromica: 'Pseudo-hipercrômica (CHCM elevada — artefato/hemólise)',
};

export const REGENERATION_LABELS: Record<RegenerationClassification, string> = {
  regenerativa: 'Regenerativa',
  arregenerativa: 'Arregenerativa (Não-regenerativa)',
  pre_regenerativa: 'Pré-regenerativa (fase aguda < 72h)',
  avaliar_seriado: 'Indeterminada no exame isolado (seriado / mielograma)',
};

export const MECHANISM_LABELS: Record<MechanismClassification, string> = {
  hemorragia: 'Perda sanguínea (Hemorragia)',
  hemolise: 'Destruição acelerada (Hemólise)',
  producao_diminuida: 'Produção diminuída (Medular / Crônica)',
};

export function calculateVCM(vg: number, rbc: number): number {
  if (rbc <= 0) return 0;
  return Number(((vg * 10) / rbc).toFixed(1));
}

export function calculateCHCM(hb: number, vg: number): number {
  if (vg <= 0) return 0;
  return Number(((hb * 100) / vg).toFixed(1));
}

export function formatPtNumber(value: number, decimals = 1): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatInteger(value: number): string {
  return Math.round(value).toLocaleString('pt-BR');
}

export type ParamStatus = 'baixo' | 'normal' | 'alto';

export function getParamStatus(value: number, range: ReferenceRange): ParamStatus {
  if (value < range.min) return 'baixo';
  if (value > range.max) return 'alto';
  return 'normal';
}

export interface AutomatedClassification {
  isAnemic: boolean;
  anemiaSeverity: 'Ausente' | 'Leve' | 'Moderada' | 'Grave';
  vcm: number;
  chcm: number;
  vcmClass: VcmClassification;
  chcmClass: ChcmClassification;
  regenerationClass: RegenerationClassification;
  pptStatus: ParamStatus;
  morphologicalTitle: string;
  clinicalSummary: string;
  artifactWarning: string | null;
}

export function classifyLiveSample(
  speciesId: SpeciesId,
  rbc: number,
  hb: number,
  vg: number,
  ppt: number,
  reticulocytes: number
): AutomatedClassification {
  const sp = SPECIES_PROFILES[speciesId];
  const vcm = calculateVCM(vg, rbc);
  const chcm = calculateCHCM(hb, vg);

  const isAnemic = vg < sp.refs.vg.min || hb < sp.refs.hb.min || rbc < sp.refs.rbc.min;

  let anemiaSeverity: 'Ausente' | 'Leve' | 'Moderada' | 'Grave' = 'Ausente';
  if (isAnemic) {
    const ratio = vg / sp.refs.vg.min;
    if (ratio < 0.55) anemiaSeverity = 'Grave';
    else if (ratio < 0.8) anemiaSeverity = 'Moderada';
    else anemiaSeverity = 'Leve';
  }

  const vcmStatus = getParamStatus(vcm, sp.refs.vcm);
  const chcmStatus = getParamStatus(chcm, sp.refs.chcm);
  const pptStatus = getParamStatus(ppt, sp.refs.ppt);

  const vcmClass: VcmClassification =
    vcmStatus === 'baixo' ? 'microcitica' : vcmStatus === 'alto' ? 'macrocitica' : 'normocitica';

  const chcmClass: ChcmClassification =
    chcmStatus === 'baixo'
      ? 'hipocromica'
      : chcmStatus === 'alto'
        ? 'pseudo_hipercromica'
        : 'normocromica';

  let regenerationClass: RegenerationClassification = 'arregenerativa';
  if (speciesId === 'equino') {
    regenerationClass = vcmStatus === 'alto' ? 'avaliar_seriado' : 'avaliar_seriado';
  } else if (speciesId === 'bovino') {
    regenerationClass = reticulocytes > 0 ? 'regenerativa' : 'arregenerativa';
  } else {
    const threshold = sp.reticulocyteThreshold ?? 60000;
    regenerationClass = reticulocytes >= threshold ? 'regenerativa' : 'arregenerativa';
  }

  const vcmWord =
    vcmClass === 'microcitica'
      ? 'Microcítica'
      : vcmClass === 'macrocitica'
        ? 'Macrocítica'
        : 'Normocítica';

  const chcmWord =
    chcmClass === 'hipocromica'
      ? 'Hipocrômica'
      : chcmClass === 'pseudo_hipercromica'
        ? 'Pseudo-hipercrômica'
        : 'Normocrômica';

  const morphologicalTitle = isAnemic
    ? `Anemia ${vcmWord} ${chcmWord}`
    : `Sem anemia (${vcmWord} ${chcmWord})`;

  const artifactWarning =
    chcmClass === 'pseudo_hipercromica'
      ? 'Atenção: não existe hipercromia fisiológica verdadeira. CHCM acima da referência sugere hemólise in vitro/intravascular, lipemia ou corpúsculos de Heinz interferindo na leitura da hemoglobina.'
      : null;

  let clinicalSummary = '';
  if (!isAnemic) {
    clinicalSummary = `Eritrograma dentro dos limites esperados para ${sp.plural.toLowerCase()} adultos (VG ${formatPtNumber(vg, 1)}% na faixa ${sp.refs.vg.min}–${sp.refs.vg.max}%).`;
  } else if (speciesId === 'equino') {
    if (vcmClass === 'macrocitica') {
      clinicalSummary = `Em equinos, a ausência de reticulócitos periféricos é fisiológica. O VCM elevado (${formatPtNumber(vcm, 1)} fL) é um forte indício indireto de regeneração medular, devendo ser confirmado com hemogramas seriados ou mielograma.`;
    } else if (pptStatus === 'baixo') {
      clinicalSummary = `Anemia acompanhada de hipoproteinemia (PPT ${formatPtNumber(ppt, 1)} g/dL) sugere fortemente perda sanguínea (hemorragia). Como equinos não liberam reticulócitos no sangue, acompanhe o VG e o VCM em exames seriados.`;
    } else {
      clinicalSummary = `Equinos não liberam reticulócitos periféricos. Com VCM normal e PPT ${pptStatus === 'alto' ? 'elevada (sugerindo inflamação ou desidratação)' : 'normal'}, recomenda-se hemograma seriado em 48–72h ou avaliação medular para diferenciar resposta regenerativa de arregenerativa.`;
    }
  } else if (regenerationClass === 'regenerativa') {
    if (pptStatus === 'baixo') {
      clinicalSummary = `Resposta medular regenerativa ativa com hipoproteinemia concomitante (PPT ${formatPtNumber(ppt, 1)} g/dL) — padrão clássico de perda sanguínea (hemorragia externa ou cavitária com > 3–4 dias de evolução).`;
    } else {
      clinicalSummary = `Resposta medular regenerativa ativa com PPT ${pptStatus === 'alto' ? 'elevada' : 'normal'} — padrão compatível com anemia hemolítica (destruição eritrocitária) ou hemorragia interna com reabsorção proteica.`;
    }
  } else if (vcmClass === 'microcitica' && chcmClass === 'hipocromica') {
    clinicalSummary = `Padrão microcítico hipocrômico com baixa contagem de reticulócitos — clássico de deficiência de ferro por hemorragia crônica (ex.: parasitismo gastrointestinal ou úlcera).`;
  } else if (pptStatus === 'baixo') {
    clinicalSummary = `Anemia normocítica sem reticulocitose, associada à hipoproteinemia (PPT ${formatPtNumber(ppt, 1)} g/dL). Suspeite de hemorragia aguda em fase pré-regenerativa (< 72h), antes da liberação de reticulócitos pela medula.`;
  } else {
    clinicalSummary = `Anemia arregenerativa com PPT ${pptStatus === 'alto' ? 'elevada (compatível com inflamação crônica)' : 'normal'}. Investigar causas medulares ou sistêmicas: doença renal crônica, inflamação crônica, agentes mielotóxicos ou retroviroses.`;
  }

  return {
    isAnemic,
    anemiaSeverity,
    vcm,
    chcm,
    vcmClass,
    chcmClass,
    regenerationClass,
    pptStatus,
    morphologicalTitle,
    clinicalSummary,
    artifactWarning,
  };
}
