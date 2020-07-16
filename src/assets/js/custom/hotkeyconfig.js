const hotkeyconfig = {
  'ctrl+e': {
    // page component path means the hot key config will effect only equal to current page component path
    // if you use wildcard, write the method in custom/base.js
    // if you don't use wildcard but page path, write the method in page component SFC
    'logline/Logline': [
      {
        name: `Logline 'Ctrl+e' event`,
        method: 'exportLog'
      }
    ],
    '*': []
  }
}

export default hotkeyconfig
