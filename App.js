// Se exceeds 750 z-index (2 battery indicators/notification and one other)
import Layout from "./layout";
import { AuthProvider } from "./src/context/authContext";

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}
