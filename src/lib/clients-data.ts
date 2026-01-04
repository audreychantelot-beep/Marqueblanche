
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
  };
  questionnaire?: Questionnaire;
};

export const clients: (Client & { id: string })[] = [
    {
      id: "C001",
      identifiantInterne: "C001",
      siren: "123456789",
      raisonSociale: "Johnson & Co",
      formeJuridique: "SARL",
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
        q4: "Oui",
        q4_software: "Cegid",
      }
    },
    {
      id: "C002",
      identifiantInterne: "C002",
      siren: "987654321",
      raisonSociale: "Smith Enterprises",
      formeJuridique: "SAS",
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
        q4_method: "Excel"
      }
    },
    {
      id: "C003",
      identifiantInterne: "C003",
      siren: "112233445",
      raisonSociale: "Williams Solutions",
      formeJuridique: "EURL",
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
      }
    },
    {
      id: "C004",
      identifiantInterne: "C004",
      siren: "556677889",
      raisonSociale: "Brown Industries",
      formeJuridique: "SA",
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
    }
  ];
  
  export const allColumns = {
    identifiantInterne: "Identifiant interne",
    siren: "SIREN",
    raisonSociale: "Raison sociale",
    formeJuridique: "Forme juridique",
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
  
