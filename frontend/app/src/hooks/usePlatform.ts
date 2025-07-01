import type { PlatformService } from '../services/platformService'
import { getPlatformService } from '../services/platformService'

export const usePlatform = (): PlatformService => {
  return getPlatformService()
}

export const usePlatformInfo = () => {
  const platformService = getPlatformService()

  return {
    isElectron: platformService.isElectron(),
    isBrowser: platformService.isBrowser(),
    platform: platformService.getPlatform(),
  }
}

