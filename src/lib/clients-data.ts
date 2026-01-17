
export interface Questionnaire {
    q1?: string;
    q2?: string;
    q3?: string;
    q4?: string;
    q4_software?: string;
    q4_method?: string;
    q5?: string;
    q5_software?: string;
    q5_method?: string;
    q6?: string;
    q6_software?: string;
    q7?: string;
    q7_software?: string;
    q8?: string;
    q8_software?: string;
    q9?: string;
    q10?: string;
    q10_function?: string;
    q11?: string;
    q12?: string;
    q12_actions?: string;
    q13?: string;
    q13_project?: string;
}

export type Client = {
  identifiantInterne: string;
  siren: string;
  raisonSociale: string;
  formeJuridique: string;
  dateDeCloture?: string;
  contactPrincipal: {
    nom: string;
    prenom: string;
    email: string;
  };
  avatar: string;
  missionsActuelles: {
    collaborateurReferent: string;
    expertComptable: string;
    typeMission: string;
  };
  activites: {
    codeAPE: string;
    secteurActivites: string;
    regimeTVA: string;
    regimeFiscal: string;
    typologieClientele: string;
  };
  obligationsLegales: {
    assujettiReforme?: string;
    eInvoicing?: string;
    eReportingTransaction?: string;
    eReportingPaiement?: string;
    paEmission?: string;
    paReception?: string;
    niveauObligation?: string;
  };
  outils?: {
    logicielCaisse?: string;
    genereEReporting?: string;
    logicielFacturation?: string;
    conformeFacturationElectronique?: string;
    logicielGestionCommerciale?: string;
    interoperableComptable?: string;
    interoperablePaEmission?: string;
    logicielComptableClient?: string;
    interoperableAutresLogiciels?: string;
    logicielNotesFrais?: string;
  };
  questionnaire?: Questionnaire;
  maturiteDigitale?: string;
  cartographieClient?: string;
  actionsAMener?: string[];
  migrationSteps?: {
    step1: boolean;
    step2: boolean;
    step3: boolean;
  };
};

export const clients: (Client & { id: string })[] = [
    {
      id: "C001",
      identifiantInterne: "C001",
      siren: "123456789",
      raisonSociale: "Johnson & Co",
      formeJuridique: "SARL",
      dateDeCloture: "31/12",
      contactPrincipal: {
        nom: "Johnson",
        prenom: "Liam",
        email: "liam@example.com",
      },
      avatar: "https://picsum.photos/seed/1/40/40",
      missionsActuelles: {
        collaborateurReferent: "Alice Martin",
        expertComptable: "Bob Durand",
        typeMission: "Tenue",
      },
      activites: {
        codeAPE: "6201Z",
        secteurActivites: "Conseil en systèmes et logiciels informatiques",
        regimeTVA: "Débit",
        regimeFiscal: "IS régime réel normal",
        typologieClientele: "B to B",
      },
      obligationsLegales: {},
      questionnaire: {
        q1: "detailed",
        q2: "quickly",
        q3: "b2b",
        q4: "Oui",
        q4_software: "Cegid",
        q5: "Oui",
        q5_software: "Pennylane",
        q6: "Non",
        q7: "Oui",
        q7_software: "Quickbooks",
        q8: "Non",
        q9: "digital",
        q10: "Oui",
        q10_function: "Comptable",
        q11: "platform",
        q12: "Oui",
        q12_actions: "Recherche de PDP",
        q13: "Non",
      },
      actionsAMener: ["Migration sur l'outil du cabinet"],
      migrationSteps: { step1: true, step2: false, step3: false },
    },
    {
      id: "C002",
      identifiantInterne: "C002",
      siren: "987654321",
      raisonSociale: "Smith Enterprises",
      formeJuridique: "SAS",
      dateDeCloture: "31/12",
      contactPrincipal: {
        nom: "Smith",
        prenom: "Olivia",
        email: "olivia@example.com",
      },
      avatar: "https://picsum.photos/seed/2/40/40",
      missionsActuelles: {
        collaborateurReferent: "Charles Dupont",
        expertComptable: "David Petit",
        typeMission: "Révision",
      },
      activites: {
        codeAPE: "7022Z",
        secteurActivites: "Conseil pour les affaires et autres conseils de gestion",
        regimeTVA: "Encaissement",
        regimeFiscal: "IS régime simplifié",
        typologieClientele: "B to C",
      },
      obligationsLegales: {},
      questionnaire: {
        q4: "Non",
        q4_method: "Excel",
        q5: "Non",
        q5_method: "Word"
      }
    },
    {
      id: "C003",
      identifiantInterne: "C003",
      siren: "112233445",
      raisonSociale: "Williams Solutions",
      formeJuridique: "EURL",
      dateDeCloture: "31/12",
      contactPrincipal: {
        nom: "Williams",
        prenom: "Noah",
        email: "noah@example.com",
      },
      avatar: "https://picsum.photos/seed/3/40/40",
      missionsActuelles: {
        collaborateurReferent: "Alice Martin",
        expertComptable: "Bob Durand",
        typeMission: "Autres",
      },
      activites: {
        codeAPE: "4791A",
        secteurActivites: "Vente à distance sur catalogue général",
        regimeTVA: "Non concerné",
        regimeFiscal: "Micro BIC",
        typologieClientele: "Mixtes",
      },
      obligationsLegales: {},
      questionnaire: {
        q4: "Oui",
        q4_software: "SumUp",
        q6: "Oui",
        q6_software: "Odoo"
      }
    },
    {
      id: "C004",
      identifiantInterne: "C004",
      siren: "556677889",
      raisonSociale: "Brown Industries",
      formeJuridique: "SA",
      dateDeCloture: "31/12",
      contactPrincipal: {
        nom: "Brown",
        prenom: "Emma",
        email: "emma@example.com",
      },
      avatar: "https://picsum.photos/seed/4/40/40",
      missionsActuelles: {
        collaborateurReferent: "Charles Dupont",
        expertComptable: "David Petit",
        typeMission: "Tenue",
      },
      activites: {
        codeAPE: "2620Z",
        secteurActivites: "Fabrication d'ordinateurs et d'équipements périphériques",
        regimeTVA: "Débit",
        regimeFiscal: "IS régime réel normal",
        typologieClientele: "B to B",
      },
      obligationsLegales: {},
      questionnaire: {}
    },
    {
      id: "C005",
      identifiantInterne: "C005",
      siren: "998877665",
      raisonSociale: "Innovatech",
      formeJuridique: "SASU",
      dateDeCloture: "31/12",
      contactPrincipal: {
        nom: "Leroy",
        prenom: "Lucas",
        email: "lucas.leroy@example.com"
      },
      avatar: "https://picsum.photos/seed/5/40/40",
      missionsActuelles: {
        collaborateurReferent: "Sophie Dubois",
        expertComptable: "Bob Durand",
        typeMission: "Révision"
      },
      activites: {
        codeAPE: "6202A",
        secteurActivites: "Conseil en systèmes et logiciels informatiques",
        regimeTVA: "Débit",
        regimeFiscal: "IS régime réel normal",
        typologieClientele: "B to B"
      },
      obligationsLegales: {},
      questionnaire: {}
    },
    {
      id: "C006",
      identifiantInterne: "C006",
      siren: "333444555",
      raisonSociale: "Gourmet Express",
      formeJuridique: "SARL",
      dateDeCloture: "31/12",
      contactPrincipal: {
        nom: "Garcia",
        prenom: "Mia",
        email: "mia.garcia@example.com"
      },
      avatar: "https://picsum.photos/seed/6/40/40",
      missionsActuelles: {
        collaborateurReferent: "Alice Martin",
        expertComptable: "David Petit",
        typeMission: "Tenue"
      },
      activites: {
        codeAPE: "5610A",
        secteurActivites: "Restauration traditionnelle",
        regimeTVA: "Encaissement",
        regimeFiscal: "IS régime simplifié",
        typologieClientele: "B to C"
      },
      obligationsLegales: {},
      questionnaire: {}
    }
  ];
  
  export const allColumns = {
    identifiantInterne: "Identifiant interne",
    siren: "SIREN",
    raisonSociale: "Raison sociale",
    formeJuridique: "Forme juridique",
    dateDeCloture: "Date de clôture",
    contactPrincipal: "Contact principal",
    collaborateurReferent: "Collaborateur référent",
    expertComptable: "Expert-comptable",
    typeMission: "Type de mission",
    codeAPE: "Code APE",
    secteurActivites: "Secteur d’activités",
    regimeTVA: "Régime de TVA",
    regimeFiscal: "Régime fiscal",
    typologieClientele: "Typologie de clientèle",
    obligationsLegales: "Obligations légales",
  };
  
