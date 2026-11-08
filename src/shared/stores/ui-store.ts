import { create } from "zustand";

/**
 * 앱 전역 UI 상태 예시. 서버 데이터는 절대 여기에 두지 않는다. (TanStack Query 담당)
 * 한 feature에서만 쓰는 상태는 features/<도메인>/store.ts에 둔다.
 */
interface UiState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
