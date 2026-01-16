import { User } from "../types/user";

// Helper to get initial user values
export const getInitialUser = (): User => ({
    role: null,
    permission: null,
    master_user: false,
    super_master_user: false,
    nickname: '',
    name: '',
    branch_fantasy_name: null,
});
