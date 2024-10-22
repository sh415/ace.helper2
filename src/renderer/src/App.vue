<template>
  <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">Powered by electron-vite</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
  </div>
  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <div class="actions">
    <!-- <div class="action">
      <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
    </div> -->

    <Button label="자동 경매올리고 포스팅" icon="pi pi-search" size="small" @click="" />
  </div>

  <div class="pt-4">Text...</div>

  <Versions />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Versions from './components/Versions.vue'

const enableAuction = ref(false);
const updateProgress = ref();

onMounted(async () => {
  await waitForTimeout(1000);

  // 1. 업데이트 확인
  await checkUpdate();
})

const checkUpdate = async () => {
  window.electron.ipcRenderer.send('checkUpdate');
}

/** 업데이트 관련 */
window.electron.ipcRenderer.on('updateChecking', async (event, res) => {
  console.log(res);
  if (res.result) {
    updateProgress.value = res.message;

  } else {
    updateProgress.value = res.message
  }
});

const ipcHandle = () => window.electron.ipcRenderer.send('ping')

// 지연시간 추가 setTimeOut 대체
const waitForTimeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

</script>