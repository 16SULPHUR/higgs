import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import styles from "./HomePage.module.css";
import { clearAllCookies } from "./lib/cookieUtils";

export default async function HomePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("accessToken")?.value;
  const role = cookieStore.get("role")?.value || "";

  if (!session) {
    redirect("/login");
  }

  const roleSuffix = role.split("_")[0];
  if (roleSuffix === "USER" || roleSuffix === "ORG") {
    redirect("/dashboard");
  } else if (roleSuffix === "ADMIN") {
    redirect("/admin/dashboard");
  } else {
    clearAllCookies(); 
    redirect("/login");
  }

  return <div className={styles.pageContainer}></div>;
}
