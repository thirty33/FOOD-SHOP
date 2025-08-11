import { useNavigate } from "react-router-dom";
import { ROUTES } from "../config/routes";
import { User } from "../types/user";

export function useManageInitNavigation() {
  const navigate = useNavigate();

  const handleInitialNavigation = (user: User) => {
    if (user.master_user) {
      navigate(ROUTES.SUBORDINATES_USER);
    } else {
      navigate(ROUTES.MENUS);
    }
  };

  return {
    handleInitialNavigation
  };
}