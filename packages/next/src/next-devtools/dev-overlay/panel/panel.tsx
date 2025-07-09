import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useDevOverlayContext } from '../../dev-overlay.browser'
import { ResizeProvider } from '../components/devtools-panel/resize/resize-provider'
import { usePanelContext } from '../menu/context'
import { Overlay } from '../components/overlay'
import { INDICATOR_PADDING } from '../components/devtools-indicator/devtools-indicator'
import { Draggable } from '../components/errors/dev-tools-indicator/draggable'
import {
  ACTION_DEVTOOLS_PANEL_POSITION,
  ACTION_DEVTOOLS_POSITION,
  STORAGE_KEY_PANEL_POSITION,
} from '../shared'
import { ResizeHandle } from '../components/devtools-panel/resize/resize-handle'

export function DevtoolPanel({
  header,
  children,
  draggable = true,
  resizable = true,
}: {
  header: React.ReactNode
  children: React.ReactNode
  draggable?: boolean
  resizable?: boolean
}) {
  // might need this, we will see
  const [prevIsErrorOverlayOpen, setPrevIsErrorOverlayOpen] = useState(false)

  const { dispatch, state } = useDevOverlayContext()
  // i don't know if this is even needed with this state
  if (state.isErrorOverlayOpen !== prevIsErrorOverlayOpen) {
    if (state.isErrorOverlayOpen) {
      // We should always show the issues tab initially if we're
      // programmatically opening the panel to highlight errors.
    }
    setPrevIsErrorOverlayOpen(state.isErrorOverlayOpen)
  }
  const panelPosition = state.devToolsPanelPosition || state.devToolsPosition

  // Use panel position if set, otherwise default to near the indicator
  // const panelPosition = state.devToolsPanelPosition || state.devToolsPosition
  const [vertical, horizontal] = panelPosition.split('-', 2)
  const resizeRef = useRef<HTMLDivElement>(null)

  const positionStyle =
  // hard coded cause testing
    `${vertical}-${horizontal}` === 'bottom-left'
      ? {
          bottom: '65px',
          left: `${INDICATOR_PADDING}px`,
          top: 'auto',
          right: 'auto',
        }
      : {
          [vertical]: `${INDICATOR_PADDING}px`,
          [horizontal]: `${INDICATOR_PADDING}px`,
          [vertical === 'top' ? 'bottom' : 'top']: 'auto',
          [horizontal === 'left' ? 'right' : 'left']: 'auto',
        }

  return (
    <ResizeProvider
      value={{
        resizeRef,
        minWidth: 400,
        minHeight: 350,
        devToolsPosition: state.devToolsPosition,
      }}
    >
      <div
        ref={resizeRef}
        data-nextjs-devtools-panel-overlay
        data-nextjs-dialog-overlay
        data-gaga
        style={{
          ...positionStyle,
          minWidth: '400px',
          minHeight: '350px',
          maxHeight: '1000px',
          maxWidth: '1000px',
   
    
        }}
      >
        <Draggable
          data-nextjs-devtools-panel-draggable
          padding={INDICATOR_PADDING}
          onDragStart={() => {}}
          position={panelPosition}
          setPosition={(p) => {
            localStorage.setItem(STORAGE_KEY_PANEL_POSITION, p)
            dispatch({
              type: ACTION_DEVTOOLS_PANEL_POSITION,
              devToolsPanelPosition: p,
            })
          }}
          dragHandleSelector="[data-nextjs-devtools-panel-header], [data-nextjs-devtools-panel-footer], [data-nextjs-devtools-panel-draggable]"
          style={{
            // so many border radius ah
            // borderRadius: 'var(--rounded-xl)',
            overflow: 'auto',
          }}
          disableDrag={!draggable}
        >
          <>
            <div
              style={{
                // width: '100%',
                // height: '100%',
                position: 'relative',
                // background: ' var(--color-background-200)',
                // borderRadius: 'var(--rounded-xl)',
                width: '100%',
                height: '100%',
                border: "2px solid var(--color-gray-200)",
                borderRadius: "var(--rounded-xl)",
                background: "var(--color-background-200)",
                       overflow: 'auto'
              }}
            >
              {/* todo: render header better */}
              {header}
              {children}
            </div>
            {resizable && (
              <>
                <ResizeHandle direction="top" />
                <ResizeHandle direction="right" />
                <ResizeHandle direction="bottom" />
                <ResizeHandle direction="left" />
                <ResizeHandle direction="top-left" />
                <ResizeHandle direction="top-right" />
                <ResizeHandle direction="bottom-left" />
                <ResizeHandle direction="bottom-right" />
              </>
            )}
          </>
        </Draggable>
      </div>
    </ResizeProvider>
  )
}
