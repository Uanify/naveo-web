export const siteConfig = {
  name: "Naveo",
  url: "https://www.naveo.mx",
  description: "Centro de mando para logística de última milla.",
  baseLinks: {
    dashboard: "/dashboard",
    orders: "/orders",
    drivers: "/drivers",
    branches: "/branches",
    wallet: "/wallet",
    map: "/map",
    clients: "/clients",
    profile: "/profile",
    naveoConnect: "/naveo-connect",
  },
  auth: {
    login: "/login",
    signup: "/signup",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    onboarding: "/onboarding",
    verifyAccount: "/verify-account",
  },
  public: {
    privacy: "/privacy-policy",
    terms: "/terms-conditions",
  }
}

export type SiteConfig = typeof siteConfig