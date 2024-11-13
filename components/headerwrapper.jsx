"use server";
import { CheckUser } from "@/lib/checkuser";
import Header from "./header";

const HeaderWrapper = async () => {
  await CheckUser(); // Server-side call 
  return <Header />
};

export default HeaderWrapper;
