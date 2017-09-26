<template>
  <div id="app">
    <loading ref="loading"></loading>

    <transition name="page" mode="out-in">
      <component v-if="layout" :is="layout"></component>
    </transition>
  </div>
</template>

<script>
const layouts = {}
const requireContext = require.context('../layouts', false, /.*\.vue$/)

requireContext.keys().forEach(file => {
  const name = file.replace(/(^.\/)|(\.vue$)/g, '')

  layouts[name] = requireContext(file)
})

import Loading from './Loading'

export default {
  name: 'App',

  components: {
    Loading
  },

  metaInfo() {
    const { appName } = window.config
    return {
      title: appName,
      titleTemplate: `%s · ${appName}`
    }
  },

  data: () => ({
    layout: null,
    defaultLayout: 'app'
  }),

  mounted() {
    this.$loading = this.$refs.loading
  },

  methods: {
    /**
     * Set the application layout.
     *
     * @param {String} layout
     */
    setLayout(layout) {
      if (!layout || !layouts[layout]) {
        layout = this.defaultLayout
      }

      this.layout = layouts[layout]
    }
  }
}
</script>
