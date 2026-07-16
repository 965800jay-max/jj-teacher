import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'

await rm(resolve('dist/downloads/julebu-android-release.apk'), { force: true })
