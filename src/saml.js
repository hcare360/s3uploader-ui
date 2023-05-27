// OAuth setup to support SAML SSO
const urlPrefix =
  window.location.origin + window.location.pathname.replace(/[^/]*$/, "");
export const oauth = {
  domain: "brooks.auth.eu-west-1.amazoncognito.com",
  scope: ["email", "openid", "profile"],
  responseType: "code",
  redirectSignOut: urlPrefix,
  redirectSignIn: urlPrefix,
};
// Name of SAML federated provider in Cognito
export const federationSettings = {
  customProvider: "COGNITO",
};
