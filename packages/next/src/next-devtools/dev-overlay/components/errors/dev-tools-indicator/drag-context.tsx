// Drag context to coordinate Draggable and its DragHandle children
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react'

interface DragContextValue {
  /** Register a new handle element */
  register: (el: HTMLElement) => void
  /** Unregister a handle element */
  unregister: (el: HTMLElement) => void
  /** All currently registered handles */
  handles: Set<HTMLElement>
  /** Whether dragging is globally disabled in this provider */
  disabled: boolean
}

const DragContext = createContext<DragContextValue | null>(null)

export function DragProvider({
  children,
  disabled = false,
}: {
  children: React.ReactNode
  disabled?: boolean
}) {
  const handlesRef = useRef<Set<HTMLElement>>(new Set())

  const register = useCallback((el: HTMLElement) => {
    handlesRef.current.add(el)
  }, [])

  const unregister = useCallback((el: HTMLElement) => {
    handlesRef.current.delete(el)
  }, [])

  const value = useMemo<DragContextValue>(
    () => ({ register, unregister, handles: handlesRef.current, disabled }),
    [register, unregister, disabled]
  )

  return <DragContext.Provider value={value}>{children}</DragContext.Provider>
}

/**
 * Use inside Draggable to access the current set of handles.
 */
export function useDragContext() {
  return useContext(DragContext)
}

/**
 * Simple wrapper representing an area that initiates dragging of the closest Draggable within the DragProvider.
 *
 * Example:
 * ```
 * <DragHandle className="my-handle">≡</DragHandle>
 * ```
 */
export const DragHandle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function DragHandle({ children, ...props }, forwardedRef) {
  const internalRef = useRef<HTMLDivElement>(null)
  const ctx = useDragContext()

  // Combine forwarded ref and internal ref
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      internalRef.current = node ?? null
      if (typeof forwardedRef === 'function') {
        forwardedRef(node)
      } else if (forwardedRef && typeof forwardedRef === 'object') {
        ;(
          forwardedRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = node
      }
    },
    [forwardedRef]
  )

  React.useEffect(() => {
    if (!ctx || !internalRef.current || ctx.disabled) return
    const el = internalRef.current
    ctx.register(el)
    return () => ctx.unregister(el)
  }, [ctx])

  return (
    <div
      ref={setRef}
      {...props}
      style={{
        cursor: ctx?.disabled ? 'default' : 'grab',
        ...(props.style || {}),
      }}
    >
      {children}
    </div>
  )
})
