import type { ErrorBlueprint } from 'v1/errors/blueprint.js'

type InvalidSegmentOptionErrorBlueprint = ErrorBlueprint<{
  code: 'scanCommand.invalidSegmentOption'
  hasPath: false
  payload: { segment?: unknown; totalSegments?: unknown }
}>

export type ScanCommandErrorBlueprints = InvalidSegmentOptionErrorBlueprint
