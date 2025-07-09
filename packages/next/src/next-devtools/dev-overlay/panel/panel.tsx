import { useRef, useState } from 'react'
import { useDevOverlayContext } from '../../dev-overlay.browser'
import { ResizeProvider } from '../components/devtools-panel/resize/resize-provider'
import { usePanelContext } from '../menu/context'
import { Overlay } from '../components/overlay'
import { INDICATOR_PADDING } from '../components/devtools-indicator/devtools-indicator'
import { Draggable } from '../components/errors/dev-tools-indicator/draggable'
import { ACTION_DEVTOOLS_POSITION, STORAGE_KEY_POSITION } from '../shared'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
} from '../components/dialog'
import { ResizeHandle } from '../components/devtools-panel/resize/resize-handle'

export function DevOverlayPanel({
  header,
  children,
}: {
  header: React.ReactNode
  children: React.ReactNode
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

  const [vertical, horizontal] = state.devToolsPosition.split('-', 2)
  const resizeRef = useRef<HTMLDivElement>(null)
  const onCloseDevToolsPanel = () => {
    // dispatch({ type: ACTION_DEVTOOLS_PANEL_CLOSE })
    // dispatch({ type: ACTION_ERROR_OVERLAY_CLOSE })
  }

  // const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   dispatch({
  //     type: ACTION_DEVTOOLS_POSITION,
  //     devToolsPosition: e.target.value as Corners,
  //   })
  //   localStorage.setItem(STORAGE_KEY_POSITION, e.target.value)
  // }

  // was this for the settings? will need to sync later
  // const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   dispatch({
  //     type: ACTION_DEVTOOLS_SCALE,
  //     scale: Number(e.target.value),
  //   })
  //   localStorage.setItem(STORAGE_KEY_SCALE, e.target.value)
  // }

  // const handleFullscreenToggle = () => {
  //   setIsFullscreen((prev: any) => !prev)
  //   dispatch({ type: ACTION_ERROR_OVERLAY_CLOSE })
  // }

  const positionStyle =
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
        // mf does this do anything, this does -> calc(100% + 8px)
        style={{
          ...positionStyle,
          minWidth: '400px',
          minHeight: '350px',
          maxHeight: '1000px',
          maxWidth: '1000px',
          width: '100%',
          height: '100%',
        }}
      >
        <Draggable
          data-nextjs-devtools-panel-draggable
          padding={INDICATOR_PADDING}
          onDragStart={() => {}}
          position={state.devToolsPosition}
          setPosition={(p) => {
            localStorage.setItem(STORAGE_KEY_POSITION, p)
            dispatch({
              type: ACTION_DEVTOOLS_POSITION,
              devToolsPosition: p,
            })
          }}
          dragHandleSelector="[data-nextjs-devtools-panel-header], [data-nextjs-devtools-panel-footer], [data-nextjs-devtools-panel-draggable]"
          style={{
            // so many border radius ah
            borderRadius: 'var(--rounded-xl)',
            overflow: 'auto',
          }}
          // disableDrag={isFullscreen} <-- this will be useful later
        >
          <>
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                background: ' var(--color-background-200)',
                borderRadius: 'var(--rounded-xl)',
              }}
            >
              {children}
            </div>
            <ResizeHandle direction="top" />
            <ResizeHandle direction="right" />
            <ResizeHandle direction="bottom" />
            <ResizeHandle direction="left" />
            <ResizeHandle direction="top-left" />
            <ResizeHandle direction="top-right" />
            <ResizeHandle direction="bottom-left" />
            <ResizeHandle direction="bottom-right" />
          </>
        </Draggable>
      </div>
    </ResizeProvider>
  )
}

// {/* what is overlay doing?? */}
// {/* i dont know if we need an overlay at all ,what is an overlay in this context? wut */}
// <Overlay
// ref={resizeRef}
// data-nextjs-devtools-panel-overlay
// style={
//   `${vertical}-${horizontal}` === 'bottom-left'
//       ? {
//           bottom: '40px',
//           // right: INDICATOR_PADDING,
//           top: 'auto',
//           right: 'auto',
//         }
//       : {
//           [vertical]: `${INDICATOR_PADDING}px`,
//           [horizontal]: `${INDICATOR_PADDING}px`,
//           [vertical === 'top' ? 'bottom' : 'top']: 'auto',
//           [horizontal === 'left' ? 'right' : 'left']: 'auto',
//         }

// }
// >
// {/* TODO: Investigate why onCloseDevToolsPanel on Dialog doesn't close when clicked outside. */}
// {/* i dont think we need a backdrop */}
// {/* <OverlayBackdrop
//   data-nextjs-devtools-panel-overlay-backdrop={isFullscreen}
//   onClick={onCloseDevToolsPanel}
// /> */}

// </Overlay>
