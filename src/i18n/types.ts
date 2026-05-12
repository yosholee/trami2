export interface ServiceItem {
   title: string;
   body: string;
}

export interface PricingPlan {
   name: string;
   price: string;
   suffix: string;
   blurb: string;
   features: string[];
   highlight: boolean;
}

export interface FaqItem {
   q: string;
   a: string;
}

export interface Testimonial {
   name: string;
   role: string;
   quote: string;
   initials: string;
}

export interface ValueTab {
   title: string;
   body: string;
}

export interface LocalAreaItem {
   city: string;
   title: string;
   body: string;
   cta: string;
}

export interface LandingMessages {
   meta: {
      title: string;
      description: string;
      keywords: string;
      ogLocale: string;
   };
   nav: {
      home: string;
      services: string;
      pricing: string;
      faq: string;
      contact: string;
      login: string;
      signup: string;
      menuOpen: string;
      menuClose: string;
      /** Accessible label for header light/dark toggle. */
      themeToggle: string;
   };
   langSwitcher: {
      label: string;
      es: string;
      en: string;
   };
   hero: {
      badge: string;
      /** Opening line (white), e.g. "You need, " */
      h1Lead: string;
      /** Accent line (yellow), e.g. "we deliver" */
      h1Accent: string;
      sub: string;
      ctaAccount: string;
      ctaServices: string;
      /** Accessible label for the WhatsApp CTA (e.g. open chat in a new tab). */
      ctaWhatsappAria: string;
      calloutTopBefore: string;
      calloutTopPacked: string;
      calloutTopMiddle: string;
      calloutTopShipped: string;
      calloutQuickly: string;
      calloutHitchMid: string;
      calloutHitch: string;
      calloutPrior: string;
      calloutConvenience: string;
      mobileTagline: string;
      imageAlt: string;
   };
   trust: {
      heading: string;
      fastTitle: string;
      fastDetail: string;
      secureTitle: string;
      secureDetail: string;
      supportTitle: string;
      supportDetail: string;
   };
   value: {
      tabExperience: string;
      tabResponsibility: string;
      tabService: string;
      badge: string;
      ctaQuote: string;
      imageAlt: string;
      experience: ValueTab;
      responsibility: ValueTab;
      service: ValueTab;
   };
   services: {
      kicker: string;
      heading: string;
      sub: string;
      learnMore: string;
      cta: string;
      items: ServiceItem[];
   };
   localAreas: {
      kicker: string;
      heading: string;
      sub: string;
      items: LocalAreaItem[];
   };
   pricing: {
      kicker: string;
      heading: string;
      subBefore: string;
      subAfter: string;
      popular: string;
      cta: string;
      plans: PricingPlan[];
   };
   faq: {
      kicker: string;
      heading: string;
      sub: string;
      moreHelp: string;
      supportLink: string;
      items: FaqItem[];
   };
   features: {
      crmBentoOrdersAlt: string;
      crmBentoDashboardAlt: string;
      crmBentoLogisticsAlt: string;
      badge: string;
      heading: string;
      body: string;
      learnMore: string;
      tryNow: string;
   };
   location: {
      /** Text before the highlighted segment (include trailing space if needed). */
      headingBefore: string;
      /** Segment drawn with the Magic UI-style highlighter. */
      headingHighlight: string;
      /** Text after the highlighted segment. */
      headingAfter: string;
      body: string;
      track: string;
      dashboard: string;
      mapOriginHub: string;
      mapHavana: string;
      mapSantiagoDelivery: string;
      mapShipEnRoute: string;
      mapGroundLeg: string;
      mapDeliveryBadge: string;
      mapProvinces: {
         pinarDelRio: string;
         artemisa: string;
         matanzas: string;
         villaClara: string;
         camaguey: string;
         holguin: string;
         granma: string;
         guantanamo: string;
      };
   };
   how: {
      heading: string;
      cta: string;
      imageAlt: string;
      items: { title: string; text: string }[];
   };
   global: {
      kicker: string;
      heading: string;
      body: string;
      link: string;
      mapUsa: string;
      mapCuba: string;
   };
   testimonials: {
      heading: string;
      sub: string;
      starsLabel: string;
      items: Testimonial[];
   };
   social: {
      kicker: string;
      heading: string;
      sub: string;
      facebookLabel: string;
      googleLabel: string;
      tiktokLabel: string;
      opensNewTab: string;
   };
   finalCta: {
      heading: string;
      body: string;
      ctaAccount: string;
      ctaWhatsappAria: string;
      ctaSales: string;
      newsletter: string;
   };
   tracking: {
      meta: {
         title: string;
         description: string;
         keywords: string;
      };
      heading: string;
      sub: string;
      fieldLabel: string;
      placeholder: string;
      submit: string;
      searching: string;
      errorGeneric: string;
      rateLimited: string;
      notConfigured: string;
      fieldInvoice: string;
      fieldAgency: string;
      fieldProvince: string;
      fieldCity: string;
      fieldHbl: string;
      fieldDescription: string;
      fieldWeight: string;
      parcelsHeading: string;
      packageDetails: string;
      historialHeading: string;
      timelineHeading: string;
      terminalEvent: string;
      rawJson: string;
      opensAppHint: string;
      poweredByPrefix: string;
      poweredByLink: string;
      poweredBySuffix: string;
      backHome: string;
      suspenseFallback: string;
   };
   footer: {
      blurb: string;
      contact: string;
      hubs: string;
      siteLink: string;
      email: string;
      phone: string;
      address: string;
      hub1: string;
      hub2: string;
      hub3: string;
      rights: string;
      madeBy: string;
   };
}
