import Md from 'workerize-loader!@/worker/markdown-it'

const md = new Md()

export const { initialize, getImportStates, updateData } = md

export default async function() {
  await md.getInitializePromise()

  return md
}
