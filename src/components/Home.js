import {
  Alert,
  Container,
  FormField,
  Header,
  Button,
  SpaceBetween,
} from "@cloudscape-design/components";
import { useNavigate } from "react-router";
export function Home() {
  const navigate = useNavigate();
  return (
    <Container
      header={<Header variant="h2">HCare360 Cloud Share for Brooks.</Header>}
    >
      <Button onClick={() => navigate("/cloudshare")}>Login</Button>
    </Container>
  );
}
