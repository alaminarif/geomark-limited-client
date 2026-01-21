import Footer from "./Footer";

interface IProps {
  children: React.ReactNode;
}

export default function CommonLayout({ children }: IProps) {
  return (
    <div className=" min-h-screen flex flex-col">
      {/* <Navbar /> */}
      <div className="grow-1">{children}</div>
      <Footer />
    </div>
  );
}
