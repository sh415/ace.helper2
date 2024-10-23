<template>
  <ul class="versions">
    <li class="build">Build v{{ appVersion }}</li>
    <li class="electron-version">Electron v{{ versions.electron }}</li>
    <li class="chrome-version">Chrom v{{ versions.chrome }}</li>
    <li class="node-version">Node v{{ versions.node }}</li>
  </ul>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue'

  const versions = reactive({ ...window.electron.process.versions }) // const versions = ref({ ...window.electron.process.versions }
  const appVersion = ref();

  onMounted(async () => {
    appVersion.value = await window.electron.ipcRenderer.invoke('getAppVersion'); // package.json의 애플리케이션 버전
  })

  // 지연시간 추가 setTimeOut 대체
  const waitForTimeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

</script>