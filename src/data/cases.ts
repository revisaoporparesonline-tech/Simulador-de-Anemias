import {
  ChcmClassification,
  MechanismClassification,
  RegenerationClassification,
  SpeciesId,
  VcmClassification,
} from './species';

export type CaseDifficulty = 'basico' | 'intermediario' | 'avancado';

export interface SmearProfile {
  polychromasia: number; // 0 to 3
  anisocytosis: number; // 0 to 3
  hypochromia: number; // 0 to 3
  spherocytes: boolean;
  heinzBodies: boolean;
  basophilicStippling: boolean;
  rouleaux: boolean;
  hemolysisArtifact: boolean;
  parasite?: 'mycoplasma' | 'anaplasma' | 'theileria' | null;
  findingsSummary: string[];
}

export interface ClinicalCase {
  id: string;
  code: string;
  species: SpeciesId;
  difficulty: CaseDifficulty;
  title: string;
  patientName: string;
  signalment: string;
  history: string;
  physicalExam: string;
  labNotes: string[];
  cbc: {
    rbc: number;
    hb: number;
    vg: number;
    vcm: number;
    chcm: number;
    rdw: number;
    ppt: number;
    reticulocytes: number;
    reticulocyteDetail: string;
    plasmaAspect: string;
  };
  smear: SmearProfile;
  hints: string[];
  solution: {
    vcm: VcmClassification;
    chcm: ChcmClassification;
    regeneration: RegenerationClassification;
    mechanism: MechanismClassification;
    diagnosis: string;
    explanation: string;
    keyTakeaway: string;
  };
}

export const DIFFICULTY_LABELS: Record<CaseDifficulty, string> = {
  basico: 'Básico',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

export const CLINICAL_CASES: ClinicalCase[] = [
  // ==================== CANINOS ====================
  {
    id: 'can-01',
    code: 'HEM-C01',
    species: 'canino',
    difficulty: 'basico',
    title: 'Mucosas ictéricas e prostração súbita',
    patientName: 'Mel',
    signalment: 'Cocker Spaniel, fêmea, 5 anos',
    history:
      'Tutor relata apatia progressiva há 4 dias, intolerância ao exercício e urina de coloração alaranjada escura.',
    physicalExam:
      'Mucosas pálidas a ictéricas, taquicardia (148 bpm), sopro sistólico grau II/VI e esplenomegalia moderada.',
    labNotes: [
      'Aglutinação macroscópica positiva em lâmina (não dispersa após diluição com salina).',
      'Leucocitose neutrofílica com leve desvio à esquerda (leucograma inflamatório).',
    ],
    cbc: {
      rbc: 2.4,
      hb: 6.2,
      vg: 21.0,
      vcm: 87.5,
      chcm: 29.5,
      rdw: 21.4,
      ppt: 7.4,
      reticulocytes: 185000,
      reticulocyteDetail: '185.000 /µL (reticulocitose acentuada)',
      plasmaAspect: 'Ictérico (+++)',
    },
    smear: {
      polychromasia: 3,
      anisocytosis: 3,
      hypochromia: 2,
      spherocytes: true,
      heinzBodies: false,
      basophilicStippling: false,
      rouleaux: false,
      hemolysisArtifact: false,
      parasite: null,
      findingsSummary: [
        'Policromasia intensa (+++) e anisocitose acentuada (+++)',
        'Esferócitos frequentes (hemácias menores, intensamente coradas, sem palidez central)',
        'Presença ocasional de metarrubrícitos (eritroblastos)',
      ],
    },
    hints: [
      'Compare o VCM (87,5 fL) e a CHCM (29,5 g/dL) com a referência canina (60–77 fL e 32–36 g/dL).',
      'Reticulócitos absolutos > 60.000 /µL no cão confirmam resposta medular ativa.',
      'Observe a PPT normal (7,4 g/dL), o plasma ictérico e a presença de esferócitos no esfregaço.',
    ],
    solution: {
      vcm: 'macrocitica',
      chcm: 'hipocromica',
      regeneration: 'regenerativa',
      mechanism: 'hemolise',
      diagnosis: 'Anemia Hemolítica Imunomediada (AHIM)',
      explanation:
        'A liberação intensa de reticulócitos (185.000 /µL) pela medula óssea eleva o VCM (macrocitose) e reduz a CHCM (hipocromia), pois os eritrócitos jovens são maiores e ainda estão completando a síntese de hemoglobina. A PPT preservada afasta perda externa significativa, enquanto o plasma ictérico, os esferócitos e a autoaglutinação confirmam hemólise imunomediada.',
      keyTakeaway:
        'No cão, esferócitos são facilmente reconhecidos pela perda da palidez central fisiológica e apontam fortemente para hemólise extravascular imunomediada.',
    },
  },
  {
    id: 'can-02',
    code: 'HEM-C02',
    species: 'canino',
    difficulty: 'intermediario',
    title: 'Fezes enegrecidas e emagrecimento crônico',
    patientName: 'Thor',
    signalment: 'SRD, macho, 2 anos',
    history:
      'Resgatado recentemente de área rural sem histórico de vermifugação. Apresenta fezes pastosas escurecidas (melena) há várias semanas.',
    physicalExam:
      'Escore corporal 3/9, mucosas hipocoradas, TPC 2,5 segundos, leve desconforto abdominal à palpação.',
    labNotes: [
      'Plaquetose reativa moderada (590.000 /µL), frequentemente observada em perdas crônicas de ferro.',
      'Exame coproparasitológico revelou alta carga de ovos de Ancylostoma spp.',
    ],
    cbc: {
      rbc: 4.6,
      hb: 6.9,
      vg: 24.0,
      vcm: 52.2,
      chcm: 28.8,
      rdw: 19.2,
      ppt: 5.1,
      reticulocytes: 28000,
      reticulocyteDetail: '28.000 /µL (abaixo do limiar regenerativo canino)',
      plasmaAspect: 'Límpido',
    },
    smear: {
      polychromasia: 0,
      anisocytosis: 2,
      hypochromia: 3,
      spherocytes: false,
      heinzBodies: false,
      basophilicStippling: false,
      rouleaux: false,
      hemolysisArtifact: false,
      parasite: null,
      findingsSummary: [
        'Micrócitos numerosos (hemácias de diâmetro reduzido)',
        'Hipocromia acentuada (+++) com amplo halo de palidez central',
        'Raros codócitos (células em alvo) e ausência de policromasia significativa',
      ],
    },
    hints: [
      'Tanto o VCM (52,2 fL) quanto a CHCM (28,8 g/dL) estão abaixo dos valores de referência do cão.',
      'Os reticulócitos (28.000 /µL) estão abaixo de 60.000 /µL — a medula está limitada pela falta de ferro.',
      'A associação de melena crônica, hipoproteinemia (PPT 5,1 g/dL) e microcitose hipocrômica aponta diretamente para a causa.',
    ],
    solution: {
      vcm: 'microcitica',
      chcm: 'hipocromica',
      regeneration: 'arregenerativa',
      mechanism: 'hemorragia',
      diagnosis: 'Anemia Ferropriva por Hemorragia Gastrointestinal Crônica',
      explanation:
        'A perda crônica de sangue gastrointestinal (ancilostomíase) esgota as reservas orgânicas de ferro. Sem ferro suficiente para sintetizar hemoglobina, os precursores eritroides realizam mitoses adicionais na medula, gerando hemácias pequenas (microcíticas) e pálidas (hipocrômicas). Embora inicialmente possa haver regeneração, na fase crônica estabelecida a anemia torna-se arregenerativa, acompanhada de hipoproteinemia pela perda proteica concomitante.',
      keyTakeaway:
        'Anemia microcítica hipocrômica em cães adultos é quase sinônimo de deficiência de ferro secundária à hemorragia crônica externa ou gastrointestinal.',
    },
  },
  {
    id: 'can-03',
    code: 'HEM-C03',
    species: 'canino',
    difficulty: 'basico',
    title: 'Poliúria, polidipsia e apatia progressiva',
    patientName: 'Bidu',
    signalment: 'Poodle, macho, 13 anos',
    history:
      'Paciente idoso com histórico de perda de peso nos últimos 4 meses, aumento da ingestão hídrica, vômitos esporádicos e halitose urêmica.',
    physicalExam:
      'Mucosas pálidas, desidratação discreta (5%), úlceras superficiais em mucosa oral.',
    labNotes: [
      'Bioquímica sérica: Creatinina 5,4 mg/dL e Ureia 198 mg/dL (azotemia severa).',
      'Densidade urinária persistentemente baixa (1.010 — isostenúria).',
    ],
    cbc: {
      rbc: 3.2,
      hb: 7.5,
      vg: 22.0,
      vcm: 68.8,
      chcm: 34.1,
      rdw: 13.4,
      ppt: 7.2,
      reticulocytes: 12000,
      reticulocyteDetail: '12.000 /µL (ausência de resposta medular)',
      plasmaAspect: 'Límpido',
    },
    smear: {
      polychromasia: 0,
      anisocytosis: 0,
      hypochromia: 0,
      spherocytes: false,
      heinzBodies: false,
      basophilicStippling: false,
      rouleaux: false,
      hemolysisArtifact: false,
      parasite: null,
      findingsSummary: [
        'População eritrocitária uniforme (normócitos normocrômicos)',
        'Ausência de policromasia ou anisocitose',
        'Sem evidências de hemoparasitas ou esferócitos',
      ],
    },
    hints: [
      'Verifique se o VCM (68,8 fL) e a CHCM (34,1 g/dL) permanecem dentro da referência canina.',
      'Reticulócitos muito baixos (12.000 /µL) em um processo crônico indicam falta de estímulo ou produção medular.',
      'Correlacione o quadro de azotemia avançada com o hormônio renal responsável pela eritropoiese.',
    ],
    solution: {
      vcm: 'normocitica',
      chcm: 'normocromica',
      regeneration: 'arregenerativa',
      mechanism: 'producao_diminuida',
      diagnosis: 'Anemia da Doença Renal Crônica (Deficiência de Eritropoietina)',
      explanation:
        'O VCM e a CHCM permanecem rigorosamente normais (anemia normocítica normocrômica) e o RDW não está aumentado, refletindo ausência de liberação de células jovens. Com reticulócitos de apenas 12.000 /µL em doença de curso prolongado, caracteriza-se anemia arregenerativa por produção diminuída — decorrente sobretudo da queda na síntese renal de eritropoietina e do efeito inibitório das toxinas urêmicas sobre a medula.',
      keyTakeaway:
        'Anemia normocítica normocrômica arregenerativa com PPT normal em paciente azotêmico é a assinatura clássica da Doença Renal Crônica.',
    },
  },
  {
    id: 'can-04',
    code: 'HEM-C04',
    species: 'canino',
    difficulty: 'avancado',
    title: 'Atropelamento recente com distensão abdominal',
    patientName: 'Rex',
    signalment: 'Pastor Alemão, macho, 4 anos',
    history:
      'Atendido 18 horas após trauma automobilístico. Inicialmente apresentava-se alerta, mas evoluiu com fraqueza súbita e mucosas esbranquiçadas.',
    physicalExam:
      'Mucosas muito pálidas, pulso femoral fino, FC 162 bpm, abdômen distendido com líquido livre detectado ao ultrassom FAST.',
    labNotes: [
      'Abdominocentese confirmou sangue livre não coagulável (hemoabdômen por ruptura esplênica).',
      'Hemograma colhido 18 horas após o trauma, já após início de fluidoterapia cristaloide.',
    ],
    cbc: {
      rbc: 3.6,
      hb: 8.4,
      vg: 24.5,
      vcm: 68.1,
      chcm: 34.3,
      rdw: 13.8,
      ppt: 4.6,
      reticulocytes: 24000,
      reticulocyteDetail: '24.000 /µL (18h de evolução — medula ainda em fase de latência)',
      plasmaAspect: 'Límpido',
    },
    smear: {
      polychromasia: 0,
      anisocytosis: 0,
      hypochromia: 0,
      spherocytes: false,
      heinzBodies: false,
      basophilicStippling: false,
      rouleaux: false,
      hemolysisArtifact: false,
      parasite: null,
      findingsSummary: [
        'Hemácias de tamanho e coloração normais (normocíticas normocrômicas)',
        'Ainda sem policromasia visível no esfregaço',
        'Plaquetas discretamente reduzidas por consumo agudo',
      ],
    },
    hints: [
      'Atenção ao tempo de evolução: apenas 18 horas após o trauma!',
      'Quanto tempo a medula óssea canina leva para liberar reticulócitos na circulação após um evento agudo?',
      'Observe a queda simultânea do Hematócrito (24,5%) e da PPT (4,6 g/dL).',
    ],
    solution: {
      vcm: 'normocitica',
      chcm: 'normocromica',
      regeneration: 'pre_regenerativa',
      mechanism: 'hemorragia',
      diagnosis: 'Hemorragia Aguda (Fase Pré-Regenerativa < 72h)',
      explanation:
        'Nas primeiras 48 a 72 horas após uma hemorragia aguda, o hemograma ainda se apresenta normocítico normocrômico e sem reticulocitose, pois a medula óssea necessita de 3 a 5 dias para proliferar e liberar reticulócitos na circulação. A chave diagnóstica está na queda concomitante da PPT (4,6 g/dL) junto ao VG — confirmando perda de sangue total — e no histórico agudo, que impede classificar precipitadamente o caso como arregenerativo definitivo.',
      keyTakeaway:
        'Nunca classifique uma anemia aguda (< 72h) como arregenerativa definitiva! Sem reticulocitose inicial + PPT baixa + histórico recente = fase pré-regenerativa de hemorragia.',
    },
  },

  // ==================== FELINOS ====================
  {
    id: 'fel-01',
    code: 'HEM-F01',
    species: 'felino',
    difficulty: 'basico',
    title: 'Febre, icterícia e acesso livre à rua',
    patientName: 'Loki',
    signalment: 'SRD, macho não castrado, 3 anos',
    history:
      'Gato com acesso externo e histórico recente de brigas e infestação por pulgas. Há 5 dias apresenta prostração intensa, anorexia e febre intermitente.',
    physicalExam:
      'Temperatura retal 40,1 °C, mucosas intensamente pálidas com leve icterícia, linfadenomegalia discreta.',
    labNotes: [
      'Contagem diferencial de reticulócitos: Agregados 135.000 /µL; Pontilhados 64.000 /µL.',
      'Teste rápido FIV/FeLV negativo; PCR solicitado para hemoplasmas.',
    ],
    cbc: {
      rbc: 2.6,
      hb: 4.5,
      vg: 16.0,
      vcm: 61.5,
      chcm: 28.1,
      rdw: 23.0,
      ppt: 7.6,
      reticulocytes: 135000,
      reticulocyteDetail: '135.000 /µL agregados (> 50.000 /µL = regeneração ativa)',
      plasmaAspect: 'Ictérico (++)',
    },
    smear: {
      polychromasia: 3,
      anisocytosis: 3,
      hypochromia: 2,
      spherocytes: false,
      heinzBodies: false,
      basophilicStippling: false,
      rouleaux: true,
      hemolysisArtifact: false,
      parasite: 'mycoplasma',
      findingsSummary: [
        'Estruturas cocoides basofílicas aderidas à superfície das hemácias (Mycoplasma haemofelis)',
        'Policromasia acentuada (+++) e macrocitose evidente para a espécie felina',
        'Autoaglutinação leve em lâmina',
      ],
    },
    hints: [
      'Em felinos, o VCM de referência é menor (39–55 fL). Logo, 61,5 fL já caracteriza macrocitose!',
      'Qual tipo de reticulócito define regeneração ativa recente em gatos? Agregados > 50.000 /µL.',
      'Observe o esfregaço com atenção: pequenas estruturas cocoides na borda dos eritrócitos + plasma ictérico + PPT normal.',
    ],
    solution: {
      vcm: 'macrocitica',
      chcm: 'hipocromica',
      regeneration: 'regenerativa',
      mechanism: 'hemolise',
      diagnosis: 'Micoplasmose Hemotrópica Felina (Mycoplasma haemofelis)',
      explanation:
        'A infecção por Mycoplasma haemofelis induz hemólise extravascular e imunomediada severa. O VCM elevado (61,5 fL frente à faixa felina de 39–55 fL) e a CHCM diminuída (28,1 g/dL) refletem a liberação ativa de reticulócitos agregados (135.000 /µL). A PPT normal (7,6 g/dL) e o plasma ictérico reforçam o mecanismo hemolítico.',
      keyTakeaway:
        'Em felinos, sempre avalie o VCM frente à referência própria da espécie (39–55 fL) e utilize os reticulócitos AGREGADOS (> 50.000 /µL) para confirmar regeneração ativa.',
    },
  },
  {
    id: 'fel-02',
    code: 'HEM-F02',
    species: 'felino',
    difficulty: 'avancado',
    title: 'Administração caseira de analgésico humano',
    patientName: 'Mia',
    signalment: 'Siamês, fêmea, 4 anos',
    history:
      'Tutor administrou comprimido de paracetamol (acetaminofeno) há 4 dias por conta própria. Gata chegou com edema facial prévio, agora com mucosas acastanhadas/pálidas e urina escura.',
    physicalExam:
      'Mucosas pálidas a discretamente acastanhadas, taquipneia, apatia severa.',
    labNotes: [
      'Plasma intensamente avermelhado (hemoglobina livre / hemólise intravascular).',
      'Coloração com Novo Azul de Metileno evidenciou > 45% das hemácias com grandes corpúsculos de Heinz.',
    ],
    cbc: {
      rbc: 3.5,
      hb: 6.9,
      vg: 17.5,
      vcm: 50.0,
      chcm: 39.4,
      rdw: 19.6,
      ppt: 7.1,
      reticulocytes: 92000,
      reticulocyteDetail: '92.000 /µL agregados (resposta regenerativa instalada)',
      plasmaAspect: 'Hemolisado / Avermelhado (+++)',
    },
    smear: {
      polychromasia: 2,
      anisocytosis: 2,
      hypochromia: 0,
      spherocytes: false,
      heinzBodies: true,
      basophilicStippling: false,
      rouleaux: false,
      hemolysisArtifact: true,
      parasite: null,
      findingsSummary: [
        'Protrusões pálidas/refráteis na membrana eritrocitária compatíveis com corpúsculos de Heinz',
        'Células fantasma (ghost cells) indicando lise intravascular',
        'Policromasia moderada (++) confirmando resposta medular',
      ],
    },
    hints: [
      'Calcule ou observe a CHCM (39,4 g/dL) frente à faixa felina (30–36 g/dL). Existe eritrócito "hipercrômico" verdadeiro?',
      'A hemoglobina livre no plasma e os corpúsculos de Heinz elevam artificialmente a leitura espectrofotométrica da Hb, falseando a CHCM para cima.',
      'Reticulócitos agregados estão em 92.000 /µL (> 50.000 /µL).',
    ],
    solution: {
      vcm: 'normocitica',
      chcm: 'pseudo_hipercromica',
      regeneration: 'regenerativa',
      mechanism: 'hemolise',
      diagnosis: 'Anemia Hemolítica Oxidativa por Corpúsculos de Heinz (Paracetamol)',
      explanation:
        'Gatos possuem deficiência de glicuronil-transferase e hemoglobina rica em grupos sulfidrila, tornando-os extremamente vulneráveis à oxidação pelo paracetamol. Os corpúsculos de Heinz (hemoglobina precipitada) e a hemólise intravascular causam interferência óptica no analisador hematológico, gerando falsa elevação da CHCM (39,4 g/dL — pseudo-hipercromia). Os reticulócitos agregados de 92.000 /µL confirmam regeneração medular ativa.',
      keyTakeaway:
        'CHCM acima do limite superior nunca significa "mais hemoglobina útil dentro da célula": investigue hemólise intravascular/in vitro, corpúsculos de Heinz ou lipemia.',
    },
  },
  {
    id: 'fel-03',
    code: 'HEM-F03',
    species: 'felino',
    difficulty: 'basico',
    title: 'Anemia grave sem resposta em felino jovem',
    patientName: 'Fred',
    signalment: 'SRD, macho, 2 anos',
    history:
      'Gato domiciliado com contato prévio em abrigo. Há 3 semanas apresenta prostração crescente, mucosas porcelânicas e perda de apetite.',
    physicalExam:
      'Mucosas extremamente pálidas, sopro hemático grau III/VI, linfonodos normais, afebril.',
    labNotes: [
      'Teste ELISA antígeno FeLV (p27) fortemente positivo.',
      'Reticulócitos agregados: 6.000 /µL; Reticulócitos pontilhados: 18.000 /µL.',
    ],
    cbc: {
      rbc: 2.9,
      hb: 4.6,
      vg: 14.0,
      vcm: 48.3,
      chcm: 32.9,
      rdw: 15.2,
      ppt: 6.8,
      reticulocytes: 6000,
      reticulocyteDetail: '6.000 /µL agregados (sem regeneração ativa)',
      plasmaAspect: 'Límpido',
    },
    smear: {
      polychromasia: 0,
      anisocytosis: 0,
      hypochromia: 0,
      spherocytes: false,
      heinzBodies: false,
      basophilicStippling: false,
      rouleaux: false,
      hemolysisArtifact: false,
      parasite: null,
      findingsSummary: [
        'Eritrócitos uniformes em tamanho e coloração (normócitos normocrômicos)',
        'Ausência completa de policromasia apesar do hematócrito de 14%',
        'Ausência de hemoparasitas ou sinais de hemólise',
      ],
    },
    hints: [
      'Observe a gravidade do VG (14%) em contraste com a contagem de reticulócitos agregados (apenas 6.000 /µL).',
      'VCM (48,3 fL) e CHCM (32,9 g/dL) encontram-se dentro da faixa de referência felina.',
      'O vírus da Leucemia Felina (FeLV) pode infectar diretamente precursores eritroides na medula óssea.',
    ],
    solution: {
      vcm: 'normocitica',
      chcm: 'normocromica',
      regeneration: 'arregenerativa',
      mechanism: 'producao_diminuida',
      diagnosis: 'Aplasia Eritroide Medular associada à FeLV',
      explanation:
        'Diante de uma anemia grave (VG 14%) com evolução de semanas, uma medula saudável deveria apresentar reticulocitose agregada vigorosa. A ausência de reticulócitos agregados (6.000 /µL), associada a índices normocíticos normocrômicos e PPT normal, caracteriza falha primária de produção medular, classicamente causada pelo subgrupo C do vírus FeLV.',
      keyTakeaway:
        'Em felinos com anemia grave normocítica normocrômica arregenerativa, a pesquisa de retroviroses (especialmente FeLV) e mielograma é indispensável.',
    },
  },
  {
    id: 'fel-04',
    code: 'HEM-F04',
    species: 'felino',
    difficulty: 'intermediario',
    title: 'Anemia leve acompanhada de hiperproteinemia',
    patientName: 'Nina',
    signalment: 'Persa, fêmea, 7 anos',
    history:
      'Histórico de perda de peso moderada, febre branda recorrente e alteração hepática/inflamatória crônica há 2 meses.',
    physicalExam:
      'Mucosas discretamente pálidas, leve desconforto abdominal cranial, hidratação preservada.',
    labNotes: [
      'Proteína plasmática total elevada (9,2 g/dL) à custa de hiperglobulinemia policlonal.',
      'Ferro sérico diminuído com ferritina elevada (sequestro macrofágico de ferro).',
    ],
    cbc: {
      rbc: 4.2,
      hb: 6.5,
      vg: 19.5,
      vcm: 46.4,
      chcm: 33.3,
      rdw: 15.8,
      ppt: 9.2,
      reticulocytes: 9000,
      reticulocyteDetail: '9.000 /µL agregados (arregenerativa)',
      plasmaAspect: 'Límpido a discretamente amarelado',
    },
    smear: {
      polychromasia: 0,
      anisocytosis: 1,
      hypochromia: 0,
      spherocytes: false,
      heinzBodies: false,
      basophilicStippling: false,
      rouleaux: true,
      hemolysisArtifact: false,
      parasite: null,
      findingsSummary: [
        'Hemácias normocíticas normocrômicas',
        'Rouleaux aumentado secundário à hiperglobulinemia',
        'Ausência de policromasia',
      ],
    },
    hints: [
      'O hematócrito (19,5%) mostra anemia discreta a moderada, com VCM e CHCM normais.',
      'A PPT elevada (9,2 g/dL) sem desidratação aponta para estímulo inflamatório crônico (globulinas).',
      'Citocinas inflamatórias (IL-6 → hepcidina) bloqueiam a liberação de ferro e reduzem a resposta à eritropoietina.',
    ],
    solution: {
      vcm: 'normocitica',
      chcm: 'normocromica',
      regeneration: 'arregenerativa',
      mechanism: 'producao_diminuida',
      diagnosis: 'Anemia da Doença Inflamatória Crônica',
      explanation:
        'A anemia da inflamação crônica é tipicamente leve a moderada, normocítica normocrômica e arregenerativa (reticulócitos agregados < 50.000 /µL). Citocinas inflamatórias estimulam a produção de hepcidina, sequestrando o ferro nos macrófagos e diminuindo a eritropoiese medular. A hiperproteinemia (9,2 g/dL) e o aumento de rouleaux corroboram o estado hiperglobulinêmico inflamatório.',
      keyTakeaway:
        'Anemia discreta a moderada, normocítica normocrômica arregenerativa + hiperproteinemia (globulinas) é a apresentação típica da Anemia de Doença Inflamatória.',
    },
  },

  // ==================== EQUINOS ====================
  {
    id: 'equ-01',
    code: 'HEM-E01',
    species: 'equino',
    difficulty: 'intermediario',
    title: 'Febre, icterícia e carrapatos em cavalo de esporte',
    patientName: 'Trovão',
    signalment: 'Quarto de Milha, macho, 6 anos',
    history:
      'Animal retornou de prova em região endêmica há 10 dias. Apresenta febre (39,8 °C), apatia, edema distal leve e icterícia evidente há 5 dias.',
    physicalExam:
      'Mucosas ocular e oral fortemente ictéricas com petéquias discretas, FC 64 bpm, presença de carrapatos na região inguinal.',
    labNotes: [
      'Atenção à espécie: equinos não liberam reticulócitos no sangue periférico.',
      'Hemograma prévio realizado há 4 dias registrava VG 19% e VCM 52,0 fL (aumento recente do VCM e do RDW).',
    ],
    cbc: {
      rbc: 3.2,
      hb: 6.9,
      vg: 20.5,
      vcm: 64.1,
      chcm: 33.7,
      rdw: 24.5,
      ppt: 7.3,
      reticulocytes: 0,
      reticulocyteDetail: '0 /µL (fisiologicamente ausentes no sangue periférico equino)',
      plasmaAspect: 'Intensamente ictérico (+++)',
    },
    smear: {
      polychromasia: 0,
      anisocytosis: 3,
      hypochromia: 0,
      spherocytes: false,
      heinzBodies: false,
      basophilicStippling: false,
      rouleaux: true,
      hemolysisArtifact: false,
      parasite: 'theileria',
      findingsSummary: [
        'Inclusões intraeritrocitárias compatíveis com Theileria equi (forma em "cruz de Malta")',
        'Anisocitose acentuada com presença de macrócitos (refletindo VCM de 64,1 fL)',
        'Ausência de policromasia e presença de rouleaux fisiológico da espécie',
      ],
    },
    hints: [
      'Compare o VCM (64,1 fL) com a referência equina (37–58 fL). A CHCM (33,7 g/dL) está normal (31–38 g/dL).',
      'CUIDADO: Em equinos, reticulócitos = 0 /µL NÃO significa anemia arregenerativa!',
      'Mesmo com o VCM alto sugerindo regeneração, como se confirma oficialmente a resposta medular em equinos?',
    ],
    solution: {
      vcm: 'macrocitica',
      chcm: 'normocromica',
      regeneration: 'avaliar_seriado',
      mechanism: 'hemolise',
      diagnosis: 'Piroplasmose Equina (Theileria equi) com Evidência Indireta de Regeneração',
      explanation:
        'Em equinos, a maturação final dos reticulócitos ocorre integralmente dentro da medula óssea, de modo que eles nunca são liberados na circulação periférica (0 /µL). Por isso, no hemograma isolado a resposta medular não pode ser classificada por reticulócitos — exige acompanhamento seriado (elevação progressiva de VCM, RDW e VG) ou mielograma. Aqui, a macrocitose (64,1 fL) e o RDW elevado (24,5%) são fortes indicadores indiretos de regeneração frente à hemólise causada por Theileria equi.',
      keyTakeaway:
        'Regra de ouro em Equinos: 0 reticulócitos no sangue periférico é sempre fisiológico! Busque macrocitose progressiva (VCM ↑), RDW ↑ em hemogramas seriados ou mielograma.',
    },
  },
  {
    id: 'equ-02',
    code: 'HEM-E02',
    species: 'equino',
    difficulty: 'intermediario',
    title: 'Ferimento lacerante em membro com sangramento profuso',
    patientName: 'Estrela',
    signalment: 'Mangalarga Marchador, fêmea, 8 anos',
    history:
      'Sofreu laceração profunda em região metacarpiana em cerca de arame há 36 horas, com grande perda sanguínea antes da contenção hemostática.',
    physicalExam:
      'Mucosas pálidas, FC 68 bpm, pulso fino, extremidades frias, ferida suturada sem sangramento ativo no momento.',
    labNotes: [
      'Hemograma colhido 36 horas após a hemorragia, após redistribuição de fluido intersticial para o espaço intravascular.',
      'Fibrinogênio dentro da normalidade (200 mg/dL).',
    ],
    cbc: {
      rbc: 4.4,
      hb: 7.2,
      vg: 21.0,
      vcm: 47.7,
      chcm: 34.3,
      rdw: 17.5,
      ppt: 4.5,
      reticulocytes: 0,
      reticulocyteDetail: '0 /µL (equinos não liberam reticulócitos periféricos)',
      plasmaAspect: 'Límpido',
    },
    smear: {
      polychromasia: 0,
      anisocytosis: 0,
      hypochromia: 0,
      spherocytes: false,
      heinzBodies: false,
      basophilicStippling: false,
      rouleaux: true,
      hemolysisArtifact: false,
      parasite: null,
      findingsSummary: [
        'Eritrócitos normocíticos normocrômicos com rouleaux discreto',
        'Ausência de policromasia ou macrócitos',
        'Sem evidências de hemoparasitas',
      ],
    },
    hints: [
      'Note que o VG (21%) e a PPT (4,5 g/dL) caíram de forma paralela — o que indica perda conjunta de células e plasma.',
      'VCM (47,7 fL) e CHCM (34,3 g/dL) estão dentro da referência equina (37–58 fL e 31–38 g/dL).',
      'Lembre-se da particularidade equina: a avaliação da resposta medular dependerá de hemogramas seriados nos próximos dias.',
    ],
    solution: {
      vcm: 'normocitica',
      chcm: 'normocromica',
      regeneration: 'avaliar_seriado',
      mechanism: 'hemorragia',
      diagnosis: 'Anemia por Hemorragia Aguda Pós-Traumática',
      explanation:
        'A queda simultânea do VG (21,0%) e da PPT (4,5 g/dL, referência 6,0–7,7 g/dL) é o marcador clássico de hemorragia aguda após a entrada de líquido intersticial no leito vascular (o que ocorre em 12–24h). Como equinos não liberam reticulócitos periféricos, não se pode julgar a resposta medular por um único hemograma — deve-se realizar monitoramento seriado observando a recuperação do VG e o posterior aumento do VCM/RDW.',
      keyTakeaway:
        'Em equinos após hemorragia aguda, a queda da PPT costuma aparecer antes mesmo da queda completa do VG (devido à contração esplênica inicial).',
    },
  },
  {
    id: 'equ-03',
    code: 'HEM-E03',
    species: 'equino',
    difficulty: 'avancado',
    title: 'Emagrecimento, edema ventral e febre recorrente',
    patientName: 'Barão',
    signalment: 'Crioulo, macho, 11 anos',
    history:
      'Quadro crônico há 2 meses de fraqueza, edema de peito e abdômen ventral e episódios febris intermitentes. Exame de IDGA (Coggins) reagente.',
    physicalExam:
      'Mucosas pálidas, edema subcutâneo ventral mole e indolor, emagrecimento progressivo.',
    labNotes: [
      'Hemograma seriado comparativo: VG 23% hoje vs. 24% há 12 dias, sem elevação de VCM ou RDW.',
      'Mielograma revelou relação M:E aumentada (hipoplasia eritroide medular e acúmulo de hemossiderina).',
    ],
    cbc: {
      rbc: 4.9,
      hb: 7.8,
      vg: 23.0,
      vcm: 46.9,
      chcm: 33.9,
      rdw: 17.8,
      ppt: 8.8,
      reticulocytes: 0,
      reticulocyteDetail: '0 /µL + mielograma confirmando hipoplasia eritroide',
      plasmaAspect: 'Límpido a discretamente amarelado',
    },
    smear: {
      polychromasia: 0,
      anisocytosis: 0,
      hypochromia: 0,
      spherocytes: false,
      heinzBodies: false,
      basophilicStippling: false,
      rouleaux: true,
      hemolysisArtifact: false,
      parasite: null,
      findingsSummary: [
        'População homogênea de eritrócitos normocíticos normocrômicos',
        'Rouleaux proeminente (fisiológico e intensificado pela hiperglobulinemia)',
        'Sem anisocitose ou macrocitose no acompanhamento seriado',
      ],
    },
    hints: [
      'Diferente de um hemograma isolado em equino, observe as notas laboratoriais: há hemograma seriado sem resposta E mielograma com hipoplasia eritroide!',
      'VCM (46,9 fL) e CHCM (33,9 g/dL) são normais, e a PPT está elevada (8,8 g/dL).',
      'Na fase crônica da AIE, a supressão medular inflamatória e imunomediada reduz a eritropoiese.',
    ],
    solution: {
      vcm: 'normocitica',
      chcm: 'normocromica',
      regeneration: 'arregenerativa',
      mechanism: 'producao_diminuida',
      diagnosis: 'Anemia Infecciosa Equina (AIE) — Fase Crônica Hipoproliferativa',
      explanation:
        'Embora um hemograma isolado em equinos não permita fechar regeneração, neste caso o acompanhamento seriado de 12 dias (sem aumento de VG, VCM ou RDW) aliado ao mielograma com hipoplasia eritroide confirma uma anemia verdadeiramente arregenerativa. A hiperproteinemia (8,8 g/dL) reflete intensa estimulação antigênica crônica.',
      keyTakeaway:
        'Em equinos, confirmar anemia arregenerativa exige evidência seriada (ausência de subida de VCM/VG) ou mielograma demonstrando hipoplasia eritroide.',
    },
  },
  {
    id: 'equ-04',
    code: 'HEM-E04',
    species: 'equino',
    difficulty: 'avancado',
    title: 'Ingestão de folhas murchas em pastagem e urina marrom',
    patientName: 'Sultão',
    signalment: 'Puro Sangue Inglês, macho, 7 anos',
    history:
      'Após tempestade, galhos de bordo vermelho (Acer rubrum) caíram no piquete. Três dias depois o cavalo apresentou apatia aguda, taquipneia e urina marrom-escura.',
    physicalExam:
      'Mucosas acastanhadas/ictéricas, FC 72 bpm, hemoglobinúria franca.',
    labNotes: [
      'Plasma intensamente avermelhado/acastanhado (hemólise intravascular e metemoglobinemia).',
      'Hemograma isolado de admissão — necessário acompanhamento seriado.',
    ],
    cbc: {
      rbc: 3.5,
      hb: 7.4,
      vg: 18.0,
      vcm: 51.4,
      chcm: 41.1,
      rdw: 20.8,
      ppt: 7.2,
      reticulocytes: 0,
      reticulocyteDetail: '0 /µL (espécie equina — avaliar evolução seriada)',
      plasmaAspect: 'Intensamente hemolisado / avermelhado (+++)',
    },
    smear: {
      polychromasia: 0,
      anisocytosis: 2,
      hypochromia: 0,
      spherocytes: false,
      heinzBodies: true,
      basophilicStippling: false,
      rouleaux: true,
      hemolysisArtifact: true,
      parasite: null,
      findingsSummary: [
        'Corpúsculos de Heinz numerosos e eccentrócitos (injúria oxidativa)',
        'Células fantasma (ghost cells) por lise intravascular aguda',
        'Ausência de reticulócitos periféricos (característica da espécie)',
      ],
    },
    hints: [
      'Atenção à CHCM de 41,1 g/dL (referência equina: 31–38 g/dL)! Por que esse valor ultrapassou o limite superior?',
      'A hemoglobina livre no plasma somada à presença de corpúsculos de Heinz eleva falsamente a leitura de Hb e, portanto, a CHCM.',
      'Como se trata de um exame isolado em equino, não podemos julgar regeneração pelos reticulócitos periféricos.',
    ],
    solution: {
      vcm: 'normocitica',
      chcm: 'pseudo_hipercromica',
      regeneration: 'avaliar_seriado',
      mechanism: 'hemolise',
      diagnosis: 'Hemólise Oxidativa Aguda por Folhas de Bordo Vermelho (Acer rubrum)',
      explanation:
        'A intoxicação por folhas murchas de Acer rubrum causa estresse oxidativo severo nos eritrócitos equinos, com formação de corpúsculos de Heinz, eccentrócitos e hemólise intravascular maciça. A hemoglobina livre no plasma aumenta artificialmente o numerador da fórmula da CHCM (41,1 g/dL), gerando pseudo-hipercromia. Como o exame é isolado em um equino, a avaliação da resposta medular depende de hemogramas seriados.',
      keyTakeaway:
        'Hemólise intravascular maciça sempre distorce a CHCM para cima (pseudo-hipercromia) porque o analisador soma a hemoglobina livre plasmática à hemoglobina intraeritrocitária.',
    },
  },

  // ==================== BOVINOS ====================
  {
    id: 'bov-01',
    code: 'HEM-B01',
    species: 'bovino',
    difficulty: 'basico',
    title: 'Febre alta, icterícia e queda brusca na produção leiteira',
    patientName: 'Mimosa',
    signalment: 'Holandesa, fêmea, 4 anos',
    history:
      'Vaca leiteira transferida recentemente para pasto com alta infestação por carrapatos (Rhipicephalus microplus). Há 5 dias apresenta febre, anorexia e mucosas amareladas.',
    physicalExam:
      'Temperatura 40,6 °C, mucosas pálidas e ictéricas, frequência cardíaca elevada (104 bpm), ruminação diminuída.',
    labNotes: [
      'Bovinos adultos sadios têm 0 /µL de reticulócitos; aqui detectam-se 85.000 /µL.',
      'Nota: pontilhado basofílico frequente no esfregaço sanguíneo.',
    ],
    cbc: {
      rbc: 2.3,
      hb: 4.5,
      vg: 16.0,
      vcm: 69.6,
      chcm: 28.1,
      rdw: 25.4,
      ppt: 7.3,
      reticulocytes: 85000,
      reticulocyteDetail: '85.000 /µL (qualquer reticulocitose em bovino indica regeneração)',
      plasmaAspect: 'Ictérico (+++)',
    },
    smear: {
      polychromasia: 3,
      anisocytosis: 3,
      hypochromia: 2,
      spherocytes: false,
      heinzBodies: false,
      basophilicStippling: true,
      rouleaux: false,
      hemolysisArtifact: false,
      parasite: 'anaplasma',
      findingsSummary: [
        'Inclusões puntiformes basofílicas na periferia das hemácias (Anaplasma marginale)',
        'Pontilhado basofílico acentuado (+++) — marcador clássico de regeneração em bovinos',
        'Policromasia intensa (+++) e macrocitose evidente (VCM 69,6 fL)',
      ],
    },
    hints: [
      'Verifique a faixa de VCM (40–60 fL) e CHCM (30–36 g/dL) para bovinos.',
      'Em bovinos, tanto os reticulócitos (85.000 /µL) quanto o pontilhado basofílico confirmam forte resposta medular regenerativa.',
      'Plasma ictérico + PPT normal (7,3 g/dL) + inclusões marginais intraeritrocitárias apontam para qual mecanismo?',
    ],
    solution: {
      vcm: 'macrocitica',
      chcm: 'hipocromica',
      regeneration: 'regenerativa',
      mechanism: 'hemolise',
      diagnosis: 'Anaplasmose Bovina (Tristeza Parasitária Bovina)',
      explanation:
        'Anaplasma marginale promove intensa hemólise extravascular (fagocitose esplênica de hemácias parasitadas), explicando o plasma ictérico e a PPT normal (7,3 g/dL). A medula bovina responde liberando reticulócitos (85.000 /µL — normalmente 0 em adultos hígidos), macrócitos policromáticos (VCM 69,6 fL, CHCM 28,1 g/dL) e abundante pontilhado basofílico.',
      keyTakeaway:
        'Em bovinos, diferentemente dos cães, o pontilhado basofílico é um achado fisiológico clássico de anemia fortemente regenerativa!',
    },
  },
  {
    id: 'bov-02',
    code: 'HEM-B02',
    species: 'bovino',
    difficulty: 'intermediario',
    title: 'Melena, fraqueza e edema submandibular em vaca de alta produção',
    patientName: 'Estrelinha',
    signalment: 'Girolando, fêmea, 5 anos',
    history:
      'Vaca no pós-parto tardio em dieta altamente concentrada apresenta fezes escurecidas e pegajosas (melena) há semanas, perda de escore corporal e edema de barbela.',
    physicalExam:
      'Mucosas extremamente pálidas, leve edema submandibular, dor à percussão ventral direita do abdômen.',
    labNotes: [
      'Pesquisa de sangue oculto nas fezes fortemente positiva.',
      'Hipoalbuminemia acentuada acompanhando a queda da PPT (5,2 g/dL).',
    ],
    cbc: {
      rbc: 4.8,
      hb: 4.9,
      vg: 17.5,
      vcm: 36.5,
      chcm: 28.0,
      rdw: 21.8,
      ppt: 5.2,
      reticulocytes: 0,
      reticulocyteDetail: '0 /µL (ausência de resposta regenerativa na fase ferropriva crônica)',
      plasmaAspect: 'Límpido',
    },
    smear: {
      polychromasia: 0,
      anisocytosis: 2,
      hypochromia: 3,
      spherocytes: false,
      heinzBodies: false,
      basophilicStippling: false,
      rouleaux: false,
      hemolysisArtifact: false,
      parasite: null,
      findingsSummary: [
        'Micrócitos abundantes (VCM 36,5 fL frente à faixa de 40–60 fL)',
        'Hipocromia pronunciada (+++) com amplo clareamento central',
        'Ausência de policromasia e de pontilhado basofílico',
      ],
    },
    hints: [
      'Compare o VCM (36,5 fL) e a CHCM (28,0 g/dL) com a referência bovina (40–60 fL e 30–36 g/dL).',
      'Não há reticulócitos (0 /µL), policromasia ou pontilhado basofílico.',
      'Melena crônica + hipoproteinemia (5,2 g/dL) + padrão microcítico hipocrômico indicam perda crônica de sangue e ferro.',
    ],
    solution: {
      vcm: 'microcitica',
      chcm: 'hipocromica',
      regeneration: 'arregenerativa',
      mechanism: 'hemorragia',
      diagnosis: 'Úlcera de Abomaso com Hemorragia Crônica e Deficiência de Ferro',
      explanation:
        'O sangramento contínuo pela úlcera abomasal (ou hemoncose severa) leva à perda simultânea de proteínas plasmáticas (PPT 5,2 g/dL, explicando o edema submandibular) e à depleção de ferro. Sem ferro, a eritropoiese torna-se ineficaz, produzindo hemácias microcíticas (36,5 fL) e hipocrômicas (28,0 g/dL) sem liberação de reticulócitos.',
      keyTakeaway:
        'Microcitose + hipocromia + hipoproteinemia em ruminantes aponta classicamente para hemorragia crônica gastrointestinal (úlcera abomasal ou endoparasitismo hematófago).',
    },
  },
  {
    id: 'bov-03',
    code: 'HEM-B03',
    species: 'bovino',
    difficulty: 'basico',
    title: 'Postura antálgica, ingurgitamento jugular e hiperproteinemia',
    patientName: 'Boneca',
    signalment: 'Jersey, fêmea, 6 anos',
    history:
      'Vaca com histórico crônico (6 semanas) de queda produtiva, dor à caminhada em declive, relutância em deitar e abafamento de bulhas cardíacas.',
    physicalExam:
      'Mucosas discretamente pálidas, veias jugulares ingurgitadas, temperatura 39,1 °C, prova de dor xifoide positiva.',
    labNotes: [
      'Fibrinogênio plasmático intensamente elevado (1.100 mg/dL; ref. 300–700 mg/dL).',
      'Leucocitose neutrofílica com linfopenia de estresse.',
    ],
    cbc: {
      rbc: 3.9,
      hb: 6.4,
      vg: 19.5,
      vcm: 50.0,
      chcm: 32.8,
      rdw: 16.5,
      ppt: 9.1,
      reticulocytes: 0,
      reticulocyteDetail: '0 /µL (sem resposta regenerativa)',
      plasmaAspect: 'Límpido',
    },
    smear: {
      polychromasia: 0,
      anisocytosis: 0,
      hypochromia: 0,
      spherocytes: false,
      heinzBodies: false,
      basophilicStippling: false,
      rouleaux: false,
      hemolysisArtifact: false,
      parasite: null,
      findingsSummary: [
        'Eritrócitos normocíticos normocrômicos homogêneos',
        'Ausência de policromasia ou pontilhado basofílico',
        'Fibrina aumentada em fundo de lâmina',
      ],
    },
    hints: [
      'Tanto o VCM (50,0 fL) quanto a CHCM (32,8 g/dL) estão rigorosamente normais.',
      'Reticulócitos = 0 /µL em um processo inflamatório de 6 semanas.',
      'A PPT muito elevada (9,1 g/dL) e o fibrinogênio alto confirmam inflamação crônica severa.',
    ],
    solution: {
      vcm: 'normocitica',
      chcm: 'normocromica',
      regeneration: 'arregenerativa',
      mechanism: 'producao_diminuida',
      diagnosis: 'Anemia de Doença Inflamatória Crônica (Reticulopericardite Traumática)',
      explanation:
        'Processos inflamatórios supurativos crônicos em bovinos (como reticulopericardite traumática ou abscessos hepáticos) elevam acentuadamente o fibrinogênio e as globulinas (PPT 9,1 g/dL) e suprimem a eritropoiese via sequestro de ferro mediado por citocinas. O resultado é uma anemia discreta a moderada, normocítica normocrômica e arregenerativa.',
      keyTakeaway:
        'Em bovinos, anemia leve/moderada normocítica normocrômica arregenerativa associada à hiperfibrinogenemia e hiperproteinemia é clássica de inflamação crônica.',
    },
  },
  {
    id: 'bov-04',
    code: 'HEM-B04',
    species: 'bovino',
    difficulty: 'avancado',
    title: 'Parto distócico com hemorragia uterina há 20 horas',
    patientName: 'Malhada',
    signalment: 'Holandesa, fêmea, 3 anos',
    history:
      'Primípara submetida à tração obstétrica difícil há 20 horas, com laceração de artéria uterina média controlada cirurgicamente há 14 horas.',
    physicalExam:
      'Mucosas intensamente pálidas, FC 118 bpm, extremidades frias, animal em decúbito esternal.',
    labNotes: [
      'Amostra colhida 20 horas após a perda aguda de grande volume sanguíneo.',
      'Sem sinais de icterícia ou hemoglobinúria.',
    ],
    cbc: {
      rbc: 3.4,
      hb: 5.6,
      vg: 17.0,
      vcm: 50.0,
      chcm: 32.9,
      rdw: 16.9,
      ppt: 5.0,
      reticulocytes: 0,
      reticulocyteDetail: '0 /µL (20h de evolução — antes do início da liberação medular)',
      plasmaAspect: 'Límpido',
    },
    smear: {
      polychromasia: 0,
      anisocytosis: 0,
      hypochromia: 0,
      spherocytes: false,
      heinzBodies: false,
      basophilicStippling: false,
      rouleaux: false,
      hemolysisArtifact: false,
      parasite: null,
      findingsSummary: [
        'Eritrócitos normocíticos normocrômicos sem alterações morfológicas',
        'Ainda sem policromasia ou pontilhado basofílico (< 48h pós-evento)',
        'Sem evidências de hemoparasitas',
      ],
    },
    hints: [
      'Observe o tempo de evolução: apenas 20 horas após o parto distócico!',
      'Por que a PPT está baixa (5,0 g/dL, ref. 6,7–7,5 g/dL) junto com o VG de 17%?',
      'A medula óssea bovina também precisa de 2 a 4 dias para começar a liberar reticulócitos e pontilhado basofílico.',
    ],
    solution: {
      vcm: 'normocitica',
      chcm: 'normocromica',
      regeneration: 'pre_regenerativa',
      mechanism: 'hemorragia',
      diagnosis: 'Anemia Hemorrágica Aguda Pós-Parto (Fase Pré-Regenerativa)',
      explanation:
        'A redução concomitante do VG (17,0%) e da PPT (5,0 g/dL) confirma hemorragia aguda com hemodiluição compensatória. Como transcorreram apenas 20 horas, ainda não houve tempo fisiológico (48–72h) para a medula liberar reticulócitos, policromasia ou pontilhado basofílico. Trata-se de fase pré-regenerativa, e um novo hemograma em 3–4 dias deverá evidenciar regeneração franca.',
      keyTakeaway:
        'Em todas as espécies, o fator TEMPO é essencial: ausência de reticulócitos nas primeiras 48–72h de uma perda aguda representa fase pré-regenerativa, não falência medular.',
    },
  },
];
