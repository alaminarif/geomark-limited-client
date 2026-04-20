import { Outlet } from "react-router";
import CommonLayout from "./components/layout/CommonLayout";
import Background from "./components/Background";
import RouteSEO from "./components/RouteSEO";

function App() {
  return (
    <Background>
      <RouteSEO />
      <CommonLayout>
        <Outlet />
      </CommonLayout>
    </Background>
  );
}

export default App;
