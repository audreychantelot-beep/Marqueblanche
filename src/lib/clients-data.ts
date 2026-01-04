export const clients = [
    {
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
      obligationsLegales: {
        assujettiReforme: "À définir",
        eInvoicing: "À définir",
        eReportingTransaction: "À définir",
        eReportingPaiement: "À définir",
        paEmission: "À définir",
        paReception: "À définir",
      },
      questionnaire: {
        q4_reponse: "Oui",
        q4_software: "Cegid",
        q4_method: ""
      }
    },
    {
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
      obligationsLegales: {
        assujettiReforme: "À définir",
        eInvoicing: "À définir",
        eReportingTransaction: "À définir",
        eReportingPaiement: "À définir",
        paEmission: "À définir",
        paReception: "À définir",
      },
      questionnaire: {
        q4_reponse: "Non",
        q4_software: "",
        q4_method: "Excel"
      }
    },
    {
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
      obligationsLegales: {
        assujettiReforme: "À définir",
        eInvoicing: "À définir",
        eReportingTransaction: "À définir",
        eReportingPaiement: "À définir",
        paEmission: "À définir",
        paReception: "À définir",
      },
      questionnaire: {
        q4_reponse: "Oui",
        q4_software: "SumUp",
        q4_method: ""
      }
    },
  ];
  
  export type Client = typeof clients[0];
  
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
  
