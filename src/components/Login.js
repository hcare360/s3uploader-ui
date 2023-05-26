import { useAuthenticator, View, Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Container, Header, Button } from "@cloudscape-design/components";
import { Auth } from "aws-amplify";

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
    const redirect_uri =
      window.location.protocol + "//" + window.location.host + "/";
    const SAMLURL =
      "https://brooks.auth.eu-west-1.amazoncognito.com/login?response_type=token&client_id=5r9g38k9lkd46i3ore4caobp6m&redirect_uri=" +
      redirect_uri;
    return (
      <Container
        header={<Header variant="h2">HCare360 Cloud Share for Brooks.</Header>}
      >
        <Button
          onClick={() => Auth.federatedSignIn({ customProvider: "Brooks" })}
        >
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
