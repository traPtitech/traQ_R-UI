import Md from 'workerize-loader!@/worker/markdown-it'

class Renderer {
  constructor() {
    this.worker = new Md()
  }
  async getInitializedWorker() {
    await this.worker.getInitializePromise()
    return this.worker
  }
  async updateData(key, val) {
    ;(await this.getInitializedWorker()).updateData(key, val)
  }
  async render(text) {
    return (await this.getInitializedWorker()).render(text)
  }
  initialize(states) {
    return this.worker.initialize(states)
  }
  stop() {
    this.worker.terminate()
  }
}

class RendererManager {
  renderers = new Map()
  constructor() {
    this.spareRenderer = new Renderer()
  }
  initialize(states) {
    this.states = states

    for (const r of this.renderers.values()) {
      r.initialize(this.states)
    }
    this.spareRenderer.initialize(this.states)
  }
  createRenderer(scope) {
    this.renderers.set(scope, this.spareRenderer)
    this.spareRenderer = new Renderer()
    if (this.states) {
      this.spareRenderer.initialize(this.states)
    }
  }
  updateData(key, val) {
    for (const r of this.renderers.values()) {
      r.updateData(key, val)
    }
    this.spareRenderer.updateData(key, val)
  }
  async getImportStates() {
    return this.spareRenderer.worker.getImportStates()
  }
  async render(scope, text) {
    if (!this.renderers.has(scope)) {
      this.createRenderer(scope)
    }
    return this.renderers.get(scope).render(text)
  }
  stop(scope) {
    if (this.renderers.has(scope)) {
      const renderer = this.renderers.get(scope)
      renderer.stop()
      this.renderers.delete(scope)
    } else {
      console.warn(
        `unpredicted scope was set. set: ${scope}. exists: ${Array.from(
          this.renderers.keys()
        ).join(',')}}`
      )
    }
  }
}
export const rendererManager = new RendererManager()

export const inlineRenderer = new Renderer()

export const renderInline = async text => {
  const ir = await inlineRenderer.getInitializedWorker()
  return ir.renderInline(text)
}
