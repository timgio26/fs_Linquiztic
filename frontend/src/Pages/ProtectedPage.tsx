import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GetCurrentUser } from "../services/firebase";

type ProtectedPageProp = {
  children: ReactNode;
};

export function ProtectedPage({ children }: ProtectedPageProp) {
  const [checking, setChecking] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function GetUser() {
      const user = await GetCurrentUser();
      if (!user) {
        navigate("/auth", { replace: true });
        return;
      }
      setChecking(false);
    }
    GetUser();
  }, [navigate]);

  if (checking)
    return (
      <>
        <span>Loading</span>
      </>
    );

  return <>{children}</>;
}
