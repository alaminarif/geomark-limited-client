import Loading from "./Loading";
import { useLoader } from "./loaderContext";

export default function GlobalLoader() {
  const { isLoading } = useLoader();
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-background/60 backdrop-blur-sm">
      <Loading />
    </div>
  );
}
