import { usePanelContext } from './context'
import { DevtoolMenu } from './dev-overlay-menu'
import { DevtoolPanel } from '../panel/panel'
import { SettingsTab } from '../components/devtools-panel/devtools-panel-tab/settings-tab'
import { RouteInfo } from '../components/errors/dev-tools-indicator/dev-tools-info/route-info'
import { PageSegmentTree } from '../components/overview/segment-explorer'
import { TurbopackInfo } from '../components/errors/dev-tools-indicator/dev-tools-info/turbopack-info'

export const PanelRouter = () => {
  const { panel } = usePanelContext()

  switch (panel) {
    case 'panel-selector': {
      // will need to probably pass/share more later
      return <DevtoolMenu />
    }
    case 'preferences': {
      return (
        <DevtoolPanel
          draggable={false}
          resizable={false}
          header={<>Preferences header TBD</>}
        >
          <SettingsTab />
        </DevtoolPanel>
      )
    }
    case 'route-info': {
      return (
        <DevtoolPanel
          draggable={false}
          resizable={false}
          header={<>Route info header TBD</>}
        >
          <RouteInfo />
        </DevtoolPanel>
      )
    }
    case 'segment-explorer': {
      return (
        <DevtoolPanel header={<>Segment explorer header tbd</>}>
          <PageSegmentTree />
        </DevtoolPanel>
      )
    }
    case 'turbo-info': {
      return (
        <DevtoolPanel draggable={false} resizable={false} header={<></>}>
          <TurbopackInfo
            // tbd need to see how close/trigger ref is being used, can probably context those since it shows up everywhere
            close={() => {}}
            triggerRef={{ current: null! }}
            isOpen={true}
          />
        </DevtoolPanel>
      )
    }
    // need a few more cases
    default: {
      return
    }
  }
}
