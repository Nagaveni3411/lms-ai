import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  tree: null,
  loading: false,
  error: null,
  setTree: (tree) => set({ tree, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  markVideoCompleted: (videoId) =>
    set((state) => {
      if (!state.tree) return state;
      return {
        ...state,
        tree: {
          ...state.tree,
          sections: state.tree.sections.map((section) => ({
            ...section,
            videos: section.videos.map((video) =>
              Number(video.id) === Number(videoId) ? { ...video, is_completed: true } : video
            )
          }))
        }
      };
    })
}));

