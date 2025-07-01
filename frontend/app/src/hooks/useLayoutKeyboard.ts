import useKeyboardShortcuts from '@/hooks/useKeyboardShortcuts'

interface UseLayoutKeyboardParams {
  onOpenSearch: () => void
}

/**
 * Custom hook for managing layout-specific keyboard shortcuts
 * Encapsulates keyboard interaction logic
 */
export const useLayoutKeyboard = ({ onOpenSearch }: UseLayoutKeyboardParams) => {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts({
    onOpenSearch
  })

  // This hook could be extended in the future to handle additional layout-specific
  // keyboard shortcuts such as:
  // - Tab navigation (Ctrl+Tab, Ctrl+Shift+Tab)
  // - Sidebar toggle (Ctrl+B)
  // - Panel toggle (Ctrl+Shift+E)
  // - Quick settings (Ctrl+,)
}

export default useLayoutKeyboard
