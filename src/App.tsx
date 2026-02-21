import { Outlet } from "react-router";
import CommonLayout from "./components/layout/CommonLayout";
import Background from "./components/Background";

function App() {
  return (
    <Background>
      <CommonLayout>
        <Outlet />
      </CommonLayout>
    </Background>
  );
}

export default App;
