import { useAuthenticator, View, Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Container, Header, Button } from "@cloudscape-design/components";
import { Auth } from "aws-amplify";
import { federationSettings } from "../saml";
const USESAML = true;
export function Login() {
  const { route } = useAuthenticator((context) => [context.route]);
  const location = useLocation();
  const navigate = useNavigate();
  let from = location.state?.from?.pathname || "/";
  useEffect(() => {
    if (route === "authenticated") {
      navigate(from, { replace: true });
    }
  }, [route, navigate, from]);

  if (USESAML) {
    return (
      <Container header={<Header variant="h2">Cloud Share</Header>}>
        <Button onClick={() => Auth.federatedSignIn(federationSettings)}>
          SSO Login
        </Button>
      </Container>
    );
  } else {
    return (
      <View className="auth-wrapper">
        <Authenticator></Authenticator>
      </View>
    );
  }
}
