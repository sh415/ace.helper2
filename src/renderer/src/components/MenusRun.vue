<template>

  <div class="flex flex-col items-center justify-start h-screen">

    <div class="py-4"></div>

    <!-- 버튼 영역 -->
    <div class="py-4">
      <Button v-if="isTriggerRun"
        icon="pi pi-bolt" 
        label="프로그램 실행" 
        size="small" 
        severity="contrast" 
        aria-label="Star" 
        @click="triggerRun"
      />
      <Button v-else
        icon="pi pi-bolt" 
        label="아직 실행할 수 없습니다." 
        size="small" 
        severity="contrast" 
        aria-label="Star" 
        @click=""
        disabled
      />

    </div>

    <div class="py-2"></div>

    <!-- 웹뷰 영역 -->
    <div v-if="isTriggerRun" class="flex justify-center">
      <webview 
        is="webview" 
        src="https://www.naver.com/" 
        style="width: 500px; height: 400px;"
        frameborder="0"
      ></webview>
    </div>
    <div v-else></div>
  </div>

</template>

<script setup>
  import { ref, onMounted } from "vue";

  const isTriggerRun = ref(false);
  
  onMounted (async () => {
    await getData();
  })

  const getData = async () => {
    const data = await window.electron.ipcRenderer.invoke('checkSettings');
    console.log('getData() -> data', data);
  }

</script>