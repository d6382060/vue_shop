module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        customStyleName: (name) => {
          return `element-plus/lib/theme-chalk/${name}.css`;
        }
      }
    ]
  ]
}