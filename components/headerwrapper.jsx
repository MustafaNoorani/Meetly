
import { CheckUser } from "@/lib/checkuser";
import Header from "./Header";

const HeaderWrapper = async () => {
  await CheckUser(); // Server-side call 
  return <Header />;
};

export default HeaderWrapper;
